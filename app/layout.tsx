'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { SessionProvider } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { FiMail, FiX } from 'react-icons/fi';
import { NotificationProvider } from '@/components/NotificationProvider';
import '@/app/globals.css';

const MainLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { emailPreview, closeEmailPreview } = useStore();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdmin && <Footer />}

      {/* Maison Notification Preview Modal */}
      {emailPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-secondary/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slide-in-right">
            <div className="bg-secondary p-8 flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-primary rounded-xl flex items-center justify-center text-secondary">
                  <FiMail className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold">Maison Mail</h3>
                  <p className="text-xs text-ivory/60 uppercase tracking-widest">Notification Preview</p>
                </div>
              </div>
              <button onClick={closeEmailPreview} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <FiX className="text-2xl" />
              </button>
            </div>
            <div className="p-10">
              <div className="mb-6 pb-6 border-b border-taupe/20">
                <p className="text-[10px] font-bold text-taupe uppercase tracking-widest mb-1">Subject</p>
                <p className="text-lg font-bold text-secondary font-serif">{emailPreview.subject}</p>
              </div>
              <div className="prose prose-sm max-w-none text-grey leading-relaxed whitespace-pre-line font-light">
                {emailPreview.body}
              </div>
              <div className="mt-10 pt-8 border-t border-taupe/20 text-center">
                <p className="text-[10px] text-taupe font-bold uppercase tracking-[0.2em]">Sent via Luxe Leather heritage system</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col selection:bg-primary/30 bg-background-light">
        <SessionProvider>
          <NotificationProvider>
            <StoreProvider>
              <MainLayoutContent>{children}</MainLayoutContent>
            </StoreProvider>
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
