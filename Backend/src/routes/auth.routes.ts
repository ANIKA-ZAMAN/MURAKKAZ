import { Router } from 'express';
import { register, login, refresh, logout, changePassword, sendEmailOtp, verifyEmailOtp } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema } from '../validators/auth.validator';

const router = Router();

// Standard Password Login & Direct Register
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Email OTP Endpoints
router.post('/email-otp/send', sendEmailOtp);
router.post('/email-otp/verify', verifyEmailOtp);

// Session & Password Management
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.post('/logout', logout);
router.put('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
