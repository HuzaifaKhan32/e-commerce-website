
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

  const { data, error } = await supabaseAdmin
    .from('cart_items')
    .insert({
      user_id: session.user.id,
      product_id: productId,
      quantity,
      color
    })
    .select('*, products(*)');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
  
    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select('*, products(*)');
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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

    const { error } = await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
