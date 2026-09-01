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

const EXCLUSIVE_SLUGS = new Set([
  'irish-leather', 'baccarat-rouge-540', 'tobacco-vanille', 'by-the-fireplace',
  'resala', 'sultani', 'guidance', 'rosewood', 'sakura-dior', 'imagination',
  'prod-irish-leather-01', 'prod-baccarat-rouge-540-02', 'prod-tobacco-vanille-03',
  'prod-by-the-fireplace-04', 'prod-resala-05', 'prod-sultani-06', 'prod-guidance-07',
  'prod-rosewood-08', 'prod-sakura-dior-09', 'prod-imagination-10'
]);

function attachCategory(p: any) {
  if (!p) return p;
  const isExclusive = (p.sizes && Array.isArray(p.sizes) && p.sizes.some((s: any) => Number(s.price) >= 2500)) ||
    EXCLUSIVE_SLUGS.has(p.slug) ||
    EXCLUSIVE_SLUGS.has(p.id) ||
    p.category?.toLowerCase() === 'exclusive';
  return {
    ...p,
    category: isExclusive ? 'Exclusive' : 'Regular'
  };
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

      if (maxPrice) {
        where.sizes = {
          some: {
            price: { lte: Number(maxPrice) }
          }
        };
      }

      if (notes) {
        const noteList = notes.split(',').map(n => n.trim());
        where.notes = {
          some: {
            name: { in: noteList }
          }
        };
      }

      let orderBy: any = { createdAt: 'desc' };
      if (sort === 'rating') orderBy = { rating: 'desc' };
      else if (sort === 'newest') orderBy = { createdAt: 'desc' };

      let products = await prisma.product.findMany({
        where,
        skip: sort === 'price_asc' || sort === 'price_desc' ? undefined : skip,
        take: sort === 'price_asc' || sort === 'price_desc' ? undefined : take,
        orderBy,
        include: {
          sizes: { select: { size: true, price: true, originalPrice: true } },
          notes: { select: { name: true, type: true } },
          collection: { select: { name: true, slug: true } },
        },
      });

      const total = await prisma.product.count({ where });

      // Handle price sorting in memory since sizes are in a related table
      if (sort === 'price_asc' || sort === 'price_desc') {
        products.sort((a, b) => {
          const minA = a.sizes.length > 0 ? Math.min(...a.sizes.map(s => s.price)) : 0;
          const minB = b.sizes.length > 0 ? Math.min(...b.sizes.map(s => s.price)) : 0;
          return sort === 'price_asc' ? minA - minB : minB - minA;
        });
        products = products.slice(skip, skip + take);
      }

      return createPaginatedResult(products.map(attachCategory), total, page || 1, limit || 12);
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
      return createPaginatedResult(paginated.map(attachCategory), total, page || 1, limit || 12);
    }
  );
};

export const getProductBySlug = async (slug: string) => {
  return safeDbCall(
    async () => {
      let product = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: slug },
            { id: slug }
          ]
        },
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
      return attachCategory(product);
    },
    () => {
      const product = dbStore.products.find((p) => p.slug === slug || p.id === slug);
      if (!product) throw new AppError('Product not found', 404);
      return attachCategory({ ...product, aggregateRating: product.rating || 5, accords: [], bestFor: [], galleryImages: [], reviews: [] });
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

      if (products.length === 0) return [];

      const targetGender = params.gender?.toUpperCase();
      const targetFamily = params.family?.toUpperCase();
      const targetOccasion = params.occasion?.toLowerCase();
      const targetIntensity = params.intensity?.toUpperCase();
      const targetNotes = params.notes ? params.notes.toLowerCase().split(',').map((n: string) => n.trim()) : [];

      const scored = products.map((p) => {
        let score = 0;
        const reasons: string[] = [];

        if (targetGender && (p.gender === targetGender || p.gender === 'UNISEX')) {
          score += 4;
          reasons.push(`matches your preferred profile (${p.gender})`);
        }
        if (targetFamily && p.family === targetFamily) {
          score += 3;
          reasons.push(`${p.family.toLowerCase()} olfactive family`);
        }
        if (targetOccasion && p.occasion?.toLowerCase().includes(targetOccasion)) {
          score += 3;
          reasons.push(`ideal for ${targetOccasion}`);
        }
        if (targetIntensity && p.meter === targetIntensity) {
          score += 2;
          reasons.push(`${p.meter.toLowerCase()} projection`);
        }
        if (targetNotes.length > 0) {
          const matchingNotes = p.notes.filter(n => targetNotes.some((tn: string) => n.name.toLowerCase().includes(tn)));
          if (matchingNotes.length > 0) {
            score += matchingNotes.length * 2;
            reasons.push(`features ${matchingNotes.map(n => n.name).join(', ')}`);
          }
        }

        const matchPct = Math.min(99, Math.max(82, 85 + score * 2));
        const reasonText = reasons.length > 0 
          ? `Curated because it ${reasons.join(', and ')}.`
          : 'Refined choice matching your aesthetic preferences.';

        return {
          score,
          matchScore: `${matchPct}%`,
          reason: reasonText,
          product: p,
        };
      });

      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, 3);
    },
    () => {
      return dbStore.products.slice(0, 3).map((p, idx) => ({
        matchScore: `${96 - idx * 3}%`,
        reason: 'Recommended based on your scent consultation profile.',
        product: p,
      }));
    }
  );
};
