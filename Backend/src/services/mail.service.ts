import nodemailer from 'nodemailer';
import { env } from '../config/env';

// Configure nodemailer transporter
const createTransporter = () => {
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    if (env.SMTP_HOST.includes('gmail')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS.replace(/\s+/g, ''),
        }
      });
    }

    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 587,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS.replace(/\s+/g, ''),
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return null;
};

const transporter = createTransporter();

/**
 * Generic email dispatcher supporting Resend API, SMTP, and mock fallback
 */
export const sendEmail = async ({
  to,
  subject,
  htmlContent,
}: {
  to: string;
  subject: string;
  htmlContent: string;
}) => {
  console.log(`\n========================================`);
  console.log(`[OUTBOUND EMAIL DISPATCH]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`========================================\n`);

  // 1. If Resend API Key is configured -> use Resend REST API (from info@murakkaz.com)
  if (env.RESEND_API_KEY) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Murakkaz Fragrances <info@murakkaz.com>',
          to: [to],
          subject,
          html: htmlContent,
        }),
      });

      const resendData: any = await resendRes.json();
      if (resendRes.ok) {
        console.log(`✅ Real email delivered via Resend from info@murakkaz.com to ${to}`);
        return { delivered: true, resendId: resendData.id };
      } else {
        console.warn(`⚠️ Resend API response error:`, resendData);
      }
    } catch (resendErr) {
      console.error(`⚠️ Resend API network error:`, resendErr);
    }
  }

  // 2. Fallback to SMTP (e.g. Gmail SMTP)
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Murakkaz Fragrances" <${env.SMTP_USER || 'info@murakkaz.com'}>`,
        to,
        subject,
        html: htmlContent,
      });
      console.log(`✅ Real email delivered via SMTP to ${to}`);
      return { delivered: true };
    } catch (mailError) {
      console.error(`⚠️ SMTP delivery failed:`, mailError);
      return { delivered: false, error: mailError };
    }
  }

  return { delivered: false, note: 'Simulated dispatch (No active SMTP/Resend transport configured)' };
};

