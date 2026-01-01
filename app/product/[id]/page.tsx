import React from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import ProductClient from './ProductClient';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the specific product
  const { data: productData, error: productError } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (productError || !productData) {
    return <div className="text-center py-20">Product not found</div>;
  }

  const product: Product = {
    id: productData.id,
    name: productData.name,
    price: parseFloat(productData.price) || 0,
    category: productData.category,
    imageUrl: productData.image_url || '',
    rating: parseFloat(productData.rating) || 5,
    reviewCount: parseInt(productData.review_count) || 0,
    description: productData.description
  };

  // Fetch related products (e.g., same category, excluding current)
  // Limited to 4 for the UI
  const { data: relatedData } = await supabaseAdmin
    .from('products')
    .select('*')
    .neq('id', id)
    .eq('category', product.category)
    .limit(4);
    
  // Fallback if not enough related items in category, just get any other items
  let finalRelated = relatedData || [];
  
  if (finalRelated.length < 4) {
      const existingIds = new Set(finalRelated.map((p: any) => p.id));
      existingIds.add(id);

      const { data: fallbackData } = await supabaseAdmin
        .from('products')
        .select('*')
        .neq('id', id)
        .limit(10); // Fetch a bit more to ensure we find unique ones
      
      if (fallbackData) {
          const uniqueFallback = fallbackData.filter((p: any) => !existingIds.has(p.id));
          finalRelated = [...finalRelated, ...uniqueFallback].slice(0, 4);
      }
  }

  const relatedProducts: Product[] = finalRelated.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: parseFloat(p.price) || 0,
    category: p.category,
    imageUrl: p.image_url || '',
    rating: parseFloat(p.rating) || 5,
    reviewCount: parseInt(p.review_count) || 0,
  }));

  return (
    <ProductClient product={product} relatedProducts={relatedProducts} />
  );
}