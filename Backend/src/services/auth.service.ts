import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, deleteRefreshToken, deleteAllRefreshTokens } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { sendOtpEmail } from './mail.service';

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
      points: 100, // Welcome bonus points
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
      lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
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

/**
 * EMAIL OTP SYSTEM
 */
export const sendEmailOtp = async (data: { email: string; type?: 'REGISTER' | 'LOGIN' | 'RESET'; firstName?: string; lastName?: string; password?: string; phone?: string }) => {
  const normalizedEmail = data.email.toLowerCase().trim();
  const type = data.type || 'REGISTER';

  if (type === 'REGISTER') {
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      throw new AppError('An account with this email already exists. Please sign in.', 409);
    }
  }

  // Generate secure 6-digit numeric OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  // Delete previous unverified OTPs for this email
  await prisma.otpCode.deleteMany({
    where: { email: normalizedEmail }
  });

  let hashedPassword = undefined;
  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 12);
  }

  const metadata = JSON.stringify({
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    passwordHash: hashedPassword
  });

  await prisma.otpCode.create({
    data: {
      email: normalizedEmail,
      code,
      type,
      metadata,
      expiresAt
    }
  });

  // Dispatch Email
  await sendOtpEmail(normalizedEmail, code, type);

  return {
    message: `Verification code sent to ${normalizedEmail}`,
    email: normalizedEmail,
    expiresIn: 300
  };
};

export const verifyEmailOtpAndRegister = async (data: { email: string; otp: string; firstName?: string; lastName?: string; password?: string; phone?: string }) => {
  const normalizedEmail = data.email.toLowerCase().trim();
  const code = data.otp.trim();

  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      email: normalizedEmail,
      code,
      verified: false,
      expiresAt: { gt: new Date() }
    }
  });

  if (!otpRecord) {
    throw new AppError('Invalid or expired verification code. Please request a new one.', 400);
  }

  // Mark OTP as verified
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { verified: true }
  });

  let parsedMeta: any = {};
  if (otpRecord.metadata) {
    try {
      parsedMeta = JSON.parse(otpRecord.metadata);
    } catch {}
  }

  const finalFirstName = data.firstName || parsedMeta.firstName || 'Valued';
  const finalLastName = data.lastName || parsedMeta.lastName || 'Collector';
  const finalPhone = data.phone || parsedMeta.phone || null;
  const finalPasswordHash = parsedMeta.passwordHash || (data.password ? await bcrypt.hash(data.password, 12) : null);

  // Check if user already exists
  let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        firstName: finalFirstName.trim(),
        lastName: finalLastName.trim(),
        phone: finalPhone,
        passwordHash: finalPasswordHash,
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
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        lastLoginAt: new Date(),
        firstName: finalFirstName || user.firstName,
        lastName: finalLastName || user.lastName
      }
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

  await deleteAllRefreshTokens(userId);

  return { message: 'Password updated successfully' };
};
