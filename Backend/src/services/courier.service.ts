import { env } from '../config/env';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

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

export const createSteadfastConsignment = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payment: true }
  });

  if (!order) throw new AppError('Order not found', 404);

  // If already dispatched, return existing tracking info
  if (order.trackingNumber && order.trackingNumber.startsWith('STDF-')) {
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

    return {
      consignment_id: 'SIM-' + Date.now(),
      tracking_code: mockTrackingCode,
      status: 'in_review',
      order: updated,
      isSimulated: true
    };
  }

  const baseUrl = env.STEADFAST_BASE_URL || 'https://portal.steadfast.com.bd/api/v1';

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

  const baseUrl = env.STEADFAST_BASE_URL || 'https://portal.steadfast.com.bd/api/v1';

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
