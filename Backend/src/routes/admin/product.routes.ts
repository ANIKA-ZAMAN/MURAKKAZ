import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../../config/database';
import { NoteType } from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';
import { safeDbCall, dbStore, saveProductsToDisk } from '../../services/resilientDb';

const router = Router();

function sanitizeSizes(sizes: any[]) {
  if (!Array.isArray(sizes) || sizes.length === 0) return undefined;
  return sizes.map((s: any) => ({
    size: String(s.size || '50ml'),
    price: Math.round(Number(s.price) || 0),
    originalPrice: s.originalPrice ? Math.round(Number(s.originalPrice)) : undefined,
    stock: Math.round(Number(s.stock) || 0),
  }));
}

function sanitizeNotes(notes: any[]) {
  if (!Array.isArray(notes) || notes.length === 0) return undefined;
  return notes.map((n: any) => {
    const rawType = String(n.type || 'TOP').toUpperCase();
    const type: NoteType = (['TOP', 'MIDDLE', 'BASE', 'GENERAL'].includes(rawType) ? rawType : 'TOP') as NoteType;
    return {
      name: String(n.name || n),
      type,
    };
  });
}

function sanitizeAccords(accords: any[]) {
  if (!Array.isArray(accords) || accords.length === 0) return undefined;
  return accords.map((a: any) => ({
    name: String(a.name),
    percentage: Math.round(Number(a.percentage || a.pct) || 0),
    color: a.color ? String(a.color) : undefined,
  }));
}

function sanitizeBestFor(bestFor: any[]) {
  if (!Array.isArray(bestFor) || bestFor.length === 0) return undefined;
  return bestFor.map((b: any) => ({
    name: String(b.name),
    percentage: Math.round(Number(b.percentage || b.pct) || 0),
  }));
}

function sanitizeGallery(galleryImages: any[]) {
  if (!Array.isArray(galleryImages) || galleryImages.length === 0) return undefined;
  return galleryImages.map((g: any, idx: number) => ({
    url: String(typeof g === 'string' ? g : g.url),
    sortOrder: typeof g === 'object' && typeof g.sortOrder === 'number' ? g.sortOrder : idx,
  }));
}

// Create product
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sizes, notes, accords, bestFor, galleryImages, priceVal, ...productData } = req.body;

    const cleanSizes = sanitizeSizes(sizes);
    const cleanNotes = sanitizeNotes(notes);
    const cleanAccords = sanitizeAccords(accords);
    const cleanBestFor = sanitizeBestFor(bestFor);
    const cleanGallery = sanitizeGallery(galleryImages);

    const product = await safeDbCall(
      async () => {
        return await prisma.product.create({
          data: {
            ...productData,
            slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            image: productData.image || '/images/products/jade_serenity.png',
            family: productData.family || 'WOODY',
            gender: productData.gender || 'UNISEX',
            occasion: productData.occasion || 'General',
            meter: productData.meter || 'LONG_LASTING',
            sizes: cleanSizes ? { create: cleanSizes } : undefined,
            notes: cleanNotes ? { create: cleanNotes } : undefined,
            accords: cleanAccords ? { create: cleanAccords } : undefined,
            bestFor: cleanBestFor ? { create: cleanBestFor } : undefined,
            galleryImages: cleanGallery ? { create: cleanGallery } : undefined,
          },
          include: { sizes: true, notes: true, accords: true, bestFor: true, galleryImages: true },
        });
      },
      () => {
        const newProduct = {
          id: `prod-${Date.now()}`,
          slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name: productData.name || 'New Fragrance',
          brand: productData.brand || 'Murakkaz',
          description: productData.description || '',
          rating: 5.0,
          reviewCount: 0,
          image: productData.image || '/images/products/jade_serenity.png',
          family: productData.family || 'WOODY',
          gender: productData.gender || 'UNISEX',
          occasion: productData.occasion || 'General',
          meter: productData.meter || 'LONG_LASTING',
          isActive: true,
          priceVal: priceVal || (cleanSizes?.[0]?.price) || 2800,
          sizes: cleanSizes || [{ size: '50ml', price: 2800 }],
          notes: cleanNotes || [],
          accords: cleanAccords || [],
          bestFor: cleanBestFor || [],
          galleryImages: cleanGallery || [],
        };
        dbStore.products.unshift(newProduct);
        saveProductsToDisk(dbStore.products);
        return newProduct as any;
      }
    );

    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    console.error('Create product error:', error);
    next(error);
  }
});

// Update product
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { sizes, notes, accords, bestFor, galleryImages, priceVal, ...productData } = req.body;

    const cleanSizes = sanitizeSizes(sizes);
    const cleanNotes = sanitizeNotes(notes);
    const cleanAccords = sanitizeAccords(accords);
    const cleanBestFor = sanitizeBestFor(bestFor);
    const cleanGallery = sanitizeGallery(galleryImages);

    const product = await safeDbCall(
      async () => {
        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) throw new AppError('Product not found', 404);

        return await prisma.$transaction(async (tx) => {
          if (cleanSizes) {
            await tx.productSize.deleteMany({ where: { productId: id } });
            await tx.productSize.createMany({
              data: cleanSizes.map(s => ({ ...s, productId: id }))
            });
          }

          if (cleanNotes) {
            await tx.productNote.deleteMany({ where: { productId: id } });
            await tx.productNote.createMany({
              data: cleanNotes.map(n => ({ ...n, productId: id }))
            });
          }

          if (cleanAccords) {
            await tx.productAccord.deleteMany({ where: { productId: id } });
            await tx.productAccord.createMany({
              data: cleanAccords.map(a => ({ ...a, productId: id }))
            });
          }

          if (cleanBestFor) {
            await tx.productBestFor.deleteMany({ where: { productId: id } });
            await tx.productBestFor.createMany({
              data: cleanBestFor.map(b => ({ ...b, productId: id }))
            });
          }

          if (cleanGallery) {
            await tx.productGalleryImage.deleteMany({ where: { productId: id } });
            await tx.productGalleryImage.createMany({
              data: cleanGallery.map(g => ({ ...g, productId: id }))
            });
          }

          return await tx.product.update({
            where: { id },
            data: productData,
            include: { sizes: true, notes: true, accords: true, bestFor: true, galleryImages: true },
          });
        });
      },
      () => {
        const idx = dbStore.products.findIndex((p) => p.id === id);
        if (idx !== -1) {
          dbStore.products[idx] = {
            ...dbStore.products[idx],
            ...productData,
            ...(cleanSizes && { sizes: cleanSizes }),
            ...(cleanNotes && { notes: cleanNotes }),
            ...(cleanAccords && { accords: cleanAccords }),
            ...(cleanBestFor && { bestFor: cleanBestFor }),
            ...(cleanGallery && { galleryImages: cleanGallery }),
          };
          saveProductsToDisk(dbStore.products);
          return dbStore.products[idx];
        }
        return { id, ...productData };
      }
    );

    res.json({ status: 'success', data: product });
  } catch (error) {
    console.error('Update product error:', error);
    next(error);
  }
});

// Delete product
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await safeDbCall(
      async () => {
        await prisma.product.update({ where: { id }, data: { isActive: false } });
      },
      () => {
        dbStore.products = dbStore.products.filter((p) => p.id !== id);
        saveProductsToDisk(dbStore.products);
      }
    );

    res.json({ status: 'success', message: 'Product deactivated' });
  } catch (error) {
    console.error('Delete product error:', error);
    next(error);
  }
});

export default router;
