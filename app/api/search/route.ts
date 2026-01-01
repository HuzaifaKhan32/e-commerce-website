import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { validateString } from '@/utils/security';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const limit = searchParams.get('limit') || '20';
  const offset = searchParams.get('offset') || '0';

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  // Validate query parameters
  if (!validateString(query, { min: 1, max: 100 })) {
    return NextResponse.json({ error: 'Invalid search query' }, { status: 400 });
  }

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

  let searchQuery = supabaseAdmin
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('created_at', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (category) {
    searchQuery = searchQuery.ilike('category', `%${category}%`);
  }

  if (minPrice) {
    searchQuery = searchQuery.gte('price', Number(minPrice));
  }

  if (maxPrice) {
    searchQuery = searchQuery.lte('price', Number(maxPrice));
  }

  let data, error;

  try {
    const result = await searchQuery;
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