import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';

// Assume req.user is populated by authentication middleware

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const order = await orderService.createOrder(userId, req.body);
    res.status(201).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    next(error);
  }
}

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const orders = await orderService.getUserOrders(userId, page, limit);
    res.status(200).json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    next(error);
  }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orderId = req.params.id as string;
    const order = await orderService.getOrderById(userId, orderId);
    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    next(error);
  }
}

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orderId = req.params.id as string;
    const order = await orderService.cancelOrder(userId, orderId);
    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    next(error);
  }
}
