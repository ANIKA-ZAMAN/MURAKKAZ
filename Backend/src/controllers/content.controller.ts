import { Request, Response, NextFunction } from 'express';
import * as contentService from '../services/content.service';

export const getContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const content = await contentService.getContentByKey(req.params.key as string);
    res.json(content);
  } catch (error) {
    next(error);
  }
};
