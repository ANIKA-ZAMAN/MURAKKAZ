import { Request, Response, NextFunction } from 'express';
import * as collectionService from '../services/collection.service';

export const listCollections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collections = await collectionService.getCollections();
    res.json({ status: 'success', data: collections });
  } catch (error) {
    next(error);
  }
};

export const getCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collection = await collectionService.getCollectionBySlug(req.params.slug as string);
    res.json({ status: 'success', data: collection });
  } catch (error) {
    next(error);
  }
};
