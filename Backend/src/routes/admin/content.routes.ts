import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

const router = Router();

router.put('/:key', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.params.key as string;
    const { value } = req.body;
    
    const content = await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    
    res.json({ status: 'success', data: content });
  } catch (error) { next(error); }
});

export default router;
