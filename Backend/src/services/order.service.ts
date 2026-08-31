import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { generateOrderNumber } from '../utils/orderNumber';
import { getPaginationParams, createPaginatedResult } from '../utils/pagination';

export const createOrder = async (userId: string | null | undefined, data: any) => {
  if (!userId) {
    throw new AppError('Please sign in to place an order.', 401);
  }
  const { cartItemIds, items, ...orderData } = data;

  let subtotal = 0;
  const orderItemsData: any[] = [];
  const stockDeductions: Array<{ sizeId: string; quantity: number }> = [];

  if (items && Array.isArray(items) && items.length > 0) {
    for (const item of items) {
      // Find matching product in DB by id, slug, or name
      let product: any = null;
      if (item.productId) {
        product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { sizes: true }
        });
      }
      if (!product && item.name) {
        product = await prisma.product.findFirst({
          where: {
            OR: [
              { name: { equals: item.name } },
              { slug: { equals: item.name.toLowerCase().replace(/\s+/g, '-') } }
            ]
          },
          include: { sizes: true }
        });
      }

      const selectedSize = item.selectedSize || '12ml';
      const quantity = Math.max(1, Number(item.quantity) || 1);
      
      let unitPrice = item.unitPrice;
      if (!unitPrice && item.prices && typeof item.prices === 'object' && selectedSize in item.prices) {
        unitPrice = Number(item.prices[selectedSize]);
      }
      if (!unitPrice && product && product.sizes && product.sizes.length > 0) {
        const matchingSize = product.sizes.find((s: any) => s.size === selectedSize);
        if (matchingSize) {
          unitPrice = matchingSize.price;
          if (matchingSize.id) {
            stockDeductions.push({ sizeId: matchingSize.id, quantity });
          }
        }
      }
      if (!unitPrice) {
        unitPrice = selectedSize === '6ml' ? 300 : selectedSize === '12ml' ? 500 : selectedSize === '30ml' ? 900 : 2500;
      }

      const totalPrice = unitPrice * quantity;
      subtotal += totalPrice;

      orderItemsData.push({
        productId: product ? product.id : null,
        productName: product ? product.name : item.name,
        productImage: product ? product.image : (item.image || '/images/products/vanilla_28_v2.jpg'),
        selectedSize: selectedSize,
        quantity: quantity,
        unitPrice,
        totalPrice
      });
    }
  } else if (cartItemIds && cartItemIds.length > 0) {
    // 1. Find cart items from DB
    const dbCartItems = await prisma.cartItem.findMany({
      where: { id: { in: cartItemIds } },
      include: { product: { include: { sizes: true } } }
    });

    for (const item of dbCartItems) {
      const sizeData = item.product.sizes.find((s: any) => s.size === item.selectedSize);
      const unitPrice = sizeData ? sizeData.price : 500;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItemsData.push({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.image,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        unitPrice,
        totalPrice
      });

      if (sizeData) {
        stockDeductions.push({ sizeId: sizeData.id, quantity: item.quantity });
      }
    }
  }

  const deliveryCharge = orderData.location === 'inside-dhaka' ? 80 : 150;
  const grandTotal = subtotal + deliveryCharge;

  // Generate unique order number
  let orderNumber = generateOrderNumber();
  let existingOrder = await prisma.order.findUnique({ where: { orderNumber } });
  while (existingOrder) {
    orderNumber = generateOrderNumber();
    existingOrder = await prisma.order.findUnique({ where: { orderNumber } });
  }

  const cleanMethod = (orderData.paymentMethod || 'COD').toUpperCase();

  const order = await prisma.$transaction(async (tx) => {
    // 1. Create order
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        fullName: orderData.fullName,
        email: orderData.email || `${orderData.phone}@guest.murakkaz.com`,
        phone: orderData.phone,
        location: orderData.location,
        address: orderData.address,
        notes: orderData.notes || null,
        deliveryCharge,
        subtotal,
        grandTotal,
        items: {
          create: orderItemsData
        },
        payment: {
          create: {
            method: cleanMethod,
            status: cleanMethod === 'COD' ? 'PENDING' : 'VERIFIED',
            amount: grandTotal,
            walletProvider: orderData.walletProvider || null,
            walletNumber: orderData.walletNumber || null,
            transactionId: orderData.transactionId || null,
            cardLast4: orderData.cardLast4 || (orderData.cardNumber ? orderData.cardNumber.slice(-4) : null),
            cardBrand: orderData.cardBrand || null
          }
        }
      },
      include: {
        items: true,
        payment: true
      }
    });

    // 2. Stock deductions
    for (const deduction of stockDeductions) {
      try {
        await tx.productSize.update({
          where: { id: deduction.sizeId },
          data: { stock: { decrement: deduction.quantity } }
        });
      } catch (err) {
        console.warn('Stock update skipped:', err);
      }
    }

    // 3. Clear cart items if IDs provided
    if (cartItemIds && cartItemIds.length > 0) {
      await tx.cartItem.deleteMany({
        where: { id: { in: cartItemIds } }
      });
    }

    return created;
  });

  return order;
};

