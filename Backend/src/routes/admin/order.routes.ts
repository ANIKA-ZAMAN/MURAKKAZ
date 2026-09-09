import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { OrderStatus } from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';
import { sendOrderCancelledEmail } from '../../services/mail.service';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = '1', limit = '10' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where = status ? { status: status as OrderStatus } : {};
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          user: true,
          items: true,
          payment: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      status: 'success',
      data: orders,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status, trackingNumber, notes } = req.body;

    const previousOrder = await prisma.order.findUnique({
      where: { id },
      include: { user: true, items: true, payment: true }
    });

    if (!previousOrder) throw new AppError('Order not found', 404);

    // If moving to CANCELLED, restore product stock
    if (status === 'CANCELLED' && previousOrder.status !== 'CANCELLED') {
      for (const item of previousOrder.items) {
        if (item.productId && item.selectedSize) {
          await prisma.productSize.updateMany({
            where: { productId: item.productId, size: item.selectedSize },
            data: { stock: { increment: item.quantity } }
          }).catch(err => console.warn('Stock restore note:', err));
        }
      }
    }
    
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(trackingNumber && { trackingNumber }),
        ...(notes && { notes })
      },
      include: {
        user: true,
        items: true,
        payment: true,
      }
    });

    // Send default luxury cancellation email to customer
    if (status === 'CANCELLED' && previousOrder.status !== 'CANCELLED') {
      const recipientEmail = order.email || order.user?.email;
      if (recipientEmail) {
        sendOrderCancelledEmail({
          orderNumber: order.orderNumber,
          fullName: order.fullName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'Valued Customer',
          email: recipientEmail,
          phone: order.phone || order.user?.phone || undefined,
          address: order.address,
          location: order.location,
          subtotal: order.subtotal,
          deliveryCharge: order.deliveryCharge,
          grandTotal: order.grandTotal,
          paymentMethod: order.payment?.method || 'COD',
          notes: notes || order.notes || undefined,
          items: order.items.map(i => ({
            productName: i.productName,
            selectedSize: i.selectedSize,
            quantity: i.quantity,
            totalPrice: i.totalPrice,
          })),
        }).catch(err => console.error('Failed to send order cancellation email:', err));
      }
    }
    
    res.json({ status: 'success', data: order });
  } catch (error) {
    next(error);
  }
});

// Get single order for admin
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: true,
        payment: true,
      }
    });

    if (!order) throw new AppError('Order not found', 404);
    res.json({ status: 'success', data: order });
  } catch (error) {
    next(error);
  }
});

// 1-Click Courier Dispatch to Steadfast
router.post('/:id/dispatch-courier', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { createSteadfastConsignment } = await import('../../services/courier.service');
    const result = await createSteadfastConsignment(id);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
});

// Get Steadfast Courier Balance & Settlement Info
router.get('/courier/balance', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { getSteadfastBalance } = await import('../../services/courier.service');
    const balance = await getSteadfastBalance();
    res.json({ status: 'success', data: balance });
  } catch (error) {
    next(error);
  }
});

export default router;
