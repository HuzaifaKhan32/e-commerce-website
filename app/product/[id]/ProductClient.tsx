'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProductDetailPage from '@/components/ProductDetailPage';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const router = useRouter();
  const { 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    isProductInCart,
    addToRecentlyViewed
  } = useStore();

  const navigateToProduct = (p: Product) => {
    addToRecentlyViewed(p.id);
    router.push(`/product/${p.id}`);
  };

  return (
    <ProductDetailPage 
        product={product}
        relatedProducts={relatedProducts}
        onBack={() => router.back()} 
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        onProductClick={navigateToProduct}
        wishlist={wishlist}
        isProductInCart={isProductInCart}
        isWishlisted={wishlist.includes(product.id)}
        isInCart={isProductInCart(product.id)}
    />
  );
}
