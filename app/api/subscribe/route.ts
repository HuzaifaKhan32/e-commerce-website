import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // In a real application, you would save this to a database or email service
    // For now, we'll just log it and return success
    console.log(`New subscription: ${email}`);
    
    // You could integrate with services like Mailchimp, SendGrid, etc. here
    
    return NextResponse.json({ 
      message: 'Thank you for subscribing to our newsletter!' 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}