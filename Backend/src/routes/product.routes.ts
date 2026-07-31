import { Router } from 'express';
import { listProducts, getProduct, compareProducts, getRecommendations } from '../controllers/product.controller';
import { validate } from '../middleware/validate';
import { productQuerySchema, compareQuerySchema, recommendationQuerySchema } from '../validators/product.validator';

const router = Router();

router.get('/', validate(productQuerySchema), listProducts);
router.get('/compare', validate(compareQuerySchema), compareProducts);
router.get('/recommendations', validate(recommendationQuerySchema), getRecommendations);
router.get('/:slug', getProduct);

export default router;
