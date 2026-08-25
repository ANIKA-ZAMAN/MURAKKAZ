import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById, cancelOrder } from '../controllers/order.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOrderSchema } from '../validators/order.validator';

const router = Router();

// Order creation supports both guest and authenticated users
router.post('/', optionalAuth, validate(createOrderSchema), createOrder);

// Authenticated user order actions
router.get('/', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/cancel', authenticate, cancelOrder);

export default router;
