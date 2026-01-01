'use client';

import React from 'react';
import ShopClient from './ShopClient';
import { Product } from '@/types';

export default function Page() {
  // The ShopClient component handles the data fetching and rendering
  return <ShopClient />;
}