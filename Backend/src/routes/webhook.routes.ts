import { Router, Request, Response, NextFunction } from 'express';
import { handleSteadfastStatusUpdate } from '../services/courier.service';

const router = Router();

/**
 * Health check / Verification route for browser visits & webhook URL validators
 */
router.get('/steadfast', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'active',
    service: 'Murakkaz Steadfast Webhook Listener',
    message: 'Endpoint is live and ready to receive POST delivery status callbacks from Steadfast',
    timestamp: new Date().toISOString()
  });
});

/**
 * Steadfast Courier Status Webhook (POST)
 * Accepts webhook payload from Steadfast when rider changes delivery status
 */
router.post('/steadfast', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tracking_code, status, consignment_id, invoice } = req.body;
    const identifier = tracking_code || invoice || consignment_id;

    console.log('[Webhook Received from Steadfast]:', req.body);

    if (identifier && status) {
      await handleSteadfastStatusUpdate(identifier, status);
    }

    res.status(200).json({ status: 'success', message: 'Webhook processed' });
  } catch (error) {
    console.error('Steadfast Webhook Error:', error);
    res.status(200).json({ status: 'ignored', error: 'Processing error handled' });
  }
});

export default router;
