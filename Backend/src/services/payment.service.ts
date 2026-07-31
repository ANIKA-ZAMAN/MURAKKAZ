import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const initiateBkashPayment = async (orderId: string, amount: number) => {
  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) throw new AppError('Payment record not found', 404);

  // Update payment status (placeholder for actual gateway initialization)
  console.log('Initiating mock bKash payment...');
  await prisma.payment.update({
    where: { id: payment.id },
    data: { gatewayRef: 'mock-bkash-' + orderId }
  });

  return {
    paymentURL: 'https://sandbox.bka.sh/payment/' + orderId,
    paymentID: 'mock-bkash-' + orderId
  };
};

export const handleBkashCallback = async (paymentID: string, status: string) => {
  const payment = await prisma.payment.findFirst({ where: { gatewayRef: paymentID } });
  if (!payment) throw new AppError('Payment not found', 404);

  if (status === 'success') {
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'VERIFIED', verifiedAt: new Date() }
      });
      await tx.order.update({
        where: { id: payment.orderId },
        data: { status: 'CONFIRMED' }
      });
    });
  } else {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' }
    });
  }

  return { status };
};

export const initiateSSLCommerzPayment = async (orderId: string, amount: number, customerInfo: any) => {
  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) throw new AppError('Payment record not found', 404);

  console.log('Initiating mock SSLCommerz payment...');
  await prisma.payment.update({
    where: { id: payment.id },
    data: { gatewayRef: 'mock-ssl-' + orderId }
  });

  return {
    GatewayPageURL: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php?tran_id=' + orderId
  };
};

export const handleSSLCommerzCallback = async (data: { tran_id: string, status: string, val_id?: string }) => {
  const payment = await prisma.payment.findFirst({ where: { gatewayRef: data.tran_id } });
  if (!payment) throw new AppError('Payment not found', 404);

  if (data.status === 'VALID' || data.status === 'SUCCESS') {
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'VERIFIED', verifiedAt: new Date() }
      });
      await tx.order.update({
        where: { id: payment.orderId },
        data: { status: 'CONFIRMED' }
      });
    });
  } else {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' }
    });
  }

  return { status: data.status };
};

export const verifyPayment = async (orderId: string) => {
  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) throw new AppError('Payment record not found', 404);

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: 'VERIFIED', verifiedAt: new Date() }
    });
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' }
    });
  });

  return { message: 'Payment verified manually' };
};
