import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, code } = await req.json();

    if (!email || !password || !name || !code) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Verify code by email first to check attempts
    const verificationData = await prisma.twoFactorCodes.findUnique({
      where: { email }
    });

    if (!verificationData) {
      return NextResponse.json({ message: 'Invalid or expired verification code' }, { status: 400 });
    }

    // Check expiry
    if (new Date(verificationData.expiresAt) < new Date()) {
      return NextResponse.json({ message: 'Verification code has expired' }, { status: 400 });
    }

    // Check if code matches
    if (verificationData.code !== code) {
      const newAttempts = verificationData.attempts + 1;
      if (newAttempts >= 5) {
        // Delete code upon 5 failed attempts
        await prisma.twoFactorCodes.delete({
          where: { email }
        });
        return NextResponse.json({ message: 'Too many failed verification attempts. Please request a new code.' }, { status: 400 });
      } else {
        // Increment attempts count
        await prisma.twoFactorCodes.update({
          where: { email },
          data: { attempts: newAttempts }
        });
        return NextResponse.json({ message: `Invalid verification code. ${5 - newAttempts} attempts remaining.` }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const isProd = process.env.NODE_ENV === 'production';

    // Create user
    try {
      const newUser = await prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'user'
        }
      });

      // Delete verification code
      await prisma.twoFactorCodes.deleteMany({
        where: { email }
      });

      return NextResponse.json({ 
        message: 'User created successfully',
        user: { id: newUser.id, email: newUser.email, name: newUser.name }
      }, { status: 201 });
    } catch (createError: any) {
      if (createError.code === 'P2002') {
        return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
      }
      console.error('Create user error:', createError);
      return NextResponse.json({ 
        message: 'Failed to create user', 
        error: isProd ? 'Internal Server Error' : createError.message 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    const isProd = process.env.NODE_ENV === 'production';
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: isProd ? 'Internal Server Error' : (error.message || 'Unknown error')
    }, { status: 500 });
  }
}
