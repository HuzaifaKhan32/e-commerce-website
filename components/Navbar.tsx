'use client';

import React, { useState, useRef, useEffect } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { FiHeart, FiShoppingBag, FiUser, FiSearch, FiLogOut, FiX, FiMenu } from 'react-icons/fi';

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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    setIsMobileMenuOpen(false);

  };



  const clearSearch = () => {

    setLocalSearchQuery('');

    setGlobalSearchQuery('');

    setIsSearchOpen(false);

  };



  const navLinks = [

    { name: 'HOME', href: '/' },

    { name: 'SHOP', href: '/shop' },

    { name: 'ABOUT', href: '/about' },

    { name: 'CONTACT', href: '/contact' }

  ];



  return (

    <header className="sticky top-0 z-50 w-full bg-ivory/80 backdrop-blur-lg border-b border-secondary/10 shadow-sm transition-all duration-300">

      {/* Search Overlay Bar (Desktop) */}

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

        <div className="flex items-center justify-between h-16 md:h-20">

          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" aria-label="LUXE LEATHER Home">

            <FiShoppingBag className="text-secondary text-3xl md:text-4xl group-hover:text-primary transition-colors" aria-hidden="true" />

            <h1 className="text-secondary font-serif text-xl md:text-2xl font-bold tracking-tight">LUXE LEATHER</h1>

          </Link>

          

          {/* Desktop Navigation */}

          <nav className="hidden md:flex space-x-10">

            {navLinks.map((item) => (

              <Link

                key={item.name} 

                href={item.href}

                className="nav-link text-secondary text-sm font-semibold tracking-wide hover:text-primary transition-colors cursor-pointer" 

              >

                {item.name}

              </Link>

            ))}

          </nav>



          {/* Icons & Mobile Menu Trigger */}

          <div className="flex items-center gap-2 md:gap-5">

            <button

              onClick={() => setIsSearchOpen(true)}

              className="hidden md:block relative p-2 text-secondary hover:text-primary transition-colors group"

              aria-label="Search"

            >

              <FiSearch className="text-2xl" aria-hidden="true" />

            </button>

            

            <div className="hidden md:flex items-center gap-5">

              <Link

                href="/wishlist"

                className="relative p-2 text-secondary hover:text-primary transition-colors group"

                aria-label={`Wishlist (${wishlist.length} items)`}

              >

                <FiHeart className={`text-2xl transition-all duration-300 ${wishlist.length > 0 ? 'text-primary fill-current' : ''}`} aria-hidden="true" />

                {wishlist.length > 0 && (

                  <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold shadow-sm animate-fade-in">

                    {wishlist.length}

                  </span>

                )}

              </Link>

              <Link

                href="/cart"

                className="relative p-2 text-secondary hover:text-primary transition-colors group"

                aria-label={`Shopping Cart (${cart.length} items)`}

              >

                <FiShoppingBag className={`text-2xl transition-all duration-300 ${cart.length > 0 ? 'text-primary fill-current' : ''}`} aria-hidden="true" />

                {cart.length > 0 && (

                  <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold shadow-sm animate-fade-in">

                    {cart.length}

                  </span>

                )}

              </Link>

            </div>

            

            <div className="relative hidden md:block">

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

                    aria-label="User Profile"

                  >

                    {session.user.image ? (

                        <img src={session.user.image} className="size-8 rounded-full border border-primary/20" alt="Profile" />

                    ) : (

                        <FiUser className="text-2xl" aria-hidden="true" />

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

                        <FiLogOut className="text-lg" aria-hidden="true" /> Sign Out

                    </button>

                </div>

              )}

            </div>



            <div className="flex md:hidden items-center gap-1">

              <Link

                href="/wishlist"

                className="relative p-2 text-secondary"

                aria-label="Wishlist"

              >

                <FiHeart className={`text-2xl ${wishlist.length > 0 ? 'text-primary fill-current' : ''}`} />

                {wishlist.length > 0 && (

                  <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">

                    {wishlist.length}

                  </span>

                )}

              </Link>

              <Link

                href="/cart"

                className="relative p-2 text-secondary"

                aria-label="Cart"

              >

                <FiShoppingBag className={`text-2xl ${cart.length > 0 ? 'text-primary fill-current' : ''}`} />

                {cart.length > 0 && (

                  <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">

                    {cart.length}

                  </span>

                )}

              </Link>

            </div>



            {/* Mobile Hamburger Button */}

            <button

              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}

              className="md:hidden p-2 text-secondary hover:text-primary transition-colors z-[70]"

              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}

            >

              {isMobileMenuOpen ? <FiX className="text-3xl" aria-hidden="true" /> : <FiMenu className="text-3xl" aria-hidden="true" />}

            </button>

          </div>

        </div>

      </div>



      {/* Mobile Menu Overlay */}

      {isMobileMenuOpen && (

        <div
          className="fixed inset-0 z-[65] md:hidden"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsMobileMenuOpen(false);
            }
          }}
        >

          {/* Backdrop */}

          <div

            className="absolute inset-0 bg-secondary/40 backdrop-blur-sm animate-fade-in"

            onClick={() => setIsMobileMenuOpen(false)}

            aria-hidden="true"

          />



          {/* Floating Menu Box */}

          <div
            className="absolute top-20 right-4 left-4 bg-white rounded-3xl shadow-2xl border border-taupe/10 p-8 animate-slide-in-top flex flex-col gap-8"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            tabIndex={-1}
          >

            {/* Mobile Search */}

            <form onSubmit={handleSearchSubmit} className="relative" role="search">

              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" aria-hidden="true" />

              <input

                type="text"

                value={localSearchQuery}

                onChange={(e) => setLocalSearchQuery(e.target.value)}

                placeholder="Search products..."

                className="w-full h-12 pl-12 pr-4 bg-background-light rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"

                aria-label="Search products"

                autoFocus

              />

            </form>



            {/* Mobile Links */}

            <nav className="flex flex-col gap-4">

              {navLinks.map((item) => (

                <Link

                  key={item.name} 

                  href={item.href}

                  onClick={() => setIsMobileMenuOpen(false)}

                  className="text-2xl font-serif font-bold text-secondary hover:text-primary transition-colors flex items-center justify-between group" 

                >

                  {item.name}

                  <FiMenu className="text-sm opacity-0 group-hover:opacity-100 transition-all" />

                </Link>

              ))}

            </nav>



            {/* Mobile Auth Button */}

            <div className="pt-4 border-t border-taupe/10">

              {session.user ? (

                <div className="flex flex-col gap-4">

                  <div className="flex items-center gap-4">

                    <div className="size-12 rounded-full border-2 border-primary/20 overflow-hidden">

                      {session.user.image ? <img src={session.user.image} alt="User" /> : <div className="w-full h-full bg-ivory flex items-center justify-center"><FiUser className="text-2xl text-taupe" aria-hidden="true" /></div>}

                    </div>

                    <div>

                      <p className="text-xs font-bold text-taupe uppercase tracking-widest">Signed in as</p>

                      <p className="text-secondary font-bold font-serif">{session.user.name}</p>

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">

                      <button className="w-full h-12 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest">Dashboard</button>

                    </Link>

                    <button 

                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}

                      className="flex-1 h-12 border border-red-100 text-red-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-50"

                    >

                      Sign Out

                    </button>

                  </div>

                </div>

              ) : (

                <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>

                  <button className="w-full h-14 bg-secondary text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg">

                    Sign In to Heritage

                  </button>

                </Link>

              )}

            </div>

          </div>

        </div>

      )}

    </header>

  );

};



export default Navbar;
