'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CartPage from '@/components/CartPage';
import { useStore } from '@/context/StoreContext';

export default function Page() {
  const router = useRouter();
  const { cart, updateCartQuantity, removeFromCart, session } = useStore();

  const handleCheckout = () => {
    if (!session.user) {
      router.push('/auth?callbackUrl=/checkout');
      return;
    }
    router.push('/checkout');
  };

  return (
    <CartPage
      items={cart}
      onUpdateQuantity={updateCartQuantity}
      onRemove={removeFromCart}
      onContinueShopping={() => router.push('/shop')}
      onCheckout={handleCheckout}
    />
  );
}
