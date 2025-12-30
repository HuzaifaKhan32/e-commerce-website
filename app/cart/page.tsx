'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CartPage from '@/components/CartPage';
import { useStore } from '@/context/StoreContext';

export default function Page() {
  const router = useRouter();
  const { cart, updateCartQuantity, removeFromCart } = useStore();

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
