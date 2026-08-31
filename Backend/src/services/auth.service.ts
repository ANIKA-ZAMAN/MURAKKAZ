import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken, deleteRefreshToken, deleteAllRefreshTokens } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export const registerUser = async (data: any) => {
  const { firstName, lastName, email, phone, password } = data;
  
  const normalizedEmail = email ? email.toLowerCase().trim() : undefined;
  const normalizedPhone = phone ? phone.trim() : undefined;

  if (normalizedEmail) {
    const existingEmail = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingEmail) throw new AppError('An account with this email already exists', 409);
  }
  if (normalizedPhone) {
    const existingPhone = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
    if (existingPhone) throw new AppError('An account with this phone number already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash: hashedPassword,
      role: 'CUSTOMER',
      memberTier: 'Collector Circle',
      points: 100, // Welcome bonus points for luxury collectors
      isVerified: true,
      lastLoginAt: new Date(),
      preference: {
        create: {}
      }
    }
  });

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = await generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      memberTier: user.memberTier,
      points: user.points,
      photo: user.photo,
      primaryLocation: user.primaryLocation,
      createdAt: user.createdAt
    },
    accessToken,
    refreshToken
  };
};

export const loginUser = async (data: any) => {
  const { email, phone, password } = data;
  
  const normalizedEmail = email ? email.toLowerCase().trim() : undefined;
  const normalizedPhone = phone ? phone.trim() : undefined;

  let user;
  if (normalizedEmail) {
    user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  } else if (normalizedPhone) {
    user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  }

  if (!user || !user.passwordHash) {
    throw new AppError('Invalid email/phone or password', 401);
  }

  // Check account lockout status
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
    throw new AppError(`Account is temporarily locked due to repeated failed attempts. Please try again in ${minutesLeft} minute(s).`, 429);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
    let lockedUntil: Date | null = null;
    if (newFailedAttempts >= 5) {
      lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: newFailedAttempts,
        lockedUntil
      }
    });

    if (newFailedAttempts >= 5) {
      throw new AppError('Too many failed login attempts. Your account is locked for 15 minutes.', 429);
    }

    throw new AppError('Invalid email/phone or password', 401);
  }

  // Reset failed attempts on successful login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date()
    }
  });

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = await generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      memberTier: user.memberTier,
      points: user.points,
      photo: user.photo,
      primaryLocation: user.primaryLocation,
      createdAt: user.createdAt
    },
    accessToken,
    refreshToken
  };
};

export const sendPhoneOtp = async (phone: string) => {
  const normalizedPhone = phone.trim();
  
  // Generate secure 6-digit numeric OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  // Invalidate any existing active OTP for this phone
  await prisma.otpCode.deleteMany({
    where: { phone: normalizedPhone }
  });

  // Find existing user if any
  const existingUser = await prisma.user.findUnique({ where: { phone: normalizedPhone } });

  await prisma.otpCode.create({
    data: {
      phone: normalizedPhone,
      code,
      expiresAt,
      userId: existingUser?.id
    }
  });

  // In production SMS gateway integration (e.g. Greenweb, SSL Wireless, Twilio)
  console.log(`[SMS OTP Dispatched] Phone: ${normalizedPhone} | Code: ${code} (Expires in 5m)`);

  return {
    message: 'Verification code sent to your phone number',
    phone: normalizedPhone,
    expiresIn: 300
  };
};

export const verifyPhoneOtp = async (phone: string, code: string) => {
  const normalizedPhone = phone.trim();

  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      phone: normalizedPhone,
      code: code.trim(),
      verified: false,
      expiresAt: { gt: new Date() }
    }
  });

  if (!otpRecord) {
    throw new AppError('Invalid or expired verification code', 400);
  }

  // Mark OTP as verified
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { verified: true }
  });

  // Find or create customer
  let user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone: normalizedPhone,
        firstName: 'Valued',
        lastName: 'Collector',
        role: 'CUSTOMER',
        memberTier: 'Collector Circle',
        points: 100,
        isVerified: true,
        lastLoginAt: new Date(),
        preference: {
          create: {}
        }
      }
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, lastLoginAt: new Date() }
    });
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = await generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      memberTier: user.memberTier,
      points: user.points,
      photo: user.photo,
      primaryLocation: user.primaryLocation,
      createdAt: user.createdAt
    },
    accessToken,
    refreshToken
  };
};

export const refreshAccessToken = async (token: string) => {
  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!refreshTokenRecord || refreshTokenRecord.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Rotate refresh token
  await deleteRefreshToken(token);
  const newRefreshToken = await generateRefreshToken(refreshTokenRecord.userId);
  const newAccessToken = generateAccessToken(refreshTokenRecord.userId, refreshTokenRecord.user.role);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

export const logoutUser = async (refreshToken?: string, userId?: string) => {
  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }
  if (userId) {
    await deleteAllRefreshTokens(userId);
  }
  return { message: 'Logged out successfully' };
};

export const changePassword = async (userId: string, data: any) => {
  const { currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash) {
    throw new AppError('User not found or no password set', 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashedPassword }
  });

  // Revoke all other active refresh sessions on password change
  await deleteAllRefreshTokens(userId);

  return { message: 'Password updated successfully' };
};
