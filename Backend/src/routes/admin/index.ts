import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/admin';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import blogRoutes from './blog.routes';
import eventRoutes from './event.routes';
import reviewRoutes from './review.routes';
import contentRoutes from './content.routes';
import storeRoutes from './store.routes';
import userRoutes from './user.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(requireAdmin);

router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/blog', blogRoutes);
router.use('/events', eventRoutes);
router.use('/reviews', reviewRoutes);
router.use('/content', contentRoutes);
router.use('/stores', storeRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
