import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
    return next(new AppError('Forbidden: Administrative access required', 403));
  }
  next();
};

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'SUPER_ADMIN') {
    return next(new AppError('Forbidden: Super Admin access required', 403));
  }
  next();
};
