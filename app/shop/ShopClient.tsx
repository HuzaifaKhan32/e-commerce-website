'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ShopPage from '@/components/ShopPage';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

interface ShopClientProps {
  products: Product[];
}

export default function ShopClient({ products }: ShopClientProps) {
  const router = useRouter();
  const { toggleCart, toggleWishlist, wishlist, isProductInCart, addToRecentlyViewed } = useStore();

  const handleProductClick = (product: Product) => {
    addToRecentlyViewed(product.id);
    router.push(`/product/${product.id}`);
  };

  return (
    <ShopPage 
      products={products}
      onProductClick={handleProductClick} 
      onAddToCart={toggleCart} 
      onToggleWishlist={toggleWishlist} 
      wishlistIds={wishlist} 
      isProductInCart={isProductInCart} 
    />
  );
}
