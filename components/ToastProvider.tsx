'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#3E2723',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E0D5C7',
          fontWeight: '500',
        },
        success: {
          iconTheme: {
            primary: '#C19A6B',
            secondary: '#fff',
          },
          style: {
            border: '1px solid #C19A6B',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            border: '1px solid #fee2e2',
          },
        },
        loading: {
          iconTheme: {
            primary: '#C19A6B',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
