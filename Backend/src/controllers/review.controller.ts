import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service';

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    
    const result = await reviewService.getProductReviews(req.params.slug as string, { page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || (req as any).user?.id || (req as any).user?.userId;
    const review = await reviewService.createReview(req.params.slug as string, userId, req.body);
    res.status(201).json({ status: 'success', data: review });
  } catch (error) {
    next(error);
  }
};

export const getHomepageReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.getHomepageReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
