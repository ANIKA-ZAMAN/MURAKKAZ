import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await prisma.event.create({
      data: req.body
    });
    res.status(201).json({ status: 'success', data: event });
  } catch (error) { next(error); }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const event = await prisma.event.update({
      where: { id },
      data: req.body
    });
    res.json({ status: 'success', data: event });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.event.delete({ where: { id } });
    res.json({ status: 'success', message: 'Event deleted' });
  } catch (error) { next(error); }
});

export default router;
