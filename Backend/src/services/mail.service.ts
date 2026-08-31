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

  // Always log to console for instant visibility
  console.log(`\n========================================`);
  console.log(`[EMAIL OTP DISPATCHED]`);
  console.log(`To: ${toEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`OTP Code: ${code} (Expires in 5 mins)`);
  console.log(`========================================\n`);

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Murakkaz Fragrances" <${env.SMTP_USER || 'support@murakkaz.com'}>`,
        to: toEmail,
        subject,
        html: htmlContent,
      });
      console.log(`✅ Real email delivered to ${toEmail}`);
      return { delivered: true };
    } catch (mailError) {
      console.error(`⚠️ SMTP delivery failed, but OTP code is logged:`, mailError);
      return { delivered: false, error: mailError };
    }
  }

  return { delivered: false, note: 'SMTP credentials not configured in .env, logged to console' };
};
