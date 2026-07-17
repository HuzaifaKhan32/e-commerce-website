import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

  const where: any = {};
  
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
    console.error('Database connection error:', err);
    return NextResponse.json({
      error: 'Database connection failed',
      details: err.message || 'Could not connect to local PostgreSQL database.',
      code: 'CONNECTION_ERROR'
    }, { status: 500 });
  }
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

  try {
    const data = await prisma.product.create({
      data: {
        name: sanitizedBody.name,
        price: sanitizedBody.price,
        imag_url: sanitizedBody.image_url,
        category: sanitizedBody.category,
        description: sanitizedBody.description,
        stock: sanitizedBody.stock,
        rating: sanitizedBody.rating !== undefined ? Number(sanitizedBody.rating) : 5.0,
        reviewCount: sanitizedBody.review_count !== undefined ? Number(sanitizedBody.review_count) : 0
      }
    });

    const sanitizedProduct = {
      id: data.id,
      name: data.name,
      price: parseFloat(data.price as any) || 0,
      image_url: data.imag_url || '',
      category: data.category,
      description: data.description,
      stock: data.stock,
      rating: parseFloat(data.rating as any) || 0,
      review_count: data.reviewCount || 0,
      created_at: data.createdAt,
      updated_at: data.updatedAt
    };

    return NextResponse.json([sanitizedProduct]);
  } catch (err: any) {
    console.error('Database create error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
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

    try {
      const data = await prisma.product.update({
        where: { id },
        data: {
          name: sanitizedUpdates.name,
          price: sanitizedUpdates.price,
          imag_url: sanitizedUpdates.image_url,
          category: sanitizedUpdates.category,
          description: sanitizedUpdates.description,
          stock: sanitizedUpdates.stock,
          rating: sanitizedUpdates.rating !== undefined ? Number(sanitizedUpdates.rating) : undefined,
          reviewCount: sanitizedUpdates.review_count !== undefined ? Number(sanitizedUpdates.review_count) : undefined
        }
      });

      const sanitizedProduct = {
        id: data.id,
        name: data.name,
        price: parseFloat(data.price as any) || 0,
        image_url: data.imag_url || '',
        category: data.category,
        description: data.description,
        stock: data.stock,
        rating: parseFloat(data.rating as any) || 0,
        review_count: data.reviewCount || 0,
        created_at: data.createdAt,
        updated_at: data.updatedAt
      };

      return NextResponse.json([sanitizedProduct]);
    } catch (err: any) {
      console.error('Database update error:', err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
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

    try {
      await prisma.product.delete({
        where: { id }
      });
      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.error('Database delete error:', err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
}