
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
    .from('wishlist_items')
    .select('product_id')
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map((item: any) => item.product_id));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId } = await req.json();

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

  const { error } = await supabaseAdmin
    .from('wishlist_items')
    .insert({ user_id: session.user.id, product_id: productId });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

  const { error } = await supabaseAdmin
    .from('wishlist_items')
    .delete()
    .eq('user_id', session.user.id)
    .eq('product_id', productId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
