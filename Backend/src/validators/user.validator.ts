import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    phone: z.string().min(10).max(15).optional(),
    primaryLocation: z.string().max(100).optional(),
  }),
});

export const updatePreferencesSchema = z.object({
  body: z.object({
    darkMode: z.boolean().optional(),
    ambientParticle: z.boolean().optional(),
    soundEffects: z.boolean().optional(),
    newsletter: z.boolean().optional(),
    reminders: z.boolean().optional(),
  }),
});

export const createAddressSchema = z.object({
  body: z.object({
    type: z.enum(['SHIPPING', 'BILLING']).optional(),
    fullName: z.string().min(1, 'Full name is required'),
    company: z.string().optional(),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().optional(),
    phone: z.string().min(10, 'Valid phone number is required'),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = createAddressSchema;
