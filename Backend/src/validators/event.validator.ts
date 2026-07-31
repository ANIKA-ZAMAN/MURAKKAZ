import { z } from 'zod';

export const setReminderSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
  }),
});
