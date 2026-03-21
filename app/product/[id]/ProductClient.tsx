'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProductDetailPage from '@/components/ProductDetailPage';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
  productImages: ProductImage[];
}

export default function ProductClient({ product, relatedProducts, productImages }: ProductClientProps) {
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
        productImages={productImages}
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
