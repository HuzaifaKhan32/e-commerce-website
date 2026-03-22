'use client';

import React, { Suspense } from 'react';
import ShopClient from './ShopClient';
import { FiLoader } from 'react-icons/fi';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <FiLoader className="animate-spin text-6xl text-primary" />
      </div>
    }>
      <ShopClient />
    </Suspense>
  );
}