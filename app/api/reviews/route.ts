import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const userId = searchParams.get('userId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const data = await prisma.review.findMany({
      where: {
        productId,
        status: 'approved',
        ...(userId ? { userId } : {})
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const mapped = data.map((review: any) => ({
      id: review.id,
      product_id: review.productId,
      user_id: review.userId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      status: review.status,
      created_at: review.createdAt,
      users: {
        name: review.user?.name || '',
        email: review.user?.email || ''
      }
    }));

    return NextResponse.json(mapped);
  } catch (err: any) {
    console.error('Database query error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: err.message || 'Could not connect to local PostgreSQL database.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId, rating, title, comment } = await req.json();

  if (!productId || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Valid product ID and rating (1-5) are required' }, { status: 400 });
  }

  try {
    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId: session.user.id
      },
      select: { id: true }
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    // Check if user has purchased the product
    const orderItem = await prisma.orderItems.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id
        }
      }
    });

    if (!orderItem) {
      return NextResponse.json({ error: 'You must purchase this product before reviewing it' }, { status: 400 });
    }

    // Insert the new review (pending approval)
    const data = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating: Number(rating),
        title,
        comment,
        status: 'pending' // Reviews need admin approval
      }
    });

    const mapped = {
      id: data.id,
      product_id: data.productId,
      user_id: data.userId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      status: data.status,
      created_at: data.createdAt
    };

    return NextResponse.json(mapped);
  } catch (err: any) {
    console.error('Database insert error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: err.message || 'Could not connect to database.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const reviewId = searchParams.get('id');
  const { status } = await req.json();

  if (!reviewId || !status) {
    return NextResponse.json({ error: 'Review ID and status are required' }, { status: 400 });
  }

  try {
    const data = await prisma.review.update({
      where: { id: reviewId },
      data: { status }
    });

    const mapped = {
      id: data.id,
      product_id: data.productId,
      user_id: data.userId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      status: data.status,
      created_at: data.createdAt
    };

    return NextResponse.json(mapped);
  } catch (err: any) {
    console.error('Update review error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: err.message || 'Could not connect to database.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const reviewId = searchParams.get('id');

  if (!reviewId) {
    return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
  }

  try {
    await prisma.review.delete({
      where: { id: reviewId }
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete review error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: err.message || 'Could not connect to database.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }
}