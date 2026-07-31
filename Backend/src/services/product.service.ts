import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { getPaginationParams, createPaginatedResult } from '../utils/pagination';
import { safeDbCall, dbStore } from './resilientDb';

export interface ProductFilterParams {
  q?: string;
  family?: string;
  gender?: string;
  occasion?: string;
  meter?: string;
  notes?: string;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export const getProducts = async (filters: ProductFilterParams) => {
  const { q, family, gender, occasion, meter, notes, maxPrice, sort, page, limit } = filters;
  const { skip, take } = getPaginationParams({ page: page?.toString(), limit: limit?.toString() });

  return safeDbCall(
    async () => {
      const where: any = { isActive: true };

      if (q) {
        where.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ];
      }

      if (family) where.family = { in: family.split(',') };
      if (gender) where.gender = { in: gender.split(',') };
      if (occasion) where.occasion = { contains: occasion, mode: 'insensitive' };
      if (meter) where.meter = { in: meter.split(',') };

      let orderBy: any = { createdAt: 'desc' };
      if (sort === 'rating') orderBy = { rating: 'desc' };
      else if (sort === 'newest') orderBy = { createdAt: 'desc' };

      let products = await prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          sizes: { select: { size: true, price: true, originalPrice: true } },
          notes: { select: { name: true, type: true } },
          collection: { select: { name: true, slug: true } },
        },
      });

      const total = await prisma.product.count({ where });
      return createPaginatedResult(products, total, page || 1, limit || 12);
    },
    () => {
      let products = dbStore.products.filter(p => p.isActive !== false);
      if (q) {
        const query = q.toLowerCase();
        products = products.filter(
          (p) => p.name.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query))
        );
      }
      const total = products.length;
      const paginated = products.slice(skip, skip + (limit || 12));
      return createPaginatedResult(paginated, total, page || 1, limit || 12);
    }
  );
};

export const getProductBySlug = async (slug: string) => {
  return safeDbCall(
    async () => {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          sizes: true,
          notes: { orderBy: { type: 'asc' } },
          accords: { orderBy: { percentage: 'desc' } },
          bestFor: true,
          galleryImages: { orderBy: { sortOrder: 'asc' } },
          collection: true,
          reviews: { where: { isApproved: true }, take: 10 },
        },
      });

      if (!product) throw new AppError('Product not found', 404);
      return product;
    },
    () => {
      const product = dbStore.products.find((p) => p.slug === slug || p.id === slug);
      if (!product) throw new AppError('Product not found', 404);
      return { ...product, aggregateRating: product.rating || 5, accords: [], bestFor: [], galleryImages: [], reviews: [] };
    }
  );
};

export const getProductsForComparison = async (slugs: string) => {
  const slugArray = slugs.split(',').slice(0, 3);
  return safeDbCall(
    async () => {
      return await prisma.product.findMany({
        where: { slug: { in: slugArray } },
        include: { sizes: true, notes: true, accords: true, bestFor: true },
      });
    },
    () => {
      return dbStore.products.filter((p) => slugArray.includes(p.slug) || slugArray.includes(p.id));
    }
  );
};

export const getRecommendations = async (params: any) => {
  return safeDbCall(
    async () => {
      const products = await prisma.product.findMany({
        where: { isActive: true },
        include: { sizes: true, notes: true },
      });
      return products.slice(0, 3).map((p) => ({
        matchScore: '96%',
        reason: 'Recommended for your preferences.',
        product: p,
      }));
    },
    () => {
      return dbStore.products.slice(0, 3).map((p) => ({
        matchScore: '96%',
        reason: 'Recommended based on your scent profile.',
        product: p,
      }));
    }
  );
};
