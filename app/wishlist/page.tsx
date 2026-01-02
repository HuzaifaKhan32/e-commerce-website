'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WishlistPage from '@/components/WishlistPage';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';
import { FiLock, FiArrowRight } from 'react-icons/fi';

export default function Page() {
  const router = useRouter();
  const { session, toggleCart, toggleWishlist, wishlist, isProductInCart, addToRecentlyViewed } = useStore();

  const handleProductClick = (product: Product) => {
    addToRecentlyViewed(product.id);
    router.push(`/product/${product.id}`);
  };

  if (!session.user) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[70vh] px-4 py-24 md:py-32">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-taupe/10 p-10 text-center animate-fade-in-up">
          <div className="size-20 bg-ivory rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 shadow-sm">
            <FiLock className="text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-secondary font-serif mb-4">Oops! Access Denied</h2>
          <p className="text-grey mb-10 leading-relaxed">Your curated wishlist is a private affair. Please sign in to view and manage your saved heritage pieces.</p>
          <Link href="/auth">
            <button className="w-full bg-secondary hover:bg-primary text-white h-14 rounded-xl font-bold tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 group uppercase text-xs">
              Sign In to Heritage <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

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
