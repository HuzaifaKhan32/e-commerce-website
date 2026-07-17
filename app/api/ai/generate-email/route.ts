import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateEmailContent } from '@/services/emailService';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, data } = body;

    if (!type || (type !== 'order' && type !== 'shipping')) {
      return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Missing email context data' }, { status: 400 });
    }

    const emailContent = await generateEmailContent(type, data);
    return NextResponse.json(emailContent);
  } catch (err: any) {
    console.error('Email generation API error:', err);
    const isProd = process.env.NODE_ENV === 'production';
    return NextResponse.json({
      error: 'Failed to generate email content',
      details: isProd ? 'Internal Server Error' : err.message
    }, { status: 500 });
  }
}
