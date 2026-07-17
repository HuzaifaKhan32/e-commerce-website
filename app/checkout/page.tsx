'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutPage from '@/components/CheckoutPage';
import { useStore } from '@/context/StoreContext';
import { FiLoader } from 'react-icons/fi';

export default function Page() {
  const router = useRouter();
  const { cart, placeOrder } = useStore();

  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/shop');
    }
  }, [cart.length, router]);

  if (cart.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return <CheckoutPage items={cart} onPlaceOrder={placeOrder} />;
}
