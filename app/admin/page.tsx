'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminPortal from '@/components/Admin/AdminPortal';
import { useStore } from '@/context/StoreContext';

export default function Page() {
  const router = useRouter();
  const { triggerEmailNotification } = useStore();

  return (
    <AdminPortal 
      onExit={() => router.push('/')} 
      onSendShippingEmail={(data) => triggerEmailNotification('shipping', data)} 
    />
  );
}
