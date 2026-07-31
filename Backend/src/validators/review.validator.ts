import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    stars: z.number().int().min(1).max(5),
    quote: z.string().min(5, 'Review must be at least 5 characters'),
    longevity: z.string().optional(),
    projection: z.string().optional(),
    compliments: z.string().optional(),
  }),
});