export const getUserOrders = async (userId: string, page?: number, limit?: number) => {
  const { skip, take, page: p, limit: l } = getPaginationParams({ page: page?.toString(), limit: limit?.toString() });

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: { items: { include: { product: true } }, payment: true }
    }),
    prisma.order.count({ where: { userId } })
  ]);

  return createPaginatedResult(orders, total, p, l);
};

export const getOrderById = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, payment: true }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.userId !== userId) {
    throw new AppError('Unauthorized access to order', 403);
  }

  return order;
};

export const cancelOrder = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true, items: true }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.userId !== userId) {
    throw new AppError('Unauthorized access to order', 403);
  }

  if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
    throw new AppError('Cannot cancel order in current status', 400);
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    });

    // 2. Restore stock
    for (const item of order.items) {
      if (item.productId) {
        await tx.productSize.updateMany({
          where: { productId: item.productId, size: item.selectedSize },
          data: { stock: { increment: item.quantity } }
        });
      }
    }

    // 3. Handle refund only for verified non-COD payments
    if (order.payment && order.payment.status === 'VERIFIED' && order.payment.method !== 'COD') {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: { status: 'REFUNDED' }
      });
    }

    return tx.order.findUnique({
      where: { id: orderId },
      include: { payment: true, items: true }
    });
  });

  return result;
};

export const getAllOrders = async (filters: { status?: any, page?: number, limit?: number }) => {
  const { skip, take, page: p, limit: l } = getPaginationParams({ page: filters.page?.toString(), limit: filters.limit?.toString() });

  const where: any = {};
  if (filters.status) {
    where.status = filters.status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: { user: { select: { firstName: true, lastName: true, email: true } }, items: true, payment: true }
    }),
    prisma.order.count({ where })
  ]);

  return createPaginatedResult(orders, total, p, l);
};

export const updateOrderStatus = async (orderId: string, data: { status: any, trackingNumber?: string }) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true, items: true }
  });
  if (!order) throw new AppError('Order not found', 404);

  return await prisma.$transaction(async (tx) => {
    // If transitioning to CANCELLED from non-cancelled, restore stock
    if (data.status === 'CANCELLED' && order.status !== 'CANCELLED') {
      for (const item of order.items) {
        if (item.productId) {
          await tx.productSize.updateMany({
            where: { productId: item.productId, size: item.selectedSize },
            data: { stock: { increment: item.quantity } }
          });
        }
      }
    }

    // If order delivered and payment was COD pending, mark payment as verified
    if (data.status === 'DELIVERED' && order.payment && order.payment.status === 'PENDING') {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: { status: 'VERIFIED', verifiedAt: new Date() }
      });
    }

    return await tx.order.update({
      where: { id: orderId },
      data: {
        status: data.status,
        ...(data.trackingNumber && { trackingNumber: data.trackingNumber })
      },
      include: { payment: true, items: true }
    });
  });
};

export const trackOrderByNumber = async (orderNumber: string, phoneOrEmail?: string) => {
  const cleanOrderNum = orderNumber.trim();
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { orderNumber: cleanOrderNum },
        { orderNumber: cleanOrderNum.toUpperCase() },
        { id: cleanOrderNum }
      ]
    },
    include: {
      items: true,
      payment: {
        select: {
          method: true,
          status: true,
          amount: true
        }
      }
    }
  });

  if (!order) {
    throw new AppError('No order found with the provided order number', 404);
  }

  if (phoneOrEmail && phoneOrEmail.trim()) {
    const cleanContact = phoneOrEmail.trim().toLowerCase();
    const phoneMatch = order.phone.replace(/\D/g, '').includes(cleanContact.replace(/\D/g, ''));
    const emailMatch = order.email.toLowerCase() === cleanContact;
    if (!phoneMatch && !emailMatch) {
      throw new AppError('The phone number or email does not match this order', 403);
    }
  }

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    trackingNumber: order.trackingNumber,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    fullName: order.fullName,
    phone: order.phone,
    address: order.address,
    location: order.location,
    subtotal: order.subtotal,
    deliveryCharge: order.deliveryCharge,
    grandTotal: order.grandTotal,
    paymentMethod: order.payment?.method || 'COD',
    paymentStatus: order.payment?.status || 'PENDING',
    items: order.items.map(item => ({
      id: item.id,
      productName: item.productName,
      productImage: item.productImage,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice
    }))
  };
};
