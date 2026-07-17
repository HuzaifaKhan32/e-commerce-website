'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiGrid, FiPackage, FiShoppingBag, FiStar, FiUsers, FiLogOut, FiMenu, FiX, FiLoader } from 'react-icons/fi';

import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth?callbackUrl=/admin/dashboard');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FiGrid },
    { name: 'Products', href: '/admin/products', icon: FiPackage },
    { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
    { name: 'Reviews', href: '/admin/reviews', icon: FiStar },
  ];

  return (
    <div className="min-h-screen bg-background-light flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-taupe/20 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-taupe/20">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <FiGrid className="text-primary text-2xl" />
              <span className="font-serif text-xl font-bold text-secondary">Admin Panel</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-grey hover:text-secondary"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-grey hover:bg-ivory hover:text-secondary'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-bold text-sm uppercase tracking-widest">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-taupe/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FiUsers className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-secondary font-bold text-sm truncate">{session?.user?.name}</p>
                <p className="text-[10px] text-taupe uppercase tracking-widest">Administrator</p>
              </div>
            </div>
            <Link href="/">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-ivory hover:bg-taupe/10 rounded-xl text-sm font-bold text-grey transition-all">
                <FiLogOut />
                View Store
              </button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-white border-b border-taupe/20 flex items-center justify-between px-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-grey hover:text-secondary"
          >
            <FiMenu className="text-2xl" />
          </button>
          <span className="font-serif text-lg font-bold text-secondary">Admin Panel</span>
          <div className="w-10" />
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
