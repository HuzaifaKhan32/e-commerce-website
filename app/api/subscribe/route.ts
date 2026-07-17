import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Save to database
    try {
      await prisma.subscriptions.create({
        data: { email }
      });
    } catch (error: any) {
      if (error.code === 'P2002') { // Unique constraint violation
        return NextResponse.json({ 
          message: 'You are already subscribed to our newsletter!' 
        });
      }
      throw error;
    }
    
    return NextResponse.json({ 
      message: 'Thank you for subscribing to our newsletter!' 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}