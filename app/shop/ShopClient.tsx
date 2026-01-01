'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShopPage from '@/components/ShopPage';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';
import { FiLoader } from 'react-icons/fi';

export default function ShopClient() {
  const router = useRouter();
  const { toggleCart, toggleWishlist, wishlist, isProductInCart, addToRecentlyViewed } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`${response.status}: ${errorData.error || 'Failed to fetch products'}`);
        }
        const data = await response.json();
        
        const mappedProducts: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          rating: p.rating || 5,
          reviewCount: p.review_count || 0,
          imageUrl: p.image_url || '',
          category: p.category || 'Leather Goods',
          description: p.description || ''
        }));
        
        setProducts(mappedProducts);

        // Log if no products found
        if (data.length === 0) {
          console.warn('No products found in database.');
        }
      } catch (err: any) {
        console.error('Detailed error fetching products:', err);
        setError(`Error fetching products: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    addToRecentlyViewed(product.id);
    router.push(`/product/${product.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <FiLoader className="animate-spin text-6xl text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary mb-4">Error Loading Products</h2>
          <p className="text-grey mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-secondary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary transition-all shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
