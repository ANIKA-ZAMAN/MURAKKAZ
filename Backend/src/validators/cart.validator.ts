import { z } from 'zod';

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    selectedSize: z.string().min(1, 'Size is required'),
    quantity: z.number().int().positive().default(1),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    selectedSize: z.string().optional(),
    quantity: z.number().int().positive().optional(),
  }),
});

export const mergeCartSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      productId: z.string(),
      selectedSize: z.string(),
      quantity: z.number().int().positive(),
    })),
  }),
});
