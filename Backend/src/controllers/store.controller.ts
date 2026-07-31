import { Request, Response, NextFunction } from 'express';
import * as storeService from '../services/store.service';

export const listStores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const zone = req.query.zone as string;
    const q = req.query.q as string;
    
    const stores = await storeService.getStoreLocations({ zone, q });
    res.json(stores);
  } catch (error) {
    next(error);
  }
};
