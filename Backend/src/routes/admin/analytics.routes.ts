import { Router, Request, Response, NextFunction } from 'express';
import {
  parseDateRange,
  getAnalyticsOverview,
  getTrafficAnalytics,
  getPageAnalytics,
  getOrderAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
  getRealtimePulse
} from '../../services/analytics.service';

const router = Router();

// Helper to extract date range from query
function getRangeFromQuery(req: Request) {
  const { period, from, to } = req.query as { period?: string; from?: string; to?: string };
  return parseDateRange(period, from, to);
}

/**
 * 1. Executive Summary & Core KPIs
 */
router.get('/overview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = getRangeFromQuery(req);
    const data = await getAnalyticsOverview(startDate, endDate);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
});

/**
 * 2. Traffic Acquisition & Demographics
 */
router.get('/traffic', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = getRangeFromQuery(req);
    const data = await getTrafficAnalytics(startDate, endDate);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
});

/**
 * 3. Page-by-Page Browsing Analytics
 */
router.get('/pages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = getRangeFromQuery(req);
    const limit = req.query.limit ? Number(req.query.limit) : 25;
    const data = await getPageAnalytics(startDate, endDate, limit);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
});

/**
 * 4. Orders, Revenue & Sales Insights
 */
router.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = getRangeFromQuery(req);
    const data = await getOrderAnalytics(startDate, endDate);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
});

/**
 * 5. Customer Intelligence, Retention & VIP Leaderboard
 */
router.get('/customers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = getRangeFromQuery(req);
    const data = await getCustomerAnalytics(startDate, endDate);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
});

/**
 * 6. Product Performance & Bottle Size Distribution
 */
router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = getRangeFromQuery(req);
    const data = await getProductAnalytics(startDate, endDate);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
});

/**
 * 7. Real-Time Live Pulse (Active Visitors within 5 min)
 */
router.get('/realtime', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getRealtimePulse();
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
});

export default router;
