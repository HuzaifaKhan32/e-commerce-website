import React from 'react';
import Providers from '@/components/Providers';
import ClientLayout from '@/components/ClientLayout';
import { inter, playfair } from '@/lib/fonts';
import '@/app/globals.css';

export const metadata = {
  title: 'Luxe Leather - Premium Handcrafted Leather Goods',
  description: 'Discover our collection of handcrafted leather goods made with premium materials and traditional craftsmanship.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} min-h-screen flex flex-col selection:bg-primary/30 bg-background-light overflow-x-hidden font-sans antialiased`}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
