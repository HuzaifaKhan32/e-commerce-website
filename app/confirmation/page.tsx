'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ConfirmationPage from '@/components/ConfirmationPage';
import { useStore } from '@/context/StoreContext';

export default function Page() {
  const router = useRouter();
  const { lastOrder } = useStore();

  if (!lastOrder) {
      return (
          <div className="min-h-[50vh] flex items-center justify-center">
              <p>No order found. <button onClick={() => router.push('/')} className="text-primary underline">Return Home</button></p>
          </div>
      );
  }

  return (
    <ConfirmationPage order={lastOrder} onContinueShopping={() => router.push('/')} />
  );
}
