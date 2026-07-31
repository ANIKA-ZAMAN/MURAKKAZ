import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getWishlist = async (userId: string) => {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          brand: true,
          inspiredBy: true,
          image: true,
          rating: true,
          reviewCount: true,
          sizes: true
        }
      }
    }
  });
};

export const addToWishlist = async (userId: string, productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return prisma.wishlistItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId
      }
    },
    update: {},
    create: {
      userId,
      productId
    },
    include: { product: true }
  });
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  const item = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  if (!item) {
    throw new AppError('Item not found in wishlist', 404);
  }

  await prisma.wishlistItem.delete({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  return { message: 'Removed from wishlist' };
};
