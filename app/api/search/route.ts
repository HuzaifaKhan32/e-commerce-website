import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

  const where: any = {
    name: {
      contains: query,
      mode: 'insensitive'
    }
  };

  if (category) {
    where.category = {
      contains: category,
      mode: 'insensitive'
    };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) {
      where.price.gte = Number(minPrice);
    }
    if (maxPrice) {
      where.price.lte = Number(maxPrice);
    }
  }

  try {
    const data = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: Number(limit),
      skip: Number(offset)
    });

    // Map Prisma schema to match client expectations
    const sanitizedData = data.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price) || 0,
      image_url: p.imag_url || '',
      category: p.category,
      description: p.description,
      stock: p.stock,
      rating: parseFloat(p.rating) || 0,
      review_count: p.reviewCount || 0,
      created_at: p.createdAt,
      updated_at: p.updatedAt
    }));

    return NextResponse.json(sanitizedData);
  } catch (err: any) {
    console.error('Database query error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: err.message || 'Could not connect to local PostgreSQL database.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }
}