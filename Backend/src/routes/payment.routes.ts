import { Router } from 'express';
import { initiateBkash, bkashCallback, initiateSSLCommerz, sslcommerzSuccess, sslcommerzFail, sslcommerzCancel, verifyPayment } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.post('/bkash/create', authenticate, initiateBkash);
router.post('/bkash/callback', bkashCallback);
router.post('/sslcommerz/init', authenticate, initiateSSLCommerz);
router.post('/sslcommerz/success', sslcommerzSuccess);
router.post('/sslcommerz/fail', sslcommerzFail);
router.post('/sslcommerz/cancel', sslcommerzCancel);
router.post('/verify/:orderId', authenticate, requireAdmin, verifyPayment);

export default router;
