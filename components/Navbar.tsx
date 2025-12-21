
import React, { useState, useRef, useEffect } from 'react';
import { FiHeart, FiShoppingBag, FiUser, FiSearch, FiLogOut, FiX } from 'react-icons/fi';
import { UserSession } from '../App.tsx';

interface NavbarProps {
  session: UserSession;
  onLogout: () => void;
  onLogoClick: () => void;
  onHomeClick: () => void;
  onShopClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
  onWishlistClick: () => void;
  onCartClick: () => void;
  onAuthClick: () => void;
  onSearch: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ 
  session,
  onLogout,
  onLogoClick, 
  onHomeClick, 
  onShopClick,
  onAboutClick,
  onContactClick,
  onWishlistClick, 
  onCartClick, 
  onAuthClick,
  onSearch,
  cartCount, 
  wishlistCount 
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-ivory/95 backdrop-blur-md border-b border-secondary/10 shadow-sm transition-all duration-300">
      {/* Search Overlay Bar */}
      {isSearchOpen && (
        <div className="absolute inset-0 z-50 bg-white animate-fade-in flex items-center px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearchSubmit} className="max-w-7xl mx-auto w-full flex items-center gap-6">
            <FiSearch className="text-2xl text-primary shrink-0" />
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group"
            onClick={onLogoClick}
          >
            <FiShoppingBag className="text-secondary text-4xl group-hover:text-primary transition-colors" />
            <h1 className="text-secondary font-serif text-2xl font-bold tracking-tight">LUXE LEATHER</h1>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            {[
              { name: 'HOME', action: onHomeClick },
              { name: 'SHOP', action: onShopClick },
              { name: 'ABOUT', action: onAboutClick },
              { name: 'CONTACT', action: onContactClick }
            ].map((item) => (
              <a 
                key={item.name} 
                className="nav-link text-secondary text-sm font-medium tracking-wide hover:text-primary transition-colors cursor-pointer" 
                onClick={(e) => {
                  e.preventDefault();
                  item.action();
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="relative p-2 text-secondary hover:text-primary transition-colors group"
            >
              <FiSearch className="text-2xl" />
            </button>
            <button 
              onClick={onWishlistClick}
              className="relative p-2 text-secondary hover:text-primary transition-colors group"
            >
              <FiHeart className={`text-2xl transition-all duration-300 ${wishlistCount > 0 ? 'text-primary fill-current' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold shadow-sm animate-fade-in">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              onClick={onCartClick}
              className="relative p-2 text-secondary hover:text-primary transition-colors group"
            >
              <FiShoppingBag className={`text-2xl transition-all duration-300 ${cartCount > 0 ? 'text-primary fill-current' : ''}`} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold shadow-sm animate-fade-in">
                  {cartCount}
                </span>
              )}
            </button>
            
            <div className="relative">
              <button 
                onClick={session.user ? () => setIsProfileOpen(!isProfileOpen) : onAuthClick}
                className="p-2 text-secondary hover:text-primary transition-colors flex items-center gap-2"
              >
                {session.user?.image ? (
                    <img src={session.user.image} className="size-8 rounded-full border border-primary/20" alt="Profile" />
                ) : (
                    <FiUser className="text-2xl" />
                )}
              </button>
              
              {isProfileOpen && session.user && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-taupe/10 p-6 animate-fade-in z-[60]">
                    <div className="mb-4 pb-4 border-b border-taupe/10">
                        <p className="text-xs font-bold text-taupe uppercase tracking-widest mb-1">Authenticated as</p>
                        <p className="text-secondary font-bold font-serif">{session.user.name}</p>
                    </div>
                    <button 
                        onClick={() => { onLogout(); setIsProfileOpen(false); }}
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
