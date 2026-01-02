import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateString, sanitizeInput } from '@/utils/security';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const limit = searchParams.get('limit') || '20';
  const offset = searchParams.get('offset') || '0';

  // Validate query parameters
  if (category && !validateString(category, { max: 50 })) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  if (minPrice && (isNaN(Number(minPrice)) || Number(minPrice) < 0)) {
    return NextResponse.json({ error: 'Invalid minimum price' }, { status: 400 });
  }

  if (maxPrice && (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)) {
    return NextResponse.json({ error: 'Invalid maximum price' }, { status: 400 });
  }

  if (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100) {
    return NextResponse.json({ error: 'Invalid limit. Must be between 1 and 100' }, { status: 400 });
  }

  if (isNaN(Number(offset)) || Number(offset) < 0) {
    return NextResponse.json({ error: 'Invalid offset' }, { status: 400 });
  }

  let query = supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (category) {
    query = query.ilike('category', `%${category}%`);
  }

  if (minPrice) {
    query = query.gte('price', Number(minPrice));
  }

  if (maxPrice) {
    query = query.lte('price', Number(maxPrice));
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

  // Map to ensure numbers are correctly typed (Supabase might return strings for numeric types)
  const sanitizedData = (data || []).map((p: any) => ({
    ...p,
    price: parseFloat(p.price) || 0,
    rating: parseFloat(p.rating) || 0,
    review_count: parseInt(p.review_count) || 0,
    stock: parseInt(p.stock) || 0
  }));

  // Return empty array if no products found
  return NextResponse.json(sanitizedData);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // Validate input
  if (!body.name || !validateString(body.name, { min: 1, max: 200 })) {
    return NextResponse.json({ error: 'Product name is required and must be 1-200 characters' }, { status: 400 });
  }

  if (typeof body.price !== 'number' || body.price <= 0) {
    return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
  }

  if (typeof body.stock !== 'number' || body.stock < 0) {
    return NextResponse.json({ error: 'Stock must be a non-negative number' }, { status: 400 });
  }

  if (!body.category || !validateString(body.category, { min: 1, max: 50 })) {
    return NextResponse.json({ error: 'Category is required and must be 1-50 characters' }, { status: 400 });
  }

  // Sanitize inputs
  const sanitizedBody = {
    ...body,
    name: sanitizeInput(body.name),
    description: body.description ? sanitizeInput(body.description) : null,
    category: sanitizeInput(body.category),
    image_url: body.image_url // Do not escape URL
  };

  const { data, error } = await supabaseAdmin.from('products').insert(sanitizedBody).select();

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

    // Validate ID
    if (!id || typeof id !== 'string' || !validateString(id, { max: 50 })) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Validate updates
    if (updates.name && (!validateString(updates.name, { min: 1, max: 200 })) ) {
      return NextResponse.json({ error: 'Product name must be 1-200 characters' }, { status: 400 });
    }

    if (updates.price && (typeof updates.price !== 'number' || updates.price <= 0)) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
    }

    if (updates.stock && (typeof updates.stock !== 'number' || updates.stock < 0)) {
      return NextResponse.json({ error: 'Stock must be a non-negative number' }, { status: 400 });
    }

    if (updates.category && (!validateString(updates.category, { min: 1, max: 50 }))) {
      return NextResponse.json({ error: 'Category must be 1-50 characters' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedUpdates = {
      ...updates,
      name: updates.name ? sanitizeInput(updates.name) : undefined,
      description: updates.description ? sanitizeInput(updates.description) : undefined,
      category: updates.category ? sanitizeInput(updates.category) : undefined,
      image_url: updates.image_url // Do not escape URL
    };

    const { data, error } = await supabaseAdmin.from('products').update(sanitizedUpdates).eq('id', id).select();

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

    // Validate ID
    if (typeof id !== 'string' || !validateString(id, { max: 50 })) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}