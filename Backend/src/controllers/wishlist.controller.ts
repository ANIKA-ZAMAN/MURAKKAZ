import { Request, Response, NextFunction } from 'express';
import * as wishlistService from '../services/wishlist.service';


export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await wishlistService.getWishlist(req.user!.id);
    res.json({ status: 'success', data: items });
  } catch (error) {
    next(error);
  }
}

export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await wishlistService.addToWishlist(req.user!.id, req.params.productId as string);
    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
}

export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await wishlistService.removeFromWishlist(req.user!.id, req.params.productId as string);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}
