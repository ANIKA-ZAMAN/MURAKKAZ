import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cart.service';


export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await cartService.getCart(req.user!.id);
    res.json({ status: 'success', data: items });
  } catch (error) {
    next(error);
  }
}

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await cartService.addCartItem(req.user!.id, req.body);
    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
}

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await cartService.updateCartItem(req.user!.id, req.params.id as string, req.body);
    res.json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
}

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cartService.removeCartItem(req.user!.id, req.params.id as string);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cartService.clearCart(req.user!.id);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export const mergeCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.mergeGuestCart(req.user!.id, req.body.items);
    res.json({ status: 'success', data: cart });
  } catch (error) {
    next(error);
  }
}
