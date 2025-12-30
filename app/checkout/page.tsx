'use client';

import React from 'react';
import CheckoutPage from '@/components/CheckoutPage';
import { useStore } from '@/context/StoreContext';

export default function Page() {
  const { cart, placeOrder } = useStore();

  return (
    <CheckoutPage items={cart} onPlaceOrder={placeOrder} />
  );
}
