import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch orders with items and user details
  let query = supabaseAdmin
    .from('orders')
    .select('*, order_items(*, products(name, image_url)), users(name, email)')
    .order('created_at', { ascending: false });

  if (session.user.role !== 'admin') {
      query = query.eq('user_id', session.user.id);
  }

  const { data, error } = await query;
  
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

  const { items, total } = await req.json();

  // 1. Create Order
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: session.user.id,
      total: total,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  // 2. Create Order Items
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems);

  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  // 3. Clear Cart (Backend side)
  await supabaseAdmin
    .from('cart_items')
    .delete()
    .eq('user_id', session.user.id);

  return NextResponse.json({ success: true, orderId: order.id });
}