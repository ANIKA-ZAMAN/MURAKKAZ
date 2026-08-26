import { env } from '../config/env';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

let cachedToken: { id_token: string; expires_at: number } | null = null;

const getBkashHeaders = async () => {
  const token = await getOrGrantIdToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'authorization': token,
    'x-app-key': env.BKASH_APP_KEY || ''
  };
};

export const isBkashConfigured = (): boolean => {
  return Boolean(
    env.BKASH_APP_KEY &&
    env.BKASH_APP_SECRET &&
    env.BKASH_USERNAME &&
    env.BKASH_PASSWORD
  );
};

export const getOrGrantIdToken = async (): Promise<string> => {
  if (!isBkashConfigured()) {
    return 'mock_bkash_id_token_' + Date.now();
  }

  // Check if token is still valid (with 5 min safety buffer)
  if (cachedToken && cachedToken.expires_at > Date.now() + 300000) {
    return cachedToken.id_token;
  }

  const baseUrl = env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
  
  try {
    const res = await fetch(`${baseUrl}/tokenized/checkout/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'username': env.BKASH_USERNAME || '',
        'password': env.BKASH_PASSWORD || ''
      },
      body: JSON.stringify({
        app_key: env.BKASH_APP_KEY,
        app_secret: env.BKASH_APP_SECRET
      })
    });

    const data: any = await res.json();

    if (data && data.id_token) {
      cachedToken = {
        id_token: data.id_token,
        expires_at: Date.now() + (Number(data.expires_in) || 3600) * 1000
      };
      return cachedToken.id_token;
    } else {
      throw new Error(data?.statusMessage || 'Failed to grant bKash token');
    }
  } catch (error: any) {
    console.error('bKash Token Grant Error:', error.message);
    throw new AppError('Unable to authenticate with bKash payment gateway', 500);
  }
};

export const createBkashPayment = async (orderId: string, callbackUrl?: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true }
  });

  if (!order) throw new AppError('Order not found', 404);

  const amount = order.grandTotal.toString();
  const invoice = order.orderNumber;
  const baseUrl = env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
  const effectiveCallbackUrl = callbackUrl || `${env.FRONTEND_URL}/checkout/bkash-callback`;

  // Fallback to simulation mode if keys not yet configured
  if (!isBkashConfigured()) {
    console.log(`[bKash Sim Mode] Creating mock payment for order ${order.orderNumber} (৳${amount})`);
    const mockPaymentID = 'SIM-BKASH-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    
    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: { gatewayRef: mockPaymentID }
      });
    }

    return {
      paymentID: mockPaymentID,
      bkashURL: `${env.FRONTEND_URL}/checkout/bkash-callback?paymentID=${mockPaymentID}&status=success`,
      status: 'Initiated',
      isSandbox: true
    };
  }

  try {
    const headers = await getBkashHeaders();
    const payload = {
      mode: '0011',
      payerReference: order.phone,
      callbackURL: effectiveCallbackUrl,
      amount,
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: invoice
    };

    const res = await fetch(`${baseUrl}/tokenized/checkout/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data: any = await res.json();

    if (data && data.paymentID && data.bkashURL) {
      if (order.payment) {
        await prisma.payment.update({
          where: { id: order.payment.id },
          data: { gatewayRef: data.paymentID }
        });
      }

      return {
        paymentID: data.paymentID,
        bkashURL: data.bkashURL,
        status: data.transactionStatus || 'Initiated',
        isSandbox: baseUrl.includes('sandbox')
      };
    } else {
      throw new Error(data?.statusMessage || 'Failed to create bKash checkout session');
    }
  } catch (error: any) {
    console.error('bKash Create Payment Error:', error.message);
    throw new AppError(error.message || 'bKash payment initialization failed', 500);
  }
};

export const executeBkashPayment = async (paymentID: string) => {
  const payment = await prisma.payment.findFirst({
    where: { gatewayRef: paymentID },
    include: { order: true }
  });

  if (!payment) throw new AppError('Payment session not found', 404);

  // Simulation mode
  if (!isBkashConfigured()) {
    console.log(`[bKash Sim Mode] Executing simulated capture for payment ${paymentID}`);
    const mockTrxID = 'TRX' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'VERIFIED',
          transactionId: mockTrxID,
          verifiedAt: new Date()
        }
      });

      const o = await tx.order.update({
        where: { id: payment.orderId },
        data: { status: 'CONFIRMED' }
      });

      return { payment: p, order: o };
    });

    return {
      status: 'success',
      trxID: mockTrxID,
      orderNumber: updated.order.orderNumber,
      amount: updated.payment.amount
    };
  }

  const baseUrl = env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';

  try {
    const headers = await getBkashHeaders();
    const res = await fetch(`${baseUrl}/tokenized/checkout/execute`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ paymentID })
    });

    const data: any = await res.json();

    if (data && (data.statusCode === '0000' || data.transactionStatus === 'Completed')) {
      const trxID = data.trxID || paymentID;

      const updated = await prisma.$transaction(async (tx) => {
        const p = await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'VERIFIED',
            transactionId: trxID,
            verifiedAt: new Date()
          }
        });

        const o = await tx.order.update({
          where: { id: payment.orderId },
          data: { status: 'CONFIRMED' }
        });

        return { payment: p, order: o };
      });

      return {
        status: 'success',
        trxID,
        orderNumber: updated.order.orderNumber,
        amount: data.amount
      };
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      });

      throw new Error(data?.statusMessage || 'bKash transaction was not completed');
    }
  } catch (error: any) {
    console.error('bKash Execute Payment Error:', error.message);
    throw new AppError(error.message || 'bKash payment execution failed', 500);
  }
};
