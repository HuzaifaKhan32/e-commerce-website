'use client';

import React from 'react';
import LoginPage from '@/components/LoginPage';
import { useStore } from '@/context/StoreContext';

export default function Page() {
  const { login } = useStore();
  return <LoginPage onLogin={login} />;
}
