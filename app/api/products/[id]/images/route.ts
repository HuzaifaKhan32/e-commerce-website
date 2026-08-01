import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== 'string') {
    return NextResponse.json(
      { error: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {
    const images = await prisma.productImage.findMany({
      where: {
        productId: id
      },
      orderBy: {
        sortOrder: 'asc'
      },
      select: {
        id: true,
        imageUrl: true,
        altText: true,
        sortOrder: true
      }
    });

    // Map to match frontend interface
    const formattedImages = images.map(img => ({
      id: img.id,
      image_url: img.imageUrl,
      alt_text: img.altText,
      sort_order: img.sortOrder
    }));

    return NextResponse.json(formattedImages);
  } catch (error: any) {
    console.error('Failed to fetch product images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product images', details: error.message },
      { status: 500 }
    );
  }
}
