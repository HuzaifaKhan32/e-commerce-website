import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('id');

  // Fetch orders with items and user details
  let query = supabaseAdmin
    .from('orders')
    .select('*, order_items(*, products(name, image_url)), users(name, email)')
    .order('created_at', { ascending: false });

  if (orderId) {
    query = query.eq('id', orderId);
  }

  if (session.user.role !== 'admin') {
      query = query.eq('user_id', session.user.id);
  }

  if (orderId) {
    const { data, error } = await query.single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
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

  const { items, total } = await req.json();

  // 1. Verify inventory for each item
  for (const item of items) {
    let product, productError;

    try {
      const result = await supabaseAdmin
        .from('products')
        .select('stock')
        .eq('id', item.productId)
        .single();

      product = result.data;
      productError = result.error;
    } catch (err) {
      console.error('Supabase connection error:', err);
      return NextResponse.json({
        error: 'Database connection failed',
        details: 'Could not connect to the database. Please check your Supabase configuration.',
        code: 'CONNECTION_ERROR'
      }, { status: 500 });
    }

    if (productError || !product) {
      return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 });
    }

    if (product.stock < item.quantity) {
      return NextResponse.json({
        error: `Insufficient stock for ${item.name}. Requested: ${item.quantity}, Available: ${product.stock}`
      }, { status: 400 });
    }
  }

  // 2. Create Order
  let order, orderError;

  try {
    const result = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: session.user.id,
        total: total,
        status: 'pending'
      })
      .select()
      .single();

    order = result.data;
    orderError = result.error;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: 'Could not connect to the database. Please check your Supabase configuration.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  // 3. Create Order Items
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price
  }));

  let itemsError;

  try {
    const result = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    itemsError = result.error;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: 'Could not connect to the database. Please check your Supabase configuration.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }

  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  // 4. Update inventory (decrease stock for each ordered item)
  for (const item of items) {
    try {
      // Fetch current stock first to decrement safely
      const { data: currentProduct } = await supabaseAdmin
        .from('products')
        .select('stock')
        .eq('id', item.productId)
        .single();
      
      if (currentProduct) {
        const newStock = Math.max(0, currentProduct.stock - item.quantity);
        await supabaseAdmin
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.productId);
      }
    } catch (err) {
      console.error(`Supabase connection error when updating stock for product ${item.productId}:`, err);
    }
  }

  // 5. Clear Cart (Backend side)
  try {
    await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('user_id', session.user.id);
  } catch (err) {
    console.error('Supabase connection error when clearing cart:', err);
    // Continue processing but log the error
  }

    return NextResponse.json({ success: true, orderId: order.id });

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

  

      const { data, error } = await supabaseAdmin

        .from('orders')

        .update({ status: status.toLowerCase() })

        .eq('id', id)

        .select()

        .single();

  

      if (error) {

        return NextResponse.json({ error: error.message }, { status: 500 });

      }

  

      return NextResponse.json(data);

    } catch (err) {

      console.error('Update order error:', err);

      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    }

  }

  