import { z } from 'zod';

export const productQuerySchema = z.object({
  query: z.object({
    q: z.string().optional(),
    family: z.string().optional(), // comma-separated: "CITRUS,WOODY"
    gender: z.string().optional(), // comma-separated: "MEN,UNISEX"
    occasion: z.string().optional(),
    meter: z.string().optional(),
    notes: z.string().optional(), // comma-separated note names
    maxPrice: z.coerce.number().positive().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(1000).optional(),
  }),
});

export const compareQuerySchema = z.object({
  query: z.object({
    slugs: z.string().min(1, 'At least one product slug is required'),
  }),
});

export const recommendationQuerySchema = z.object({
  query: z.object({
    gender: z.string().optional(),
    occasion: z.string().optional(),
    intensity: z.string().optional(),
    family: z.string().optional(),
    season: z.string().optional(),
    notes: z.string().optional(),
  }),
});
