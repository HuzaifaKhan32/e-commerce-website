
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  // Check if product exists and get its stock
  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .select('stock')
    .eq('id', productId)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  if (product.stock < quantity) {
    return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
  }

  let data, error;

  try {
    const result = await supabaseAdmin
      .from('cart_items')
      .insert({
        user_id: session.user.id,
        product_id: productId,
        quantity,
        color
      })
      .select('*, products(*)');

    data = result.data;
    error = result.error;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: 'Could not connect to the database. Please check your Supabase configuration.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({
      error: error.message,
      details: error.details || 'Database error occurred',
      code: error.code || 'DATABASE_ERROR'
    }, { status: 500 });
  }

  return NextResponse.json(data);
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

    // Check if cart item belongs to user and get product info
    const { data: cartItem, error: cartItemError } = await supabaseAdmin
      .from('cart_items')
      .select('product_id, products(stock)')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (cartItemError || !cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Handle potential array response from Supabase join
    const products = Array.isArray(cartItem.products) ? cartItem.products[0] : cartItem.products;
    const stock = products?.stock ?? 0;

    // Check if sufficient stock is available
    if (stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    let data, error;

    try {
      const result = await supabaseAdmin
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select('*, products(*)');

      data = result.data;
      error = result.error;
    } catch (err) {
      console.error('Supabase connection error:', err);
      return NextResponse.json({
        error: 'Database connection failed',
        details: 'Could not connect to the database. Please check your Supabase configuration.',
        code: 'CONNECTION_ERROR'
      }, { status: 500 });
    }

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        error: error.message,
        details: error.details || 'Database error occurred',
        code: error.code || 'DATABASE_ERROR'
      }, { status: 500 });
    }

    return NextResponse.json(data);
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
      const result = await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (result.error) {
        console.error('Supabase error:', result.error);
        return NextResponse.json({
          error: result.error.message,
          details: result.error.details || 'Database error occurred',
          code: result.error.code || 'DATABASE_ERROR'
        }, { status: 500 });
      }
    } catch (err) {
      console.error('Supabase connection error:', err);
      return NextResponse.json({
        error: 'Database connection failed',
        details: 'Could not connect to the database. Please check your Supabase configuration.',
        code: 'CONNECTION_ERROR'
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
