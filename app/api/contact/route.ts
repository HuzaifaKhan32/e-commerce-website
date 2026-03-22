import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // In a real application, you would send an email or save to DB
    console.log(`New contact message from ${name} (${email}): ${subject} - ${message}`);
    
    // You could use Resend or Nodemailer here
    
    return NextResponse.json({ 
      message: 'Thank you for your message! We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
