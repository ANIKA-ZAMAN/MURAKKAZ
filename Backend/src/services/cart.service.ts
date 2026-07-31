import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getCart = async (userId: string) => {
  const items = await prisma.cartItem.findMany({
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
          sizes: true
        }
      }
    }
  });

  return items;
};

export const addCartItem = async (userId: string, data: { productId: string; selectedSize: string; quantity: number }) => {
  const product = await prisma.product.findUnique({
    where: { id: data.productId, isActive: true },
    include: { sizes: true }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const sizeExists = product.sizes.some(s => s.size === data.selectedSize);
  if (!sizeExists) {
    throw new AppError('Invalid size', 400);
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId_selectedSize: {
        userId,
        productId: data.productId,
        selectedSize: data.selectedSize
      }
    }
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + data.quantity },
      include: { product: true }
    });
  }

  return prisma.cartItem.create({
    data: {
      userId,
      productId: data.productId,
      selectedSize: data.selectedSize,
      quantity: data.quantity
    },
    include: { product: true }
  });
};

export const updateCartItem = async (userId: string, itemId: string, data: { selectedSize?: string; quantity?: number }) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId }
  });

  if (!item || item.userId !== userId) {
    throw new AppError('Cart item not found', 404);
  }

  if (data.selectedSize && data.selectedSize !== item.selectedSize) {
    const existingWithNewSize = await prisma.cartItem.findUnique({
      where: {
        userId_productId_selectedSize: {
          userId,
          productId: item.productId,
          selectedSize: data.selectedSize
        }
      }
    });

    if (existingWithNewSize) {
      const newQuantity = (data.quantity ?? item.quantity) + existingWithNewSize.quantity;
      await prisma.cartItem.delete({ where: { id: itemId } });
      return prisma.cartItem.update({
        where: { id: existingWithNewSize.id },
        data: { quantity: newQuantity },
        include: { product: true }
      });
    }
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data,
    include: { product: true }
  });
};

export const removeCartItem = async (userId: string, itemId: string) => {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  
  if (!item || item.userId !== userId) {
    throw new AppError('Cart item not found', 404);
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return { message: 'Item removed' };
};

export const clearCart = async (userId: string) => {
  await prisma.cartItem.deleteMany({ where: { userId } });
  return { message: 'Cart cleared' };
};

export const mergeGuestCart = async (userId: string, items: Array<{ productId: string; selectedSize: string; quantity: number }>) => {
  for (const item of items) {
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId_selectedSize: {
          userId,
          productId: item.productId,
          selectedSize: item.selectedSize
        }
      }
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId: item.productId,
          selectedSize: item.selectedSize,
          quantity: item.quantity
        }
      });
    }
  }

  return getCart(userId);
};
