import { Router, Request, Response } from 'express';
import prisma from '../config/database';

const router = Router();

// Courier Webhook endpoint (Steadfast / Pathao delivery updates)
router.post('/courier', async (req: Request, res: Response) => {
  try {
    const { tracking_code, invoice, status, delivery_status } = req.body;
    const effectiveStatus = (delivery_status || status || '').toLowerCase();
    const orderNumber = invoice;

    console.log(`[Courier Webhook] Received status '${effectiveStatus}' for invoice ${orderNumber} (tracking: ${tracking_code})`);

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          ...(orderNumber ? [{ orderNumber }] : []),
          ...(tracking_code ? [{ trackingNumber: tracking_code }] : [])
        ]
      },
      include: { payment: true }
    });

    if (!order) {
      return res.status(200).json({ status: 'ignored', message: 'Order not found' });
    }

    if (effectiveStatus === 'delivered') {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'DELIVERED' }
        });

        if (order.payment && order.payment.status === 'PENDING') {
          await tx.payment.update({
            where: { id: order.payment.id },
            data: { status: 'VERIFIED', verifiedAt: new Date() }
          });
        }
      });
    } else if (effectiveStatus === 'cancelled' || effectiveStatus === 'cancelled_by_customer') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' }
      });
    }

    res.status(200).json({ status: 'success', message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Courier webhook error:', error);
    res.status(200).json({ status: 'error', message: 'Webhook failed gracefully' });
  }
});

export default router;
