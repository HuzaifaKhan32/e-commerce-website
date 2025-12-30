import React from 'react';
import ShopClient from './ShopClient';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    // You might want to handle error UI here, or just pass empty array
  }

  // Map Supabase data to Product type
  // Assuming DB has image_url, and we need imageUrl
  const mappedProducts: Product[] = (products || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    imageUrl: p.image_url || p.imageUrl || '', // Handle snake_case or camelCase
    rating: p.rating || 5, // Default or DB value
    reviewCount: p.review_count || 10, // Default or DB value
    description: p.description
  }));

  return (
    <ShopClient products={mappedProducts} />
  );
}