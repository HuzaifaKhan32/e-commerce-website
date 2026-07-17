import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductClient from './ProductClient';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the specific product along with its images using Prisma relations
  const productData = await prisma.product.findUnique({
    where: { id },
    include: {
      productImages: {
        orderBy: {
          sortOrder: 'asc'
        }
      }
    }
  });

  if (!productData) {
    return <div className="text-center py-20">Product not found</div>;
  }

  const productImages: ProductImage[] = (productData.productImages || []).map((img: any) => ({
    id: img.id,
    image_url: img.imageUrl,
    alt_text: img.altText,
    sort_order: img.sortOrder
  }));

  const product: Product = {
    id: productData.id,
    name: productData.name,
    price: parseFloat(productData.price as any) || 0,
    category: productData.category,
    imageUrl: productImages.length > 0 ? productImages[0].image_url : (productData.imag_url || ''),
    rating: parseFloat(productData.rating as any) || 5,
    reviewCount: productData.reviewCount || 0,
    description: productData.description ?? undefined
  };

  // Fetch related products (e.g., same category, excluding current)
  // Limited to 4 for the UI
  const relatedData = await prisma.product.findMany({
    where: {
      category: product.category,
      NOT: { id }
    },
    take: 4
  });

  // Fallback if not enough related items in category, just get any other items
  let finalRelated = relatedData || [];

  if (finalRelated.length < 4) {
      const existingIds = new Set(finalRelated.map((p) => p.id));
      existingIds.add(id);

      const fallbackData = await prisma.product.findMany({
        where: {
          NOT: {
            id: {
              in: Array.from(existingIds)
            }
          }
        },
        take: 4 - finalRelated.length
      });

      finalRelated = [...finalRelated, ...fallbackData];
  }

  const relatedProducts: Product[] = finalRelated.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: parseFloat(p.price) || 0,
    category: p.category,
    imageUrl: p.imag_url || '',
    rating: parseFloat(p.rating) || 5,
    reviewCount: p.reviewCount || 0,
  }));

  return (
    <ProductClient
      product={product}
      relatedProducts={relatedProducts}
      productImages={productImages}
    />
  );
}