import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Save to Supabase
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .insert({ email });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
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