
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin.from('users').select('id, name, email, role, image, emailVerified');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, password } = body;

    if (session.user.role !== 'admin' && session.user.id !== id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (password) {
        updates.password = await bcrypt.hash(password, 10);
    }

    const { data, error } = await supabaseAdmin.from('users').update(updates).eq('id', id).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    return NextResponse.json(data);
}
