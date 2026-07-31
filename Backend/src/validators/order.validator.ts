import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid phone number is required').max(15),
    location: z.enum(['inside-dhaka', 'outside-dhaka']),
    address: z.string().min(5, 'Full address is required'),
    paymentMethod: z.enum(['COD', 'BKASH', 'NAGAD', 'ROCKET', 'CARD']),
    notes: z.string().optional(),
    // Payment-specific fields
    walletProvider: z.string().optional(),
    walletNumber: z.string().optional(),
    transactionId: z.string().optional(),
    cardLast4: z.string().optional(),
    cardBrand: z.string().optional(),
    // Items to order (product IDs from cart)
    cartItemIds: z.array(z.string()).min(1, 'At least one item is required'),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
    trackingNumber: z.string().optional(),
  }),
});
