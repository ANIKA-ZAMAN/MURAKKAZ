import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById, cancelOrder } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOrderSchema } from '../validators/order.validator';

const router = Router();
router.use(authenticate);

router.post('/', validate(createOrderSchema), createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;
