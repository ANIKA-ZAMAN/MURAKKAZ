import { Router, Request, Response } from 'express';
import { recordPageview, recordEvent } from '../services/analytics.service';

const router = Router();

/**
 * Public high-speed non-blocking beacon ingestion for Pageviews
 */
router.post('/collect', async (req: Request, res: Response) => {
  try {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || req.ip;
    const userAgent = req.headers['user-agent'] || '';

    const payload = req.body || {};
    if (!payload.sessionId || !payload.path) {
      return res.status(400).json({ status: 'error', message: 'sessionId and path are required' });
    }

    const result = await recordPageview({
      ...payload,
      ip,
      userAgent
    }, req.headers);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Analytics collect error:', error);
    return res.status(200).json({ success: false });
  }
});

/**
 * Public event tracking for E-Commerce actions (Add to Bag, Checkout, Purchase)
 */
router.post('/event', async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    if (!payload.sessionId || !payload.eventName) {
      return res.status(400).json({ status: 'error', message: 'sessionId and eventName are required' });
    }

    const result = await recordEvent(payload);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Analytics event error:', error);
    return res.status(200).json({ success: false });
  }
});

export default router;
