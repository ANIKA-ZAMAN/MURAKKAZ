import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { safeDbCall, dbStore, saveBlogsToDisk } from '../../services/resilientDb';

const router = Router();

// Create blog post
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug, title, description, content, image, category, readTime, isPublished, publishedAt } = req.body;
    
    const blog = await safeDbCall(
      async () => {
        return await prisma.blogPost.create({
          data: {
            slug: slug || `post-${Date.now()}`,
            title,
            description,
            content,
            image: image || '/images/events/sadid.jpg',
            isPublished: isPublished !== false,
            publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
            authorId: req.user?.id
          }
        });
      },
      () => {
        const newPost = {
          id: `post-${Date.now()}`,
          slug: slug || `post-${Date.now()}`,
          title: title || 'New Olfactory Journal Article',
          subtitle: description || '',
          description: description || '',
          content: content || description || '',
          image: image || '/images/events/sadid.jpg',
          author: 'Sadid Admin',
          authorRole: 'Founder & Creative Director',
          category: category || 'Olfactory Journal',
          readTime: readTime || '5 min read',
          isPublished: isPublished !== false,
          publishedAt: new Date().toISOString()
        };
        dbStore.blogPosts.unshift(newPost);
        saveBlogsToDisk(dbStore.blogPosts);
        return newPost as any;
      }
    );

    res.status(201).json({ status: 'success', data: blog });
  } catch (error) { next(error); }
});

// Update blog post
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const blog = await safeDbCall(
      async () => {
        return await prisma.blogPost.update({
          where: { id },
          data: req.body
        });
      },
      () => {
        const idx = dbStore.blogPosts.findIndex(p => p.id === id || p.slug === id);
        if (idx !== -1) {
          dbStore.blogPosts[idx] = { ...dbStore.blogPosts[idx], ...req.body };
          saveBlogsToDisk(dbStore.blogPosts);
          return dbStore.blogPosts[idx];
        }
        return { id, ...req.body };
      }
    );

    res.json({ status: 'success', data: blog });
  } catch (error) { next(error); }
});

// Delete blog post
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await safeDbCall(
      async () => {
        await prisma.blogPost.delete({ where: { id } });
      },
      () => {
        dbStore.blogPosts = dbStore.blogPosts.filter(p => p.id !== id && p.slug !== id);
        saveBlogsToDisk(dbStore.blogPosts);
      }
    );

    res.json({ status: 'success', message: 'Blog post deleted' });
  } catch (error) { next(error); }
});

export default router;
