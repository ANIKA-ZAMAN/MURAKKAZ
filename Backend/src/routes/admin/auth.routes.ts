import { Router, Request, Response, NextFunction } from 'express';
import { loginAdmin, getAdminProfile, createStaffAdmin } from '../../services/admin.auth.service';
import { authenticate } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/admin';
import { validate } from '../../middleware/validate';
import { loginSchema } from '../../validators/auth.validator';

const router = Router();

// Public Admin Login (Checks for role: ADMIN or SUPER_ADMIN)
router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const result = await loginAdmin(req.body, ipAddress);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
});

// Get Current Admin Profile
router.get('/me', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await getAdminProfile(req.user!.id);
    res.status(200).json({ status: 'success', data: admin });
  } catch (error) {
    next(error);
  }
});

// Invite/Provision new staff admin (Admin only)
router.post('/invite', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newAdmin = await createStaffAdmin(req.user!.id, req.body);
    res.status(201).json({ status: 'success', data: newAdmin });
  } catch (error) {
    next(error);
  }
});

export default router;
