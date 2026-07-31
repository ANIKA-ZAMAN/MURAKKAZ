import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../config/database';
import crypto from 'crypto';

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY as string,
  } as jwt.SignOptions);
};

export const generateRefreshToken = async (userId: string) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  
  const expiryDays = parseInt(env.JWT_REFRESH_EXPIRY) || 7;
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
};

export const deleteRefreshToken = async (token: string) => {
  return prisma.refreshToken.deleteMany({
    where: { token },
  });
};

export const deleteAllRefreshTokens = async (userId: string) => {
  return prisma.refreshToken.deleteMany({
    where: { userId },
  });
};
