'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiHeart, FiShoppingBag, FiUser, FiSearch, FiLogOut, FiX } from 'react-icons/fi';
import { useStore } from '@/context/StoreContext';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { 
    session, 
    logout, 
    cart, 
    wishlist, 
    setSearchQuery: setGlobalSearchQuery
  } = useStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalSearchQuery(localSearchQuery);
    if (localSearchQuery.trim()) {
        router.push('/search');
    }
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    setGlobalSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-ivory/80 backdrop-blur-lg border-b border-secondary/10 shadow-sm transition-all duration-300">
      {/* Search Overlay Bar */}
      {isSearchOpen && (
        <div className="absolute inset-0 z-50 bg-white animate-fade-in flex items-center px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearchSubmit} className="max-w-7xl mx-auto w-full flex items-center gap-6">
            <FiSearch className="text-2xl text-primary shrink-0" />
            <input 
              ref={searchInputRef}
              type="text" 
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              placeholder="Search for handcrafted heritage..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-xl md:text-2xl font-serif text-secondary placeholder-taupe/40 outline-none"
            />
            <button 
              type="button" 
              onClick={clearSearch}
              className="p-2 text-taupe hover:text-secondary transition-colors"
            >
              <FiX className="text-3xl" />
            </button>
          </form>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <FiShoppingBag className="text-secondary text-4xl group-hover:text-primary transition-colors" />
            <h1 className="text-secondary font-serif text-2xl font-bold tracking-tight">LUXE LEATHER</h1>
          </Link>
          
          <nav className="hidden md:flex space-x-10">
            {[
              { name: 'HOME', href: '/' },
              { name: 'SHOP', href: '/shop' },
              { name: 'ABOUT', href: '/about' },
              { name: 'CONTACT', href: '/contact' }
            ].map((item) => (
              <Link
                key={item.name} 
                href={item.href}
                className="nav-link text-secondary text-sm font-semibold tracking-wide hover:text-primary transition-colors cursor-pointer" 
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="relative p-2 text-secondary hover:text-primary transition-colors group"
            >
              <FiSearch className="text-2xl" />
            </button>
            <Link 
              href="/wishlist"
              className="relative p-2 text-secondary hover:text-primary transition-colors group"
            >
              <FiHeart className={`text-2xl transition-all duration-300 ${wishlist.length > 0 ? 'text-primary fill-current' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold shadow-sm animate-fade-in">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link 
              href="/cart"
              className="relative p-2 text-secondary hover:text-primary transition-colors group"
            >
              <FiShoppingBag className={`text-2xl transition-all duration-300 ${cart.length > 0 ? 'text-primary fill-current' : ''}`} />
              {cart.length > 0 && (
                <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold shadow-sm animate-fade-in">
                  {cart.length}
                </span>
              )}
            </Link>
            
            <div className="relative">
              {session.user ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard">
                    <button className="px-6 py-2 bg-primary text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-secondary transition-colors shadow-md">
                      Dashboard
                    </button>
                  </Link>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2 text-secondary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    {session.user.image ? (
                        <img src={session.user.image} className="size-8 rounded-full border border-primary/20" alt="Profile" />
                    ) : (
                        <FiUser className="text-2xl" />
                    )}
                  </button>
                </div>
              ) : (
                <Link href="/auth">
                  <button className="px-6 py-2 bg-secondary text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-primary transition-colors shadow-md">
                    Sign In
                  </button>
                </Link>
              )}
              
              {isProfileOpen && session.user && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-taupe/10 p-6 animate-fade-in z-[60]">
                    <div className="mb-4 pb-4 border-b border-taupe/10">
                        <p className="text-xs font-bold text-taupe uppercase tracking-widest mb-1">Authenticated as</p>
                        <p className="text-secondary font-bold font-serif">{session.user.name}</p>
                    </div>
                    <button 
                        onClick={() => { logout(); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 text-sm font-bold text-grey hover:text-red-600 transition-colors"
                    >
                        <FiLogOut className="text-lg" /> Sign Out
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;