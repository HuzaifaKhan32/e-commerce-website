import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateString } from '@/utils/security';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await prisma.whislistItems.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        productId: true
      }
    });

    return NextResponse.json(data.map((item: any) => item.productId));
  } catch (err: any) {
    console.error('Fetch wishlist error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: err.message || 'Could not connect to the database.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({
      error: 'Please sign in to add products to your wishlist',
      code: 'UNAUTHORIZED'
    }, { status: 401 });
  }

  const body = await req.json();
  const { productId } = body;

  // Input validation
  if (!productId || typeof productId !== 'string' || !validateString(productId, { max: 50 })) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if already exists to avoid duplicates
    const existing = await prisma.whislistItems.findFirst({
      where: {
        userId: session.user.id,
        productId: productId
      }
    });

    if (existing) {
      return NextResponse.json({ message: 'Already in wishlist' });
    }

    await prisma.whislistItems.create({
      data: {
        userId: session.user.id,
        productId: productId
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Add to wishlist error:', err);

    // Handle foreign key constraint error (user doesn't exist in database)
    if (err.code === 'P2003' && err.meta?.field_name === 'WhislistItems_user_id_fkey') {
      return NextResponse.json({
        error: 'Please log out and log back in to continue',
        code: 'SESSION_EXPIRED'
      }, { status: 401 });
    }

    return NextResponse.json({
      error: 'Failed to add to wishlist',
      details: err.message || 'Could not add to wishlist.',
      code: 'WISHLIST_ERROR'
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

  // Input validation
  if (typeof productId !== 'string' || !validateString(productId, { max: 50 })) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.whislistItems.deleteMany({
      where: {
        userId: session.user.id,
        productId: productId
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete from wishlist error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: err.message || 'Could not connect to the database.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }
}
