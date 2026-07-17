import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const mapOrder = (order: any) => ({
  id: order.id,
  user_id: order.userId,
  total: parseFloat(order.total) || 0,
  status: order.status,
  created_at: order.createdAt,
  order_items: (order.items || []).map((item: any) => ({
    id: item.id,
    order_id: item.orderId,
    product_id: item.productId,
    quantity: item.quantity,
    price: parseFloat(item.price) || 0,
    products: {
      name: item.product?.name || '',
      image_url: item.product?.imag_url || ''
    }
  })),
  users: order.user ? {
    name: order.user.name,
    email: order.user.email
  } : null
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('id');

  const include = {
    items: {
      include: {
        product: {
          select: {
            name: true,
            imag_url: true
          }
        }
      }
    },
    user: {
      select: {
        name: true,
        email: true
      }
    }
  };

  try {
    if (orderId) {
      const order = await prisma.orders.findFirst({
        where: {
          id: orderId,
          ...(session.user.role !== 'admin' ? { userId: session.user.id } : {})
        },
        include
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json(mapOrder(order));
    }

    const orders = await prisma.orders.findMany({
      where: session.user.role !== 'admin' ? { userId: session.user.id } : {},
      include,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders.map(mapOrder));
  } catch (err: any) {
    console.error('Fetch orders database error:', err);
    const isProd = process.env.NODE_ENV === 'production';
    return NextResponse.json({
      error: 'Database connection failed',
      details: isProd ? 'Internal Server Error' : (err.message || 'Could not connect to local database.'),
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Wrap the entire stock check, decrement, and order creation in an isolated database transaction
    const order = await prisma.$transaction(async (tx) => {
      let calculatedTotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
          throw new Error('Invalid item parameters supplied');
        }

        // Fetch product inside transaction
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Requested: ${item.quantity}, Available: ${product.stock}`);
        }

        // Decrement product stock atomic to this transaction
        const newStock = product.stock - item.quantity;
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: newStock }
        });

        const itemPrice = parseFloat(product.price.toString());
        calculatedTotal += itemPrice * item.quantity;

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: itemPrice
        });
      }

      // Create Order & Order Items atomically using nested writes
      const newOrder = await tx.orders.create({
        data: {
          userId: session.user.id,
          total: calculatedTotal,
          status: 'pending',
          items: {
            create: orderItemsData
          }
        }
      });

      // Clear User's Cart inside the same transaction
      await tx.cartItems.deleteMany({
        where: { userId: session.user.id }
      });

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err: any) {
    console.error('Create order database error:', err);
    const isProd = process.env.NODE_ENV === 'production';

    if (err.message && (err.message.includes('not found') || err.message.includes('Insufficient stock') || err.message.includes('Invalid item'))) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Database connection failed',
      details: isProd ? 'Internal Server Error' : (err.message || 'Could not connect to local database.'),
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing order ID or status' }, { status: 400 });
    }

    const data = await prisma.orders.update({
      where: { id },
      data: { status: status.toLowerCase() }
    });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Update order error:', err);
    const isProd = process.env.NODE_ENV === 'production';
    return NextResponse.json({ error: isProd ? 'Internal Server Error' : (err.message || 'Internal Server Error') }, { status: 500 });
  }
}

  