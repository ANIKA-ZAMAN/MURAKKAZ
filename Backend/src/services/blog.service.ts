import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { safeDbCall, dbStore } from './resilientDb';

export const getBlogPosts = async (params: { q?: string; page?: number; limit?: number }) => {
  const page = params.page || 1;
  const limit = params.limit || 6;
  const skip = (page - 1) * limit;

  return safeDbCall(
    async () => {
      const where: any = { isPublished: true };
      if (params.q) {
        where.OR = [
          { title: { contains: params.q, mode: 'insensitive' } },
          { description: { contains: params.q, mode: 'insensitive' } },
        ];
      }

      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          orderBy: { publishedAt: 'desc' },
          skip,
          take: limit,
          include: {
            author: {
              select: { firstName: true, lastName: true },
            },
          },
        }),
        prisma.blogPost.count({ where }),
      ]);

      return {
        data: posts,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    },
    () => {
      let posts = dbStore.blogPosts.filter((p) => p.isPublished);
      if (params.q) {
        const query = params.q.toLowerCase();
        posts = posts.filter(
          (p) => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
        );
      }
      const total = posts.length;
      const paginated = posts.slice(skip, skip + limit);
      return {
        data: paginated,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    }
  );
};

export const getBlogPostBySlug = async (slug: string) => {
  return safeDbCall(
    async () => {
      const post = await prisma.blogPost.findFirst({
        where: { slug, isPublished: true },
        include: {
          author: { select: { firstName: true, lastName: true } },
        },
      });

      if (!post) throw new AppError('Blog post not found', 404);
      return post;
    },
    () => {
      const post = dbStore.blogPosts.find((p) => (p.slug === slug || p.id === slug) && p.isPublished);
      if (!post) throw new AppError('Blog post not found', 404);
      return post;
    }
  );
};
