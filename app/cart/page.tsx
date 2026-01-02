'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartPage from '@/components/CartPage';
import { useStore } from '@/context/StoreContext';
import { FiLock, FiArrowRight, FiShoppingBag } from 'react-icons/fi';

export default function Page() {
  const router = useRouter();
  const { session, cart, updateCartQuantity, removeFromCart } = useStore();

  if (!session.user) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[70vh] px-4 py-24 md:py-32">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-taupe/10 p-10 text-center animate-fade-in-up">
          <div className="size-20 bg-ivory rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 shadow-sm">
            <FiShoppingBag className="text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-secondary font-serif mb-4">Oops! Cart Restricted</h2>
          <p className="text-grey mb-10 leading-relaxed">Your selection of masterpieces is waiting for you. Please sign in to access your shopping bag and complete your acquisition.</p>
          <Link href="/auth">
            <button className="w-full bg-secondary hover:bg-primary text-white h-14 rounded-xl font-bold tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 group uppercase text-xs">
              Sign In to Bag <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CartPage 
      items={cart} 
      onUpdateQuantity={updateCartQuantity} 
      onRemove={removeFromCart} 
      onContinueShopping={() => router.push('/shop')} 
      onCheckout={() => router.push('/checkout')} 
    />
  );
}
