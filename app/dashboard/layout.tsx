
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  FiLayout, 
  FiShoppingBag, 
  FiSettings, 
  FiHeart, 
  FiMapPin, 
  FiLogOut 
} from 'react-icons/fi';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiLayout /> },
    { name: 'My Orders', href: '/dashboard/orders', icon: <FiShoppingBag /> },
    { name: 'Account Settings', href: '/dashboard/settings', icon: <FiSettings /> },
    { name: 'Wishlist', href: '/wishlist', icon: <FiHeart /> },
    { name: 'Addresses', href: '/dashboard/addresses', icon: <FiMapPin /> },
  ];

  if (!session) {
      return (
          <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                  <h2 className="text-2xl font-bold text-secondary mb-4">Please sign in to view your dashboard</h2>
                  <Link href="/auth">
                      <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl">Sign In</button>
                  </Link>
              </div>
          </div>
      );
  }

  return (
    <>
      <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-taupe/20 sticky top-24">
              {/* User Profile Summary */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-taupe/20">
                <div className="size-12 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-primary/10">
                  {session.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                      {session.user?.name?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-secondary text-base">{session.user?.name}</h3>
                  <p className="text-gold text-xs font-semibold uppercase tracking-wider">Premium Member</p>
                </div>
              </div>
              
              {/* Navigation Links */}
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors group ${
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-grey hover:bg-background-light hover:text-secondary'
                      }`}
                    >
                      <span className={`text-[20px] ${isActive ? 'text-primary' : 'text-taupe group-hover:text-secondary'}`}>
                        {link.icon}
                      </span>
                      {link.name}
                    </Link>
                  );
                })}
                
                <div className="my-2 border-t border-taupe/20"></div>
                
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors w-full text-left"
                >
                  <FiLogOut className="text-[20px]" />
                  Log Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-taupe/20 p-8 max-w-sm w-full text-center">
            <div className="size-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
               <FiLogOut className="text-3xl ml-1" />
            </div>
            <h3 className="text-xl font-bold text-secondary font-serif mb-2">Sign Out</h3>
            <p className="text-grey mb-8">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 border border-taupe/40 rounded-xl font-bold text-secondary hover:bg-background-light transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
