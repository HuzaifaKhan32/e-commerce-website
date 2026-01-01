import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const userId = searchParams.get('userId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  let query = supabaseAdmin
    .from('reviews')
    .select('*, users(name, email)') // Include user info
    .eq('product_id', productId)
    .eq('status', 'approved') // Only show approved reviews
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  let data, error;

  try {
    const result = await query;
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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId, rating, title, comment } = await req.json();

  if (!productId || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Valid product ID and rating (1-5) are required' }, { status: 400 });
  }

  // Check if user has already reviewed this product
  let existingReview, existingError;

  try {
    const result = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', session.user.id)
      .single();

    existingReview = result.data;
    existingError = result.error;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: 'Could not connect to the database. Please check your Supabase configuration.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }

  if (existingError) {
    console.error('Supabase error:', existingError);
    return NextResponse.json({
      error: existingError.message,
      details: existingError.details || 'Database error occurred',
      code: existingError.code || 'DATABASE_ERROR'
    }, { status: 500 });
  }

  if (existingReview) {
    return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
  }

  // Check if user has purchased the product
  let orderItems, orderError;

  try {
    const result = await supabaseAdmin
      .from('order_items')
      .select('orders(user_id)')
      .eq('product_id', productId)
      .single();

    orderItems = result.data;
    orderError = result.error;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: 'Could not connect to the database. Please check your Supabase configuration.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }

  if (orderError) {
    console.error('Supabase error:', orderError);
    return NextResponse.json({
      error: orderError.message,
      details: orderError.details || 'Database error occurred',
      code: orderError.code || 'DATABASE_ERROR'
    }, { status: 500 });
  }

  if (!orderItems) {
    return NextResponse.json({ error: 'You must purchase this product before reviewing it' }, { status: 400 });
  }

  // Insert the new review (pending approval)
  let data, error;

  try {
    const result = await supabaseAdmin
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: session.user.id,
        rating,
        title,
        comment,
        status: 'pending' // Reviews need admin approval
      })
      .select()
      .single();

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
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const reviewId = searchParams.get('id');
  const { status } = await req.json();

  if (!reviewId || !status) {
    return NextResponse.json({ error: 'Review ID and status are required' }, { status: 400 });
  }

  let data, error;

  try {
    const result = await supabaseAdmin
      .from('reviews')
      .update({ status })
      .eq('id', reviewId)
      .select()
      .single();

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
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const reviewId = searchParams.get('id');

  if (!reviewId) {
    return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
  }

  try {
    const result = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', reviewId);

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