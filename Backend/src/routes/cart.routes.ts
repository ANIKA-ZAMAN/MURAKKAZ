import { Router } from 'express';
import { getCart, addItem, updateItem, removeItem, clearCart, mergeCart } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { addCartItemSchema, updateCartItemSchema, mergeCartSchema } from '../validators/cart.validator';

const router = Router();
router.use(authenticate);

router.get('/', getCart);
router.post('/items', validate(addCartItemSchema), addItem);
router.put('/items/:id', validate(updateCartItemSchema), updateItem);
router.delete('/items/:id', removeItem);
router.delete('/', clearCart);
router.post('/merge', validate(mergeCartSchema), mergeCart);

export default router;
