'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import CollectionCard from '@/components/CollectionCard';
import { FEATURED_PRODUCTS, BEST_SELLERS, COLLECTIONS } from '@/constants';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';
import { FiArrowRight, FiRotateCcw } from 'react-icons/fi';

export default function HomePage() {
  const router = useRouter();
  const { 
    toggleCart, 
    toggleWishlist, 
    wishlist, 
    isProductInCart, 
    recentlyViewed, 
    clearRecentlyViewed,
    getRecentlyViewedProducts,
    addToRecentlyViewed
  } = useStore();

  const navigateToProduct = (product: Product) => {
    addToRecentlyViewed(product.id);
    router.push(`/product/${product.id}`);
  };

  return (
    <>
      <Hero />
      
      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-secondary font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Featured Products</h2>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-grey/70 max-w-2xl mx-auto font-light leading-relaxed">
            Explore our hand-picked selection of most sought-after leather goods, each telling its own story of craftsmanship.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {FEATURED_PRODUCTS.map((product) => (
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
      </section>

      {/* Our Collections */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-secondary font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Our Collections</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COLLECTIONS.map((collection, index) => (
              <CollectionCard 
                key={collection.id} 
                collection={collection} 
                span={index === 2 ? "md:col-span-2 lg:col-span-1" : ""}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-secondary font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Best Sellers</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto md:mx-0 rounded-full"></div>
          </div>
          <button 
            className="group flex items-center gap-2 text-secondary font-bold text-sm uppercase tracking-widest hover:text-primary transition-all duration-300 cursor-pointer" 
            onClick={() => router.push('/shop')}
          >
            View All Collection 
            <FiArrowRight className="text-xl group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {BEST_SELLERS.map((product) => (
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
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-ivory/50 border-t border-secondary/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
              <div className="text-center md:text-left">
                <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-3 block">Your Heritage History</span>
                <h2 className="text-secondary font-serif text-4xl font-bold tracking-tight">Recently Viewed</h2>
              </div>
              <button 
                onClick={clearRecentlyViewed}
                className="flex items-center gap-2 text-taupe font-bold text-[10px] uppercase tracking-widest hover:text-red-600 transition-colors"
              >
                <FiRotateCcw className="text-sm" /> Clear History
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {getRecentlyViewedProducts().map((product) => (
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
          </div>
        </section>
      )}
    </>
  );
}
