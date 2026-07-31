import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z.string().email('Invalid email').optional(),
    phone: z.string().min(10).max(15).optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  }).refine(data => data.email || data.phone, {
    message: 'Either email or phone is required',
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email').optional(),
    phone: z.string().optional(),
    password: z.string().min(1, 'Password is required'),
  }).refine(data => data.email || data.phone, {
    message: 'Either email or phone is required',
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

export const sendOtpSchema = z.object({
  body: z.object({
    phone: z.string().min(10, 'Valid phone number is required').max(15),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    phone: z.string().min(10).max(15),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});
