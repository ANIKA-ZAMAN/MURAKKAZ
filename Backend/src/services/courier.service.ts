import { env } from '../config/env';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendOrderShippedEmail, sendOrderDeliveredEmail } from './mail.service';

export const isSteadfastConfigured = (): boolean => {
  return Boolean(env.STEADFAST_API_KEY && env.STEADFAST_SECRET_KEY);
};

const getSteadfastHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Api-Key': env.STEADFAST_API_KEY || '',
    'Secret-Key': env.STEADFAST_SECRET_KEY || ''
  };
};

/**
 * Dispatches an order to Steadfast Courier API and marks it as SHIPPED
 */
export const createSteadfastConsignment = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payment: true }
  });

  if (!order) throw new AppError('Order not found', 404);

  // If already dispatched, return existing tracking info
  if (order.trackingNumber && (order.trackingNumber.startsWith('STDF-') || order.trackingNumber.startsWith('SF'))) {
    return {
      consignment_id: order.trackingNumber,
      tracking_code: order.trackingNumber,
      status: order.status,
      message: 'Order already dispatched with existing tracking number'
    };
  }

  const invoice = order.orderNumber;
  const recipientName = order.fullName;
  const recipientPhone = order.phone;
  const recipientAddress = order.address;
  const codAmount = order.payment?.status === 'VERIFIED' ? 0 : order.grandTotal;
  const note = `Fragile luxury perfume parcel (${order.items.map(i => `${i.productName} ${i.selectedSize} x${i.quantity}`).join(', ')})`;

  // Simulation mode if keys are not yet entered in .env
  if (!isSteadfastConfigured()) {
    const mockTrackingCode = 'STDF-' + Math.floor(100000 + Math.random() * 900000) + '-BD';
    console.log(`[Steadfast Sim Mode] Created mock consignment for order ${order.orderNumber} -> ${mockTrackingCode}`);

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber: mockTrackingCode,
        status: 'SHIPPED'
      },
      include: { payment: true, items: true }
    });

    // Trigger customer shipped email
    try {
      if (order.email && order.email.includes('@') && !order.email.includes('@guest.murakkaz.com')) {
        sendOrderShippedEmail({
          orderNumber: order.orderNumber,
          fullName: order.fullName,
          email: order.email,
          trackingNumber: mockTrackingCode,
          location: order.location
        }).catch(err => console.warn('Shipped email failed:', err));
      }
    } catch (e) {
      console.warn('Shipped email error:', e);
    }

    return {
      consignment_id: 'SIM-' + Date.now(),
      tracking_code: mockTrackingCode,
      status: 'in_review',
      order: updated,
      isSimulated: true
    };
  }

  const baseUrl = env.STEADFAST_BASE_URL || 'https://portal.packzy.com/api/v1';

  try {
    const payload = {
      invoice,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      recipient_address: recipientAddress,
      cod_amount: codAmount,
      note
    };

    const res = await fetch(`${baseUrl}/create_order`, {
      method: 'POST',
      headers: getSteadfastHeaders(),
      body: JSON.stringify(payload)
    });

    const data: any = await res.json();

    if (data && (data.status === 200 || data.consignment)) {
      const consignment = data.consignment;
      const trackingCode = consignment.tracking_code;

      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          trackingNumber: trackingCode,
          status: 'SHIPPED'
        },
        include: { payment: true, items: true }
      });

      // Trigger customer shipped email with live tracking code
      try {
        if (order.email && order.email.includes('@') && !order.email.includes('@guest.murakkaz.com')) {
          sendOrderShippedEmail({
            orderNumber: order.orderNumber,
            fullName: order.fullName,
            email: order.email,
            trackingNumber: trackingCode,
            location: order.location
          }).catch(err => console.warn('Shipped email failed:', err));
        }
      } catch (e) {
        console.warn('Shipped email error:', e);
      }

      return {
        consignment_id: consignment.consignment_id,
        tracking_code: trackingCode,
        status: consignment.status || 'in_review',
        order: updated,
        isSimulated: false
      };
    } else {
      throw new Error(data?.message || 'Steadfast failed to create consignment order');
    }
  } catch (error: any) {
    console.error('Steadfast Create Order Error:', error.message);
    throw new AppError(error.message || 'Failed to dispatch order to Steadfast Courier', 500);
  }
};

/**
 * Look up real-time delivery status for a tracking code
 */
export const getSteadfastTracking = async (trackingCode: string) => {
  if (!isSteadfastConfigured()) {
    return {
      status: 200,
      delivery_status: 'in_transit',
      tracking_code: trackingCode,
      updated_at: new Date().toISOString(),
      isSimulated: true
    };
  }

  const baseUrl = env.STEADFAST_BASE_URL || 'https://portal.packzy.com/api/v1';

  try {
    const res = await fetch(`${baseUrl}/status_by_trackingcode/${trackingCode}`, {
      headers: getSteadfastHeaders()
    });

    const data: any = await res.json();
    return data;
  } catch (error: any) {
    console.error('Steadfast Tracking Lookup Error:', error.message);
    return null;
  }
};

/**
 * Look up current Steadfast wallet & settlement balance
 */
export const getSteadfastBalance = async () => {
  if (!isSteadfastConfigured()) {
    return {
      status: 200,
      current_balance: 0,
      isSimulated: true
    };
  }

  const baseUrl = env.STEADFAST_BASE_URL || 'https://portal.packzy.com/api/v1';

  try {
    const res = await fetch(`${baseUrl}/get_balance`, {
      headers: getSteadfastHeaders()
    });

    const data: any = await res.json();
    return data;
  } catch (error: any) {
    console.error('Steadfast Balance Lookup Error:', error.message);
    return null;
  }
};

/**
 * Handle incoming Steadfast delivery webhooks or status changes
 */
export const handleSteadfastStatusUpdate = async (trackingCode: string, status: string) => {
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { trackingNumber: trackingCode },
        { orderNumber: trackingCode }
      ]
    },
    include: { payment: true }
  });

  if (!order) {
    console.warn(`[Steadfast Webhook] No order found matching ${trackingCode}`);
    return null;
  }

  const normalizedStatus = status.toLowerCase();
  let nextStatus = order.status;

  if (normalizedStatus === 'delivered' || normalizedStatus === 'partial_delivered') {
    nextStatus = 'DELIVERED';
    // Mark payment verified upon cash collection
    if (order.payment && order.payment.status !== 'VERIFIED') {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: { status: 'VERIFIED' }
      });
    }

    // Trigger delivery confirmation email
    try {
      if (order.email && order.email.includes('@') && !order.email.includes('@guest.murakkaz.com')) {
        sendOrderDeliveredEmail({
          orderNumber: order.orderNumber,
          fullName: order.fullName,
          email: order.email
        }).catch(err => console.warn('Delivered email failed:', err));
      }
    } catch (e) {
      console.warn('Delivered email error:', e);
    }
  } else if (normalizedStatus === 'cancelled' || normalizedStatus === 'returned') {
    nextStatus = 'CANCELLED';
  } else if (normalizedStatus === 'in_transit') {
    nextStatus = 'SHIPPED';
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: nextStatus }
  });

  console.log(`[Steadfast Webhook] Order #${order.orderNumber} status updated: ${order.status} -> ${nextStatus}`);
  return updated;
};
