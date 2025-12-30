'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Product, CartItem } from '@/types';
import { generateEmailContent } from '@/services/emailService';
import { FEATURED_PRODUCTS, BEST_SELLERS } from '@/constants';

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

interface StoreContextType {
  session: UserSession;
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  lastOrder: { items: CartItem[]; info: CheckoutInfo } | null;
  searchQuery: string;
  emailPreview: { subject: string; body: string } | null;
  isEmailLoading: boolean;
  
  // Actions
  login: (userData: { name: string; email: string }) => void;
  logout: () => void;
  toggleCart: (product: Product) => void;
  addToCart: (product: Product, quantity: number, color: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (info: CheckoutInfo) => void;
  toggleWishlist: (productId: string) => void;
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
  setSearchQuery: (query: string) => void;
  triggerEmailNotification: (type: 'order' | 'shipping', data: any) => Promise<void>;
  closeEmailPreview: () => void;
  
  // Helpers
  isProductInCart: (productId: string) => boolean;
  isProductWishlisted: (productId: string) => boolean;
  getRecentlyViewedProducts: () => Product[];
  getSearchResults: () => Product[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { data: nextAuthSession, status } = useSession();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [lastOrder, setLastOrder] = useState<{ items: CartItem[]; info: CheckoutInfo } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailPreview, setEmailPreview] = useState<{ subject: string; body: string } | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // Derive custom session from NextAuth
  const session: UserSession = {
    user: nextAuthSession?.user ? {
      name: nextAuthSession.user.name || '',
      email: nextAuthSession.user.email || '',
      image: nextAuthSession.user.image || undefined,
    } : null
  };

  // Sync with DB when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart();
      fetchWishlist();
    }
  }, [status]);

  // Load recently viewed from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRV = localStorage.getItem('recentlyViewed');
      if (savedRV) setRecentlyViewed(JSON.parse(savedRV));
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        // Map DB structure to CartItem
        const mapped: CartItem[] = data.map((item: any) => ({
             id: item.id, // cart item id
             productId: item.product_id, // product id
             name: item.products.name,
             price: item.products.price,
             imageUrl: item.products.image_url,
             quantity: item.quantity,
             color: item.color || 'Espresso'
        }));
        setCart(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch cart", e);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const ids = await res.json();
        setWishlist(ids);
      }
    } catch (e) {
      console.error("Failed to fetch wishlist", e);
    }
  };

  // Deprecated: login handled by NextAuth pages, but kept for compatibility
  const login = (userData: { name: string, email: string }) => {
    console.warn("Manual login called. Use NextAuth signIn instead.");
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  const toggleCart = (product: Product) => {
    // Basic toggle logic, defaulting to add
    if (isProductInCart(product.id)) {
        // Find the cart item ID to remove
        const item = cart.find(c => c.productId === product.id);
        if (item) removeFromCart(item.id);
    } else {
        addToCart(product, 1, 'Espresso');
    }
  };

  const addToCart = async (product: Product, quantity: number, color: string) => {
    if (status === 'authenticated') {
       // Optimistic update
       const tempId = `temp-${Date.now()}`;
       const optimisticItem: CartItem = {
           id: tempId,
           productId: product.id,
           name: product.name,
           price: product.price,
           imageUrl: product.imageUrl,
           quantity,
           color
       };
       setCart(prev => [...prev, optimisticItem]);

       try {
           const res = await fetch('/api/cart', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ productId: product.id, quantity, color })
           });
           if (res.ok) {
               fetchCart(); // Re-sync to get real IDs
           }
       } catch (e) {
           console.error("Add to cart failed", e);
           setCart(prev => prev.filter(i => i.id !== tempId)); // Revert
       }
    } else {
       // Local State Fallback
       setCart(prev => [...prev, { 
          id: `${product.id}-${color}-${Date.now()}`,
          productId: product.id, 
          name: product.name, 
          price: product.price, 
          imageUrl: product.imageUrl, 
          quantity: quantity, 
          color: color 
      }]);
    }
  };

  const updateCartQuantity = async (id: string, delta: number) => {
     const item = cart.find(i => i.id === id);
     if (!item) return;
     const newQuantity = Math.max(1, item.quantity + delta);

     // Optimistic
     setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: newQuantity } : i));

     if (status === 'authenticated') {
         try {
             await fetch('/api/cart', {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ id, quantity: newQuantity })
             });
         } catch (e) {
             console.error("Update quantity failed", e);
             fetchCart(); // Revert
         }
     }
  };

  const removeFromCart = async (id: string) => {
    // Optimistic
    const prevCart = [...cart];
    setCart(prev => prev.filter(i => i.id !== id));

    if (status === 'authenticated') {
        try {
            await fetch(`/api/cart?id=${id}`, { method: 'DELETE' });
        } catch (e) {
            console.error("Remove from cart failed", e);
            setCart(prevCart); // Revert
        }
    }
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = async (productId: string) => {
    // Optimistic
    const isAdded = !wishlist.includes(productId);
    setWishlist(prev => isAdded ? [...prev, productId] : prev.filter(id => id !== productId));

    if (status === 'authenticated') {
        try {
            if (isAdded) {
                await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId })
                });
            } else {
                await fetch(`/api/wishlist?productId=${productId}`, { method: 'DELETE' });
            }
        } catch (e) {
            console.error("Wishlist toggle failed", e);
            fetchWishlist(); // Revert
        }
    }
  };

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      const updated = [productId, ...filtered].slice(0, 4);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recentlyViewed');
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

  const closeEmailPreview = () => setEmailPreview(null);

  const placeOrder = async (info: CheckoutInfo) => {
    const total = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
    
    if (status === 'authenticated') {
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart, info, total })
            });
            if (res.ok) {
                 // Success
            }
        } catch (e) {
            console.error("Place order failed", e);
            return;
        }
    }

    const orderData = { items: [...cart], info };
    setLastOrder(orderData);
    setCart([]);
    router.push('/confirmation');
    
    // Auto-trigger smart confirmation email
    triggerEmailNotification('order', { 
      customerName: info.fullName, 
      items: orderData.items.map(i => i.name),
      total: total.toFixed(2)
    });
  };

  const isProductInCart = (productId: string) => cart.some(item => item.productId === productId);
  const isProductWishlisted = (productId: string) => wishlist.includes(productId);

  const getRecentlyViewedProducts = () => {
    const all = [...FEATURED_PRODUCTS, ...BEST_SELLERS];
    return recentlyViewed
      .map(id => all.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  };

  const getSearchResults = () => {
    const all = [...FEATURED_PRODUCTS, ...BEST_SELLERS];
    if (!searchQuery.trim()) return [];
    return all.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <StoreContext.Provider value={{
      session,
      cart,
      wishlist,
      recentlyViewed,
      lastOrder,
      searchQuery,
      emailPreview,
      isEmailLoading,
      login,
      logout,
      toggleCart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      placeOrder,
      toggleWishlist,
      addToRecentlyViewed,
      clearRecentlyViewed,
      setSearchQuery,
      triggerEmailNotification,
      closeEmailPreview,
      isProductInCart,
      isProductWishlisted,
      getRecentlyViewedProducts,
      getSearchResults
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};