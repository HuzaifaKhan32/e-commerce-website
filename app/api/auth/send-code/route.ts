import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
      select: { id: true }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already registered. Please sign in.' }, { status: 400 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store in Prisma
    try {
      await prisma.twoFactorCodes.upsert({
        where: { email },
        update: {
          code,
          expiresAt
        },
        create: {
          email,
          code,
          expiresAt
        }
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json({
        message: 'Failed to store verification code',
        error: dbError.message
      }, { status: 500 });
    }

    // ==========================================
    // GMAIL SMTP IMPLEMENTATION
    // ==========================================

    try {
      // Create Gmail transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Luxe Leather" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code - Luxe Leather',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .code-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #667eea; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔐 Verification Code</h1>
                </div>
                <div class="content">
                  <p>Hello ${name || 'there'},</p>
                  <p>Your verification code for <strong>Luxe Leather</strong> is:</p>
                  <div class="code-box">
                    <div class="code">${code}</div>
                  </div>
                  <p>This code will expire in <strong>10 minutes</strong>.</p>
                  <p>If you didn\'t request this code, please ignore this email.</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Luxe Leather. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      return NextResponse.json({ message: 'Verification code sent' }, { status: 200 });

    } catch (emailError: any) {
      // Log error without exposing sensitive data
      console.error('Email sending failed:', emailError.message);

      return NextResponse.json({
        message: 'Failed to send verification email. Please try again.',
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
}