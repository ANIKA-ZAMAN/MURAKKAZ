import { Router } from 'express';
import { initiateBkash, executeBkash, bkashCallback, initiateSSLCommerz, sslcommerzSuccess, sslcommerzFail, sslcommerzCancel, verifyPayment } from '../controllers/payment.controller';
import { optionalAuth, authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.post('/bkash/create', optionalAuth, initiateBkash);
router.post('/bkash/execute', optionalAuth, executeBkash);
router.post('/bkash/callback', bkashCallback);
router.post('/sslcommerz/init', optionalAuth, initiateSSLCommerz);
router.post('/sslcommerz/success', sslcommerzSuccess);
router.post('/sslcommerz/fail', sslcommerzFail);
router.post('/sslcommerz/cancel', sslcommerzCancel);
router.post('/verify/:orderId', authenticate, requireAdmin, verifyPayment);

export default router;
