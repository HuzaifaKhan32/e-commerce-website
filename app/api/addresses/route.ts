
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
    .from('addresses')
    .select('*')
    .eq('user_id', session.user.id)
    .order('is_default', { ascending: false });

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
  const { name, type, street, city, state, postalCode, country, phone, isDefault } = body;

  if (isDefault) {
    // Unset current default
    await supabaseAdmin
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', session.user.id);
  }

  const { data, error } = await supabaseAdmin
    .from('addresses')
    .insert({
      user_id: session.user.id,
      name,
      type,
      street,
      city,
      state,
      postal_code: postalCode,
      country,
      phone,
      is_default: isDefault || false
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
