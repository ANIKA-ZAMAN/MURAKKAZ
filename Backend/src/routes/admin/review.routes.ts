import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isApproved, page = '1', limit = '10' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (isApproved !== undefined) {
      where.isApproved = isApproved === 'true';
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          product: { select: { name: true, slug: true } },
          user: { select: { firstName: true, lastName: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.count({ where })
    ]);

    res.json({
      status: 'success',
      data: reviews,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) { next(error); }
});

router.put('/:id/approve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const review = await prisma.review.update({
      where: { id },
      data: { isApproved: true }
    });
    
    // Recalculate product rating
    const allApproved = await prisma.review.findMany({
      where: { productId: review.productId, isApproved: true }
    });
    
    const reviewCount = allApproved.length;
    const averageRating = reviewCount > 0 
      ? allApproved.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount 
      : 0;
      
    await prisma.product.update({
      where: { id: review.productId },
      data: { reviewCount, rating: averageRating }
    });
    
    res.json({ status: 'success', data: review });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) throw new AppError('Review not found', 404);
    
    await prisma.review.delete({ where: { id } });
    
    // Recalculate product rating
    const allApproved = await prisma.review.findMany({
      where: { productId: review.productId, isApproved: true }
    });
    
    const reviewCount = allApproved.length;
    const averageRating = reviewCount > 0 
      ? allApproved.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount 
      : 0;
      
    await prisma.product.update({
      where: { id: review.productId },
      data: { reviewCount, rating: averageRating }
    });
    
    res.json({ status: 'success', message: 'Review deleted' });
  } catch (error) { next(error); }
});

export default router;
