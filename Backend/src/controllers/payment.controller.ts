import { Request, Response, NextFunction } from 'express';
import * as paymentService from '../services/payment.service';

export const initiateBkash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, amount } = req.body;
    const result = await paymentService.initiateBkashPayment(orderId, amount);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const bkashCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentID, status } = req.body;
    const result = await paymentService.handleBkashCallback(paymentID, status);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const initiateSSLCommerz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, amount, customerInfo } = req.body;
    const result = await paymentService.initiateSSLCommerzPayment(orderId, amount, customerInfo);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const sslcommerzSuccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await paymentService.handleSSLCommerzCallback({ ...req.body, status: 'SUCCESS' });
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const sslcommerzFail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await paymentService.handleSSLCommerzCallback({ ...req.body, status: 'FAILED' });
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const sslcommerzCancel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await paymentService.handleSSLCommerzCallback({ ...req.body, status: 'CANCELLED' });
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.orderId as string;
    const result = await paymentService.verifyPayment(orderId);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};
