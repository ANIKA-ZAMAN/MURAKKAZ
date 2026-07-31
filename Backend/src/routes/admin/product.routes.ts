import { Request, Response, NextFunction, Router } from 'express';
import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { uploadProductImages } from '../../config/upload';
import { safeDbCall, dbStore, saveProductsToDisk } from '../../services/resilientDb';

const router = Router();

// Create product
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sizes, notes, accords, bestFor, galleryImages, priceVal, ...productData } = req.body;
    
    const product = await safeDbCall(
      async () => {
        return await prisma.product.create({
          data: {
            ...productData,
            sizes: sizes ? { create: sizes } : undefined,
            notes: notes ? { create: notes } : undefined,
            accords: accords ? { create: accords } : undefined,
            bestFor: bestFor ? { create: bestFor } : undefined,
            galleryImages: galleryImages ? { create: galleryImages } : undefined,
          },
          include: { sizes: true, notes: true, accords: true, bestFor: true, galleryImages: true },
        });
      },
      () => {
        const newProduct = {
          id: `prod-${Date.now()}`,
          slug: productData.slug || `product-${Date.now()}`,
          name: productData.name || 'New Fragrance',
          brand: productData.brand || 'Murakkaz',
          description: productData.description || '',
          rating: 5.0,
          reviewCount: 0,
          image: productData.image || '/images/products/jade_serenity.png',
          family: productData.family || 'Oriental',
          gender: productData.gender || 'Unisex',
          occasion: productData.occasion || 'General',
          meter: productData.meter || 'Moderate',
          isActive: true,
          priceVal: priceVal || (sizes?.[0]?.price) || 2800,
          sizes: sizes || [{ size: '50ml', price: priceVal || 2800 }],
          notes: notes || []
        };
        dbStore.products.unshift(newProduct);
        saveProductsToDisk(dbStore.products);
        return newProduct as any;
      }
    );

    res.status(201).json({ status: 'success', data: product });
  } catch (error) { next(error); }
});

// Update product
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { sizes, notes, accords, bestFor, galleryImages, ...productData } = req.body;
    
    const product = await safeDbCall(
      async () => {
        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) throw new AppError('Product not found', 404);
        
        return await prisma.product.update({
          where: { id },
          data: productData,
          include: { sizes: true, notes: true, accords: true, bestFor: true, galleryImages: true },
        });
      },
      () => {
        const idx = dbStore.products.findIndex((p) => p.id === id);
        if (idx !== -1) {
          dbStore.products[idx] = { ...dbStore.products[idx], ...productData };
          saveProductsToDisk(dbStore.products);
          return dbStore.products[idx];
        }
        return { id, ...productData };
      }
    );

    res.json({ status: 'success', data: product });
  } catch (error) { next(error); }
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
  } catch (error) { next(error); }
});

export default router;
