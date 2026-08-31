import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, deleteAllRefreshTokens } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export const loginAdmin = async (data: any, ipAddress?: string) => {
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
    throw new AppError('Invalid administrative credentials', 401);
  }

  // Strict RBAC Separation: Verify Administrative Role
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    throw new AppError('Access Denied: You do not have administrative privileges to access this portal.', 403);
  }

  // Lockout check
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
    throw new AppError(`Admin account temporarily locked. Try again in ${minutesLeft} minute(s).`, 429);
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
      data: { failedLoginAttempts: newFailedAttempts, lockedUntil }
    });

    throw new AppError('Invalid administrative credentials', 401);
  }

  // Reset failed attempts & record login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date()
    }
  });

  // Create audit log for security tracking
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'ADMIN_LOGIN_SUCCESS',
      ipAddress: ipAddress || null,
      details: JSON.stringify({ email: user.email, timestamp: new Date().toISOString() })
    }
  }).catch(() => null);

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
      photo: user.photo,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt
    },
    accessToken,
    refreshToken
  };
};

export const getAdminProfile = async (adminId: string) => {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      photo: true,
      lastLoginAt: true,
      createdAt: true
    }
  });

  if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
    throw new AppError('Administrative account not found', 404);
  }

  return admin;
};

export const createStaffAdmin = async (creatorId: string, data: any) => {
  const { firstName, lastName, email, phone, password, role = 'ADMIN' } = data;

  const creator = await prisma.user.findUnique({ where: { id: creatorId } });
  if (!creator || (creator.role !== 'SUPER_ADMIN' && creator.role !== 'ADMIN')) {
    throw new AppError('Unauthorized: Only administrators can provision staff accounts', 403);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newAdmin = await prisma.user.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : null,
      passwordHash: hashedPassword,
      role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN',
      isVerified: true,
      preference: {
        create: {}
      }
    }
  });

  // Log admin creation in AuditLog
  await prisma.auditLog.create({
    data: {
      userId: creatorId,
      action: 'CREATE_STAFF_ADMIN',
      targetId: newAdmin.id,
      details: JSON.stringify({ createdEmail: newAdmin.email, role: newAdmin.role })
    }
  }).catch(() => null);

  return {
    id: newAdmin.id,
    firstName: newAdmin.firstName,
    lastName: newAdmin.lastName,
    email: newAdmin.email,
    role: newAdmin.role,
    createdAt: newAdmin.createdAt
  };
};
