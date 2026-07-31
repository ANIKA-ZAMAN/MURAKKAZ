import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preference: true, addresses: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUserProfile = async (
  userId: string,
  data: { firstName?: string; lastName?: string; phone?: string; primaryLocation?: string }
) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  const { passwordHash, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const updateUserPhoto = async (userId: string, photoPath: string) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { photo: photoPath },
  });

  const { passwordHash, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const getUserPreferences = async (userId: string) => {
  let preferences = await prisma.userPreference.findUnique({
    where: { userId },
  });

  if (!preferences) {
    preferences = await prisma.userPreference.create({
      data: { userId },
    });
  }

  return preferences;
};

export const updateUserPreferences = async (
  userId: string,
  data: { darkMode?: boolean; ambientParticle?: boolean; soundEffects?: boolean; newsletter?: boolean; reminders?: boolean }
) => {
  const preferences = await prisma.userPreference.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });

  return preferences;
};

export const getUserAddresses = async (userId: string) => {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
};

export const createAddress = async (
  userId: string,
  data: {
    type?: 'SHIPPING' | 'BILLING';
    fullName: string;
    company?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    phone: string;
    isDefault?: boolean;
  }
) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, type: data.type || 'SHIPPING' },
      data: { isDefault: false },
    });
  }

  return await prisma.address.create({
    data: { ...data, userId },
  });
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  data: {
    type?: 'SHIPPING' | 'BILLING';
    fullName?: string;
    company?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phone?: string;
    isDefault?: boolean;
  }
) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new AppError('Address not found', 404);
  }

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, type: address.type },
      data: { isDefault: false },
    });
  }

  return await prisma.address.update({
    where: { id: addressId },
    data,
  });
};

export const deleteAddress = async (userId: string, addressId: string) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new AppError('Address not found', 404);
  }

  await prisma.address.delete({
    where: { id: addressId },
  });
};
