
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateString } from '@/utils/security';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let data, error;

  try {
    const result = await supabaseAdmin
      .from('wishlist_items')
      .select('product_id')
      .eq('user_id', session.user.id);

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

  if (!data) {
    return NextResponse.json([]);
  }

  return NextResponse.json(data.map((item: any) => item.product_id));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { productId } = body;

  // Input validation
  if (!productId || typeof productId !== 'string' || !validateString(productId, { max: 50 })) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  // Check if product exists
  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('id', productId)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // Check if already exists to avoid duplicates (though DB constraint might handle it)
  const { data: existing } = await supabaseAdmin
    .from('wishlist_items')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('product_id', productId)
    .single();

  if (existing) {
    return NextResponse.json({ message: 'Already in wishlist' });
  }

  try {
    const result = await supabaseAdmin
      .from('wishlist_items')
      .insert({ user_id: session.user.id, product_id: productId });

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

  // Check if product exists
  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('id', productId)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  try {
    const result = await supabaseAdmin
      .from('wishlist_items')
      .delete()
      .eq('user_id', session.user.id)
      .eq('product_id', productId);

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
