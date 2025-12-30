'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { FiSearch } from 'react-icons/fi';
import { Product } from '@/types';

export default function Page() {
  const router = useRouter();
  const { 
    searchQuery, 
    getSearchResults, 
    toggleCart, 
    toggleWishlist, 
    wishlist, 
    isProductInCart,
    addToRecentlyViewed
  } = useStore();

  const results = getSearchResults();

  const navigateToProduct = (product: Product) => {
    addToRecentlyViewed(product.id);
    router.push(`/product/${product.id}`);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[60vh]">
      <div className="mb-16">
        <p className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-3">Search Results</p>
        <h2 className="text-secondary font-serif text-4xl font-bold tracking-tight">
          {results.length} matches for "{searchQuery}"
        </h2>
        <div className="h-1.5 w-24 bg-primary mt-6 rounded-full"></div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {results.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => navigateToProduct(product)}
              onAddToCart={() => toggleCart(product)}
              onToggleWishlist={() => toggleWishlist(product.id)}
              isWishlisted={wishlist.includes(product.id)}
              isInCart={isProductInCart(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-ivory/30 rounded-3xl border border-taupe/10">
          <FiSearch className="text-6xl text-taupe/40 mx-auto mb-6" />
          <h3 className="text-2xl font-serif font-bold text-secondary mb-4">No matching heritage found</h3>
          <p className="text-grey mb-10 max-w-sm mx-auto font-light">We couldn't find any artisanal goods matching your criteria. Try adjusting your search term.</p>
          <button 
            onClick={() => router.push('/shop')}
            className="bg-secondary text-white px-10 py-4 rounded-lg font-bold hover:bg-primary transition-all shadow-lg uppercase tracking-widest text-xs"
          >
            Browse Full Shop
          </button>
        </div>
      )}
    </section>
  );
}
