import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, deleteRefreshToken, deleteAllRefreshTokens } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export const registerUser = async (data: any) => {
  const { firstName, lastName, email, phone, password } = data;
  
  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) throw new AppError('User with this email already exists', 409);
  }
  if (phone) {
    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) throw new AppError('User with this phone already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      passwordHash: hashedPassword,
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
      createdAt: user.createdAt
    },
    accessToken,
    refreshToken
  };
};

export const loginUser = async (data: any) => {
  const { email, phone, password } = data;
  
  let user;
  if (email) {
    user = await prisma.user.findUnique({ where: { email } });
  } else if (phone) {
    user = await prisma.user.findUnique({ where: { phone } });
  }

  if (!user || !user.passwordHash) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
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
      createdAt: user.createdAt
    },
    accessToken,
    refreshToken
  };
};

export const refreshAccessToken = async (token: string) => {
  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: { token }
  });

  if (!refreshTokenRecord || refreshTokenRecord.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  await deleteRefreshToken(token);

  const user = await prisma.user.findUnique({ where: { id: refreshTokenRecord.userId } });
  if (!user) {
    throw new AppError('User not found', 401);
  }
  const accessToken = generateAccessToken(refreshTokenRecord.userId, user.role);
  const newRefreshToken = await generateRefreshToken(refreshTokenRecord.userId);

  return {
    accessToken,
    refreshToken: newRefreshToken
  };
};

export const logoutUser = async (token: string) => {
  if (token) {
    try {
      await deleteRefreshToken(token);
    } catch (error) {
      // ignore if not found
    }
  }
};

export const changePassword = async (userId: string, data: any) => {
  const { currentPassword, newPassword } = data;
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash!);
  if (!isMatch) {
    throw new AppError('Invalid current password', 401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashedPassword }
  });

  await deleteAllRefreshTokens(userId);
};
