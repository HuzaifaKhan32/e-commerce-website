'use client';

import React, { useEffect, Suspense } from 'react';
import LoginPage from '@/components/LoginPage';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-pulse text-taupe font-bold tracking-widest uppercase text-xs">Loading...</div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-pulse text-taupe font-bold tracking-widest uppercase text-xs">Initializing Secure Auth...</div>
      </div>
    }>
      <LoginPage onLogin={() => {}} />
    </Suspense>
  );
}
