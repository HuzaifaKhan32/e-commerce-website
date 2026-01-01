
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store in Supabase
    const { error: dbError } = await supabaseAdmin
      .from('two_factor_codes')
      .upsert([
        { 
          email, 
          code, 
          expires_at: expiresAt.toISOString() 
        }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ message: 'Failed to store verification code' }, { status: 500 });
    }

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'Luxe Leather <onboarding@resend.dev>',
      to: email,
      subject: 'Your Verification Code - Luxe Leather',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e0d8; border-radius: 8px;">
          <h2 style="color: #3E2723; text-align: center;">Welcome to Luxe Leather</h2>
          <p style="color: #4A4A4A; font-size: 16px; line-height: 1.5;">Hello ${name || 'there'},</p>
          <p style="color: #4A4A4A; font-size: 16px; line-height: 1.5;">Thank you for joining Luxe Leather. Please use the following verification code to complete your registration:</p>
          <div style="background-color: #FAF7F2; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <h1 style="color: #1754cf; font-size: 48px; letter-spacing: 10px; margin: 0;">${code}</h1>
          </div>
          <p style="color: #4A4A4A; font-size: 14px; line-height: 1.5;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e5e0d8; margin: 30px 0;" />
          <p style="color: #D4C5B9; font-size: 12px; text-align: center;">&copy; 2026 Luxe Leather. All rights reserved.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Email error:', emailError);
      return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Verification code sent' }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
