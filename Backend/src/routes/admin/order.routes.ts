import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { OrderStatus } from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';

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
    const { status, trackingNumber } = req.body;
    
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber
      },
      include: {
        user: true,
        items: true,
        payment: true,
      }
    });
    
    res.json({ status: 'success', data: order });
  } catch (error) {
    next(error);
  }
});

export default router;
