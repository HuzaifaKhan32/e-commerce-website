import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const { data, error } = await supabaseAdmin.from('products').select('*').order('created_at', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from('products').insert(body).select();
  
  if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { id, ...updates } = body;
    
    const { data, error } = await supabaseAdmin.from('products').update(updates).eq('id', id).select();
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
}