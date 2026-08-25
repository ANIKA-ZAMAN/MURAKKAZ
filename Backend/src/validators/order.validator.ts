import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Valid email is required').optional().or(z.literal('')),
    phone: z.string().min(10, 'Valid phone number is required').max(20),
    location: z.enum(['inside-dhaka', 'outside-dhaka']),
    address: z.string().min(3, 'Full address is required'),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    notes: z.string().optional(),
    walletProvider: z.string().optional(),
    walletNumber: z.string().optional(),
    transactionId: z.string().optional(),
    cardLast4: z.string().optional(),
    cardBrand: z.string().optional(),
    cartItemIds: z.array(z.string()).optional(),
    items: z.array(z.object({
      id: z.string().optional(),
      productId: z.string().optional(),
      name: z.string(),
      selectedSize: z.string().default('12ml'),
      quantity: z.number().int().positive().default(1),
      prices: z.record(z.string(), z.number()).optional(),
      unitPrice: z.number().positive().optional(),
      image: z.string().optional(),
      inspiredBy: z.string().optional(),
    })).optional(),
  }).refine(data => (data.cartItemIds && data.cartItemIds.length > 0) || (data.items && data.items.length > 0), {
    message: 'At least one item is required to place an order',
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
    trackingNumber: z.string().optional(),
  }),
});
