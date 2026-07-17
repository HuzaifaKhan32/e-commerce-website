'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ToastProvider';
import { StoreProvider } from '@/context/StoreContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>
        {children}
        <ToastProvider />
      </StoreProvider>
    </SessionProvider>
  );
}
