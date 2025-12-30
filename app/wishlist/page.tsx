'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import WishlistPage from '@/components/WishlistPage';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

export default function Page() {
  const router = useRouter();
  const { toggleCart, toggleWishlist, wishlist, isProductInCart, addToRecentlyViewed } = useStore();

  const handleProductClick = (product: Product) => {
    addToRecentlyViewed(product.id);
    router.push(`/product/${product.id}`);
  };

  return (
    <WishlistPage 
       onProductClick={handleProductClick}
       onAddToCart={toggleCart}
       onToggleWishlist={toggleWishlist}
       onContinueShopping={() => router.push('/shop')}
       onClearAll={() => {
         // Clear all wishlist items one by one if no bulk clear exists
         wishlist.forEach(id => toggleWishlist(id));
       }}
       wishlistIds={wishlist}
       isProductInCart={isProductInCart}
    />
  );
}
