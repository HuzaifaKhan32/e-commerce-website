'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LoginPage from '@/components/LoginPage';
import { useSession } from 'next-auth/react';

function AuthContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === 'loading') {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-pulse text-taupe font-bold tracking-widest uppercase text-xs">Loading...</div>
      </div>
    );
  }

  return <LoginPage onLogin={() => {}} callbackUrl={callbackUrl} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-pulse text-taupe font-bold tracking-widest uppercase text-xs">Initializing Secure Auth...</div>
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
