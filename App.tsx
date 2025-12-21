
import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiRotateCcw, FiX, FiMail, FiSearch } from 'react-icons/fi';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import ProductCard from './components/ProductCard.tsx';
import CollectionCard from './components/CollectionCard.tsx';
import ProductDetailPage from './components/ProductDetailPage.tsx';
import CartPage from './components/CartPage.tsx';
import WishlistPage from './components/WishlistPage.tsx';
import ShopPage from './components/ShopPage.tsx';
import CheckoutPage from './components/CheckoutPage.tsx';
import ConfirmationPage from './components/ConfirmationPage.tsx';
import AboutPage from './components/AboutPage.tsx';
import ContactPage from './components/ContactPage.tsx';
import FAQPage from './components/FAQPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import Footer from './components/Footer.tsx';
import AdminPortal from './components/Admin/AdminPortal.tsx';
import { FEATURED_PRODUCTS, BEST_SELLERS, COLLECTIONS } from './constants.ts';
import { Product, CartItem } from './types.ts';
import { generateEmailContent } from './services/emailService.ts';

export interface CheckoutInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserSession {
  user: {
    name: string;
    email: string;
    image?: string;
  } | null;
}

const App: React.FC = () => {
  type View = 'home' | 'product' | 'cart' | 'wishlist' | 'shop' | 'checkout' | 'confirmation' | 'about' | 'contact' | 'faq' | 'auth' | 'admin' | 'search';
  const [view, setView] = useState<View>('home');
  const [session, setSession] = useState<UserSession>({ user: null });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [lastOrder, setLastOrder] = useState<{ items: CartItem[]; info: CheckoutInfo } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notification / Email States
  const [emailPreview, setEmailPreview] = useState<{ subject: string; body: string } | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedRV = localStorage.getItem('recentlyViewed');
    if (savedRV) setRecentlyViewed(JSON.parse(savedRV));

    const savedSession = localStorage.getItem('lussoSession');
    if (savedSession) setSession(JSON.parse(savedSession));
  }, []);

  // Pseudo-routing
  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.hash === '#admin') setView('admin');
    };
    window.addEventListener('hashchange', handleLocationChange);
    handleLocationChange();
    return () => window.removeEventListener('hashchange', handleLocationChange);
  }, []);

  const login = (userData: { name: string, email: string }) => {
    const newSession = { user: userData };
    setSession(newSession);
    localStorage.setItem('lussoSession', JSON.stringify(newSession));
    navigateToView('home');
  };

  const logout = () => {
    setSession({ user: null });
    localStorage.removeItem('lussoSession');
    navigateToView('home');
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('product');
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== product.id);
      const updated = [product.id, ...filtered].slice(0, 4);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToView = (newView: View) => {
    if (newView === 'admin') window.location.hash = 'admin';
    else window.location.hash = '';
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigateToView('search');
    } else if (view === 'search') {
      navigateToView('shop');
    }
  };

  const toggleCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.productId === product.id);
      if (exists) return prev.filter(i => i.productId !== product.id);
      return [...prev, {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
        color: 'Espresso'
      }];
    });
  };

  const triggerEmailNotification = async (type: 'order' | 'shipping', data: any) => {
    setIsEmailLoading(true);
    try {
      const email = await generateEmailContent(type, data);
      setEmailPreview(email);
    } catch (e) {
      console.error("Email generation failed", e);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handlePlaceOrder = async (info: CheckoutInfo) => {
    const orderData = { items: [...cart], info };
    setLastOrder(orderData);
    setCart([]);
    navigateToView('confirmation');
    
    // Auto-trigger smart confirmation email
    triggerEmailNotification('order', { 
      customerName: info.fullName, 
      items: orderData.items.map(i => i.name),
      total: orderData.items.reduce((a, b) => a + (b.price * b.quantity), 0).toFixed(2)
    });
  };

  const isProductInCart = (productId: string) => cart.some(item => item.productId === productId);

  // Recently Viewed helper
  const getRecentlyViewedProducts = () => {
    const all = [...FEATURED_PRODUCTS, ...BEST_SELLERS];
    return recentlyViewed
      .map(id => all.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  };

  // Search results helper
  const getSearchResults = () => {
    const all = [...FEATURED_PRODUCTS, ...BEST_SELLERS];
    if (!searchQuery.trim()) return [];
    return all.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (view === 'admin') {
    return <AdminPortal onExit={() => navigateToView('home')} onSendShippingEmail={(data) => triggerEmailNotification('shipping', data)} />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30 bg-background-light">
      <Navbar 
        session={session}
        onLogout={logout}
        onLogoClick={() => navigateToView('home')} 
        onHomeClick={() => navigateToView('home')} 
        onShopClick={() => navigateToView('shop')}
        onAboutClick={() => navigateToView('about')}
        onContactClick={() => navigateToView('contact')}
        onWishlistClick={() => navigateToView('wishlist')}
        onCartClick={() => navigateToView('cart')}
        onAuthClick={() => navigateToView('auth')}
        onSearch={handleSearch}
        cartCount={cart.length}
        wishlistCount={wishlist.length}
      />
      
      <main className="flex-grow">
        {view === 'home' && (
          <>
            <Hero />
            
            {/* Featured Products */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-secondary font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Featured Products</h2>
                <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
                <p className="mt-6 text-grey/70 max-w-2xl mx-auto font-light leading-relaxed">
                  Explore our hand-picked selection of most sought-after leather goods, each telling its own story of craftsmanship.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {FEATURED_PRODUCTS.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => navigateToProduct(product)}
                    onAddToCart={() => toggleCart(product)}
                    onToggleWishlist={() => setWishlist(prev => prev.includes(product.id) ? prev.filter(i => i !== product.id) : [...prev, product.id])}
                    isWishlisted={wishlist.includes(product.id)}
                    isInCart={isProductInCart(product.id)}
                  />
                ))}
              </div>
            </section>

            {/* Our Collections */}
            <section className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-secondary font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Our Collections</h2>
                  <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {COLLECTIONS.map((collection, index) => (
                    <CollectionCard 
                      key={collection.id} 
                      collection={collection} 
                      span={index === 2 ? "md:col-span-2 lg:col-span-1" : ""}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Best Sellers */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-secondary font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Best Sellers</h2>
                  <div className="h-1.5 w-24 bg-primary mx-auto md:mx-0 rounded-full"></div>
                </div>
                <button 
                  className="group flex items-center gap-2 text-secondary font-bold text-sm uppercase tracking-widest hover:text-primary transition-all duration-300 cursor-pointer" 
                  onClick={() => navigateToView('shop')}
                >
                  View All Collection 
                  <FiArrowRight className="text-xl group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {BEST_SELLERS.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => navigateToProduct(product)}
                    onAddToCart={() => toggleCart(product)}
                    onToggleWishlist={() => setWishlist(prev => prev.includes(product.id) ? prev.filter(i => i !== product.id) : [...prev, product.id])}
                    isWishlisted={wishlist.includes(product.id)}
                    isInCart={isProductInCart(product.id)}
                  />
                ))}
              </div>
            </section>

            {/* Recently Viewed Section */}
            {recentlyViewed.length > 0 && (
              <section className="py-24 px-4 sm:px-6 lg:px-8 bg-ivory/50 border-t border-secondary/5">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                    <div className="text-center md:text-left">
                      <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-3 block">Your Heritage History</span>
                      <h2 className="text-secondary font-serif text-4xl font-bold tracking-tight">Recently Viewed</h2>
                    </div>
                    <button 
                      onClick={() => {
                        setRecentlyViewed([]);
                        localStorage.removeItem('recentlyViewed');
                      }}
                      className="flex items-center gap-2 text-taupe font-bold text-[10px] uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                      <FiRotateCcw className="text-sm" /> Clear History
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {getRecentlyViewedProducts().map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={() => navigateToProduct(product)}
                        onAddToCart={() => toggleCart(product)}
                        onToggleWishlist={() => setWishlist(prev => prev.includes(product.id) ? prev.filter(i => i !== product.id) : [...prev, product.id])}
                        isWishlisted={wishlist.includes(product.id)}
                        isInCart={isProductInCart(product.id)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {view === 'search' && (
          <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[60vh]">
            <div className="mb-16">
              <p className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-3">Search Results</p>
              <h2 className="text-secondary font-serif text-4xl font-bold tracking-tight">
                {getSearchResults().length} matches for "{searchQuery}"
              </h2>
              <div className="h-1.5 w-24 bg-primary mt-6 rounded-full"></div>
            </div>

            {getSearchResults().length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {getSearchResults().map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => navigateToProduct(product)}
                    onAddToCart={() => toggleCart(product)}
                    onToggleWishlist={() => setWishlist(prev => prev.includes(product.id) ? prev.filter(i => i !== product.id) : [...prev, product.id])}
                    isWishlisted={wishlist.includes(product.id)}
                    isInCart={isProductInCart(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-ivory/30 rounded-3xl border border-taupe/10">
                <FiSearch className="text-6xl text-taupe/40 mx-auto mb-6" />
                <h3 className="text-2xl font-serif font-bold text-secondary mb-4">No matching heritage found</h3>
                <p className="text-grey mb-10 max-w-sm mx-auto font-light">We couldn't find any artisanal goods matching your criteria. Try adjusting your search term.</p>
                <button 
                  onClick={() => navigateToView('shop')}
                  className="bg-secondary text-white px-10 py-4 rounded-lg font-bold hover:bg-primary transition-all shadow-lg uppercase tracking-widest text-xs"
                >
                  Browse Full Shop
                </button>
              </div>
            )}
          </section>
        )}

        {view === 'auth' && <LoginPage onLogin={login} />}
        {view === 'product' && selectedProduct && (
          <ProductDetailPage 
            product={selectedProduct} 
            onBack={() => navigateToView('home')} 
            onAddToCart={(p, q, c) => {
                setCart(prev => [...prev, { id: `${p.id}-${c}`, productId: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl, quantity: q, color: c }]);
            }}
            onToggleWishlist={(id) => setWishlist(prev => prev.includes(id) ? prev.filter(id => id !== id) : [...prev, id])}
            onProductClick={navigateToProduct}
            wishlist={wishlist}
            isProductInCart={isProductInCart}
            isWishlisted={wishlist.includes(selectedProduct.id)}
            isInCart={isProductInCart(selectedProduct.id)}
          />
        )}
        {view === 'shop' && <ShopPage onProductClick={navigateToProduct} onAddToCart={toggleCart} onToggleWishlist={(id) => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} wishlistIds={wishlist} isProductInCart={isProductInCart} />}
        {view === 'cart' && <CartPage items={cart} onUpdateQuantity={(id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onContinueShopping={() => navigateToView('shop')} onCheckout={() => navigateToView('checkout')} />}
        {view === 'checkout' && <CheckoutPage items={cart} onPlaceOrder={handlePlaceOrder} />}
        {view === 'confirmation' && lastOrder && <ConfirmationPage order={lastOrder} onContinueShopping={() => navigateToView('home')} />}
        {view === 'about' && <AboutPage />}
        {view === 'contact' && <ContactPage />}
        {view === 'faq' && <FAQPage />}
      </main>

      <Footer onContactClick={() => navigateToView('contact')} onFAQClick={() => navigateToView('faq')} onAboutClick={() => navigateToView('about')} onHomeClick={() => navigateToView('home')} onShopClick={() => navigateToView('shop')} />

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
              <button onClick={() => setEmailPreview(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
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
    </div>
  );
};

export default App;
