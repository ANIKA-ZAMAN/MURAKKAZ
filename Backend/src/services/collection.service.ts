import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getCollections = async () => {
  return prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
};

export const getCollectionBySlug = async (slug: string) => {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          sizes: true,
          notes: true
        }
      }
    }
  });

  if (!collection) {
    throw new AppError('Collection not found', 404);
  }

  return collection;
};
