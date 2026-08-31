import { Router } from 'express';
import { register, login, refresh, logout, changePassword, sendOtp, verifyOtp } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema, sendOtpSchema, verifyOtpSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/otp/send', validate(sendOtpSchema), sendOtp);
router.post('/otp/verify', validate(verifyOtpSchema), verifyOtp);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.post('/logout', logout);
router.put('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
