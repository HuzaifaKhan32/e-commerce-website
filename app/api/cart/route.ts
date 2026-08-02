import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await prisma.cartItems.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: true
      }
    });

    const mapped = data.map((item: any) => ({
      id: item.id,
      user_id: item.userId,
      product_id: item.productId,
      quantity: item.quantity,
      color: item.color,
      created_at: item.createdAt,
      products: {
        id: item.product.id,
        name: item.product.name,
        price: parseFloat(item.product.price) || 0,
        image_url: item.product.imag_url || ''
      }
    }));

    return NextResponse.json(mapped);
  } catch (err: any) {
    console.error('Fetch cart error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  console.log('=== CART POST DEBUG ===');
  console.log('Session exists:', !!session);
  console.log('Session user:', JSON.stringify(session?.user, null, 2));

  if (!session?.user?.id) {
    return NextResponse.json({
      error: 'Please sign in to add products to your cart',
      code: 'UNAUTHORIZED'
    }, { status: 401 });
  }

  console.log('User ID from session:', session.user.id);

  // Check if user actually exists in database
  try {
    const userCheck = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true }
    });
    console.log('User exists in DB:', !!userCheck);
    console.log('User from DB:', JSON.stringify(userCheck, null, 2));
  } catch (err) {
    console.error('Error checking user:', err);
  }

  const body = await req.json();
  const { productId, quantity, color } = body;

  // Input validation
  if (!productId || typeof productId !== 'string' || productId.length > 50) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  if (!quantity || typeof quantity !== 'number' || quantity <= 0 || quantity > 100) {
    return NextResponse.json({ error: 'Quantity must be between 1 and 100' }, { status: 400 });
  }

  if (!color || typeof color !== 'string' || color.length > 50) {
    return NextResponse.json({ error: 'Invalid color' }, { status: 400 });
  }

  try {
    // Check if product exists and get its stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItems.findFirst({
      where: {
        userId: session.user.id,
        productId,
        color
      }
    });

    if (existingItem) {
      // Update quantity instead of creating duplicate
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return NextResponse.json({ error: 'Insufficient stock for combined quantity' }, { status: 400 });
      }

      const data = await prisma.cartItems.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true }
      });

      const mapped = {
        id: data.id,
        user_id: data.userId,
        product_id: data.productId,
        quantity: data.quantity,
        color: data.color,
        created_at: data.createdAt,
        products: {
          id: data.product.id,
          name: data.product.name,
          price: parseFloat(data.product.price as any) || 0,
          image_url: data.product.imag_url || ''
        }
      };

      return NextResponse.json([mapped]);
    }

    const data = await prisma.cartItems.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
        color
      },
      include: {
        product: true
      }
    });

    const mapped = {
      id: data.id,
      user_id: data.userId,
      product_id: data.productId,
      quantity: data.quantity,
      color: data.color,
      created_at: data.createdAt,
      products: {
        id: data.product.id,
        name: data.product.name,
        price: parseFloat(data.product.price as any) || 0,
        image_url: data.product.imag_url || ''
      }
    };

    return NextResponse.json([mapped]);
  } catch (err: any) {
    console.error('Add to cart error:', err);
    console.error('Error code:', err.code);
    console.error('Error meta:', JSON.stringify(err.meta, null, 2));
    console.error('Error name:', err.name);
    console.error('Error constructor:', err.constructor.name);

    // Handle foreign key constraint error (user doesn't exist in database)
    if (err.code === 'P2003') {
      console.log('Detected P2003 foreign key error');
      return NextResponse.json({
        error: 'Please log out and log back in to continue',
        code: 'SESSION_EXPIRED'
      }, { status: 401 });
    }

    return NextResponse.json({
      error: 'Failed to add item to cart',
      details: err.message || 'Could not add to cart.',
      code: 'CART_ERROR'
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, quantity } = body;

    // Input validation
    if (!id || typeof id !== 'string' || id.length > 50) {
      return NextResponse.json({ error: 'Invalid cart item ID' }, { status: 400 });
    }

    if (!quantity || typeof quantity !== 'number' || quantity <= 0 || quantity > 100) {
      return NextResponse.json({ error: 'Quantity must be between 1 and 100' }, { status: 400 });
    }

    try {
      // Check if cart item belongs to user and get product info
      const cartItem = await prisma.cartItems.findFirst({
        where: {
          id,
          userId: session.user.id
        },
        include: {
          product: {
            select: { stock: true }
          }
        }
      });

      if (!cartItem) {
        return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
      }

      const stock = cartItem.product?.stock ?? 0;

      // Check if sufficient stock is available
      if (stock < quantity) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
      }

      const data = await prisma.cartItems.update({
        where: { id },
        data: { quantity },
        include: {
          product: true
        }
      });

      const mapped = {
        id: data.id,
        user_id: data.userId,
        product_id: data.productId,
        quantity: data.quantity,
        color: data.color,
        created_at: data.createdAt,
        products: {
          id: data.product.id,
          name: data.product.name,
          price: parseFloat(data.product.price as any) || 0,
          image_url: data.product.imag_url || ''
        }
      };

      return NextResponse.json([mapped]);
    } catch (err: any) {
      console.error('Update cart error:', err);
      return NextResponse.json({
        error: 'Database connection failed',
        details: err.message || 'Could not connect to the database.',
        code: 'CONNECTION_ERROR'
      }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    try {
      await prisma.cartItems.deleteMany({
        where: {
          id,
          userId: session.user.id
        }
      });
      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.error('Delete cart item error:', err);
      return NextResponse.json({
        error: 'Database connection failed',
        details: err.message || 'Could not connect to the database.',
        code: 'CONNECTION_ERROR'
      }, { status: 500 });
    }
}
