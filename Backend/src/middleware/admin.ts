import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new AppError('Forbidden: Admin access required', 403));
  }
  next();
};
