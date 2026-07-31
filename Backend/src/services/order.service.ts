import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { generateOrderNumber } from '../utils/orderNumber';
import { getPaginationParams, createPaginatedResult } from '../utils/pagination';

export const createOrder = async (userId: string, data: any) => {
  const { cartItemIds, ...orderData } = data;

  // 1. Find cart items
  const cartItems = await prisma.cartItem.findMany({
    where: { id: { in: cartItemIds } },
    include: { product: { include: { sizes: true } } }
  });

  if (cartItems.length !== cartItemIds.length) {
    throw new AppError('Some cart items were not found', 404);
  }

  for (const item of cartItems) {
    if (item.userId !== userId) {
      throw new AppError('Unauthorized access to cart items', 403);
    }
  }

  let subtotal = 0;
  const orderItemsData: any[] = [];

  for (const item of cartItems) {
    const sizeData = item.product.sizes.find(s => s.size === item.selectedSize);
    if (!sizeData) {
      throw new AppError(`Size ${item.selectedSize} not found for product ${item.product.name}`, 400);
    }
    const unitPrice = sizeData.price;
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
  }

  const deliveryCharge = orderData.location === 'inside-dhaka' ? 80 : 150;
  const grandTotal = subtotal + deliveryCharge;
  const orderNumber = generateOrderNumber();

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        fullName: orderData.fullName,
        email: orderData.email,
        phone: orderData.phone,
        location: orderData.location,
        address: orderData.address,
        notes: orderData.notes,
        deliveryCharge,
        subtotal,
        grandTotal,
        items: {
          create: orderItemsData
        },
        payment: {
          create: {
            method: orderData.paymentMethod,
            status: orderData.paymentMethod === 'COD' ? 'VERIFIED' : 'PENDING',
            amount: grandTotal,
            walletProvider: orderData.walletProvider,
            walletNumber: orderData.walletNumber,
            transactionId: orderData.transactionId,
            cardLast4: orderData.cardLast4,
            cardBrand: orderData.cardBrand
          }
        }
      },
      include: {
        items: true,
        payment: true
      }
    });

    await tx.cartItem.deleteMany({
      where: { id: { in: cartItemIds } }
    });

    return order;
  });

  return result;
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
    include: { payment: true }
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
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    });

    if (order.payment && order.payment.status === 'VERIFIED') {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: { status: 'REFUNDED' }
      });
    }

    return tx.order.findUnique({
      where: { id: orderId },
      include: { payment: true }
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
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError('Order not found', 404);

  return await prisma.order.update({
    where: { id: orderId },
    data: {
      status: data.status,
      ...(data.trackingNumber && { trackingNumber: data.trackingNumber })
    },
    include: { payment: true, items: true }
  });
};
