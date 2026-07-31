import { Request, Response, NextFunction } from 'express';
import * as blogService from '../services/blog.service';

export const listPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const result = await blogService.getBlogPosts({ q, page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await blogService.getBlogPostBySlug(req.params.slug as string);
    res.json({ status: 'success', data: post });
  } catch (error) {
    next(error);
  }
};