export const sendOtpEmail = async (toEmail: string, code: string, type: 'REGISTER' | 'LOGIN' | 'RESET' = 'REGISTER') => {
  const subject = type === 'REGISTER' 
    ? '✨ Verify Your Murakkaz Account' 
    : type === 'LOGIN' 
      ? '🔐 Your Murakkaz Sign In Code' 
      : '🔑 Reset Your Murakkaz Password';

  const title = type === 'REGISTER' 
    ? 'Welcome to the Circle of Connoisseurs' 
    : type === 'LOGIN' 
      ? 'Sign In Verification Code' 
      : 'Password Reset Request';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Georgia', serif; background-color: #0A0A0A; color: #F5F1E8; margin: 0; padding: 20px; }
        .container { max-width: 540px; margin: 0 auto; background: #141414; border: 1px solid rgba(197, 168, 128, 0.3); border-radius: 8px; padding: 36px 28px; text-align: center; }
        .logo { font-size: 26px; letter-spacing: 4px; color: #C5A880; margin-bottom: 8px; font-weight: bold; text-transform: uppercase; }
        .subtitle { font-size: 11px; letter-spacing: 2px; color: #888888; text-transform: uppercase; margin-bottom: 28px; }
        .title { font-size: 18px; color: #F5F1E8; margin-bottom: 16px; font-weight: normal; }
        .desc { font-size: 14px; line-height: 1.6; color: #AAAAAA; margin-bottom: 28px; font-family: sans-serif; }
        .otp-box { display: inline-block; background: #1F1B16; border: 1px solid #C5A880; border-radius: 6px; padding: 14px 28px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #C5A880; font-family: monospace; margin-bottom: 24px; }
        .warning { font-size: 12px; color: #777777; font-family: sans-serif; line-height: 1.5; }
        .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #555555; font-family: sans-serif; letter-spacing: 1px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">MURAKKAZ</div>
        <div class="subtitle">House of Rare Scents • Dhaka</div>
        
        <h2 class="title">${title}</h2>
        <p class="desc">Please use the verification code below to confirm your email address. This code is confidential and will expire in <strong>5 minutes</strong>.</p>
        
        <div class="otp-box">${code}</div>
        
        <p class="warning">If you did not request this verification code, please ignore this email or contact our atelier support.</p>
        
        <div class="footer">
          MURAKKAZ FRAGRANCES &copy; 2026. ALL RIGHTS RESERVED.<br>
          BANANI, DHAKA, BANGLADESH
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: toEmail, subject, htmlContent });
};

/**
 * Send Luxury Order Confirmation Email
 */
export const sendOrderConfirmationEmail = async (order: {
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: string;
  items: Array<{
    productName: string;
    selectedSize: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productImage?: string;
  }>;
}) => {
  if (!order.email || !order.email.includes('@')) return;

  const subject = `✨ Your Murakkaz Order Confirmation [#${order.orderNumber}]`;

  const itemsHtml = order.items.map(item => `
    <tr style="border-bottom: 1px solid rgba(197, 168, 128, 0.15);">
      <td style="padding: 12px 8px; text-align: left;">
        <strong style="color: #F5F1E8; font-size: 14px;">${item.productName}</strong><br>
        <span style="color: #A0A0A5; font-size: 12px;">Size: ${item.selectedSize} · Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px 8px; text-align: right; color: #C5A880; font-weight: bold; font-size: 14px;">
        ৳${item.totalPrice.toLocaleString()}
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Georgia', serif; background-color: #0A0A0A; color: #F5F1E8; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #141414; border: 1px solid rgba(197, 168, 128, 0.3); border-radius: 10px; padding: 36px 28px; text-align: center; }
        .logo { font-size: 28px; letter-spacing: 5px; color: #C5A880; font-weight: bold; text-transform: uppercase; }
        .subtitle { font-size: 11px; letter-spacing: 2px; color: #888888; text-transform: uppercase; margin-bottom: 24px; }
        .order-badge { display: inline-block; background: #820011; color: #FFFFFF; font-size: 13px; font-weight: bold; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; letter-spacing: 1px; }
        .greeting { font-size: 16px; color: #F5F1E8; margin-bottom: 12px; }
        .desc { font-size: 13px; line-height: 1.6; color: #AAAAAA; margin-bottom: 24px; font-family: sans-serif; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-family: sans-serif; }
        .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #AAAAAA; font-family: sans-serif; }
        .total-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 16px; font-weight: bold; color: #C5A880; border-top: 1px solid rgba(197, 168, 128, 0.3); margin-top: 10px; font-family: sans-serif; }
        .btn-track { display: inline-block; background: #820011; color: #FFFFFF !important; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; font-size: 14px; margin-top: 24px; letter-spacing: 1px; font-family: sans-serif; }
        .info-card { background: #1C1C1F; border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 14px; text-align: left; margin-top: 20px; font-size: 12px; color: #AAAAAA; font-family: sans-serif; line-height: 1.6; }
        .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #555555; font-family: sans-serif; letter-spacing: 1px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">MURAKKAZ</div>
        <div class="subtitle">House of Rare Scents • Dhaka</div>
        
        <div class="order-badge">ORDER CONFIRMED</div>
        <div class="greeting">Dear ${order.fullName},</div>
        <p class="desc">Thank you for indulging with Murakkaz. Your luxury fragrance order <strong>#${order.orderNumber}</strong> has been received and is entering our fragrance preparation atelier.</p>
        
        <table class="table">
          ${itemsHtml}
        </table>
        
        <div style="max-width: 320px; margin-left: auto;">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>৳${order.subtotal.toLocaleString()}</span>
          </div>
          <div class="summary-row">
            <span>Delivery (${order.location === 'inside-dhaka' ? 'Dhaka' : 'Nationwide'})</span>
            <span>৳${order.deliveryCharge}</span>
          </div>
          <div class="total-row">
            <span>Grand Total</span>
            <span>৳${order.grandTotal.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="info-card">
          <strong style="color: #F5F1E8;">Shipping To:</strong><br>
          ${order.fullName} · ${order.phone}<br>
          ${order.address}<br>
          <strong style="color: #F5F1E8;">Payment Method:</strong> ${order.paymentMethod}
        </div>
        
        <a href="https://murakkaz.com/track-order?id=${encodeURIComponent(order.orderNumber)}" class="btn-track">
          TRACK ORDER LIVE →
        </a>
        
        <div class="footer">
          MURAKKAZ FRAGRANCES &copy; 2026. ALL RIGHTS RESERVED.<br>
          BANANI, DHAKA, BANGLADESH
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: order.email, subject, htmlContent });
};

/**
 * Send Steadfast Shipped Email with Tracking Code
 */
export const sendOrderShippedEmail = async (order: {
  orderNumber: string;
  fullName: string;
  email: string;
  trackingNumber: string;
  location: string;
}) => {
  if (!order.email || !order.email.includes('@')) return;

  const subject = `📦 Your Fragrance is On Its Way! [Steadfast: ${order.trackingNumber}]`;
  const estimatedDays = order.location === 'inside-dhaka' ? '1–2 business days' : '2–3 business days';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Georgia', serif; background-color: #0A0A0A; color: #F5F1E8; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #141414; border: 1px solid rgba(197, 168, 128, 0.3); border-radius: 10px; padding: 36px 28px; text-align: center; }
        .logo { font-size: 28px; letter-spacing: 5px; color: #C5A880; font-weight: bold; text-transform: uppercase; }
        .subtitle { font-size: 11px; letter-spacing: 2px; color: #888888; text-transform: uppercase; margin-bottom: 24px; }
        .shipped-badge { display: inline-block; background: #059669; color: #FFFFFF; font-size: 13px; font-weight: bold; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; letter-spacing: 1px; }
        .tracking-box { background: #1C1C1F; border: 1px solid #C5A880; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center; }
        .tracking-code { font-size: 20px; font-family: monospace; color: #FFD700; font-weight: bold; letter-spacing: 2px; }
        .btn-track { display: inline-block; background: #820011; color: #FFFFFF !important; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; font-size: 14px; margin-top: 16px; letter-spacing: 1px; font-family: sans-serif; }
        .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #555555; font-family: sans-serif; letter-spacing: 1px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">MURAKKAZ</div>
        <div class="subtitle">House of Rare Scents • Dhaka</div>
        
        <div class="shipped-badge">PARCEL IN TRANSIT</div>
        <div style="font-size: 16px; color: #F5F1E8; margin-bottom: 12px;">Dear ${order.fullName},</div>
        <p style="font-size: 13px; line-height: 1.6; color: #AAAAAA; font-family: sans-serif;">
          Your luxury fragrance parcel for order <strong>#${order.orderNumber}</strong> has been audited, hand-packed in our signature box, and handed over to <strong>Steadfast Courier</strong>.
        </p>
        
        <div class="tracking-box">
          <div style="font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-family: sans-serif;">Steadfast Consignment Code</div>
          <div class="tracking-code">${order.trackingNumber}</div>
          <div style="font-size: 12px; color: #AAAAAA; margin-top: 8px; font-family: sans-serif;">Estimated Delivery: <strong>${estimatedDays}</strong></div>
        </div>
        
        <a href="https://steadfast.com.bd/t/${encodeURIComponent(order.trackingNumber)}" class="btn-track" style="margin-right: 8px;">
          TRACK ON STEADFAST ↗
        </a>
        <a href="https://murakkaz.com/track-order?id=${encodeURIComponent(order.orderNumber)}" class="btn-track" style="background: #2A2A2E;">
          MURAKKAZ PORTAL →
        </a>
        
        <div class="footer">
          MURAKKAZ FRAGRANCES &copy; 2026. ALL RIGHTS RESERVED.<br>
          BANANI, DHAKA, BANGLADESH
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: order.email, subject, htmlContent });
};

/**
 * Send Delivery Confirmation & Fragrance Care Note
 */
export const sendOrderDeliveredEmail = async (order: {
  orderNumber: string;
  fullName: string;
  email: string;
}) => {
  if (!order.email || !order.email.includes('@')) return;

  const subject = `🌹 Your Murakkaz Fragrance Has Arrived [#${order.orderNumber}]`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Georgia', serif; background-color: #0A0A0A; color: #F5F1E8; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #141414; border: 1px solid rgba(197, 168, 128, 0.3); border-radius: 10px; padding: 36px 28px; text-align: center; }
        .logo { font-size: 28px; letter-spacing: 5px; color: #C5A880; font-weight: bold; text-transform: uppercase; }
        .subtitle { font-size: 11px; letter-spacing: 2px; color: #888888; text-transform: uppercase; margin-bottom: 24px; }
        .delivered-badge { display: inline-block; background: #820011; color: #FFFFFF; font-size: 13px; font-weight: bold; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; letter-spacing: 1px; }
        .tip-box { background: #1C1C1F; border-left: 3px solid #C5A880; border-radius: 4px; padding: 14px; text-align: left; margin: 20px 0; font-size: 13px; color: #CCCCCC; font-family: sans-serif; line-height: 1.6; }
        .btn-review { display: inline-block; background: #C5A880; color: #141414 !important; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; font-size: 14px; margin-top: 16px; letter-spacing: 1px; font-family: sans-serif; }
        .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #555555; font-family: sans-serif; letter-spacing: 1px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">MURAKKAZ</div>
        <div class="subtitle">House of Rare Scents • Dhaka</div>
        
        <div class="delivered-badge">DELIVERED</div>
        <div style="font-size: 16px; color: #F5F1E8; margin-bottom: 12px;">Dear ${order.fullName},</div>
        <p style="font-size: 13px; line-height: 1.6; color: #AAAAAA; font-family: sans-serif;">
          Your order <strong>#${order.orderNumber}</strong> has been delivered. We hope this exquisite fragrance brings timeless confidence and luxury to your moments.
        </p>
        
        <div class="tip-box">
          <strong style="color: #C5A880;">Atelier Scent Tip:</strong><br>
          Due to transit temperature variations, allow your fragrance to rest in a cool, dark space for 24 hours to achieve optimal maceration, projection, and sillage.
        </div>
        
        <a href="https://murakkaz.com/scent-index" class="btn-review">
          EXPLORE SCENT INDEX →
        </a>
        
        <div class="footer">
          MURAKKAZ FRAGRANCES &copy; 2026. ALL RIGHTS RESERVED.<br>
          BANANI, DHAKA, BANGLADESH
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: order.email, subject, htmlContent });
};
