import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getProductReviews = async (productSlug: string, params: { page?: number; limit?: number }) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const where = {
    productId: product.id,
    isApproved: true,
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: {
          select: { firstName: true, lastName: true, photo: true },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    data: reviews,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createReview = async (
  productSlug: string,
  userId: string,
  data: { stars: number; quote: string; longevity?: string; projection?: string; compliments?: string }
) => {
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const name = user ? `${user.firstName} ${user.lastName}` : 'Anonymous';

  const review = await prisma.review.create({
    data: {
      name,
      ...data,
      isApproved: false,
      productId: product.id,
      userId,
    },
  });

  return review;
};

export const getHomepageReviews = async () => {
  const reviews = await prisma.review.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: 'desc' },
    take: 16,
    include: {
      product: {
        select: { name: true, slug: true, inspiredBy: true },
      },
      user: {
        select: { firstName: true, lastName: true, photo: true },
      }
    },
  });

  return reviews;
};
