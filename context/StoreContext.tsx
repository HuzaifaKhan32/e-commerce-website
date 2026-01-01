'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Product, CartItem } from '@/types';
import { generateEmailContent } from '@/services/emailService';
import { PLACEHOLDER_FEATURED_PRODUCTS, PLACEHOLDER_BEST_SELLERS } from '@/constants';
import { useNotification } from '@/components/NotificationProvider';

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
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
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
  const { showNotification } = useNotification();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [lastOrder, setLastOrder] = useState<{ items: CartItem[]; info: CheckoutInfo } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailPreview, setEmailPreview] = useState<{ subject: string; body: string } | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // Derive custom session from NextAuth
  const session: UserSession = {
    user: nextAuthSession?.user ? {
      id: nextAuthSession.user.id,
      name: nextAuthSession.user.name || '',
      email: nextAuthSession.user.email || '',
      image: nextAuthSession.user.image || undefined,
      role: nextAuthSession.user.role,
    } : null
  };

  // Sync with DB when authenticated
  useEffect(() => {
    fetchAllProducts();
    if (status === 'authenticated') {
      fetchCart();
      fetchWishlist();
    }
  }, [status]);

  const fetchAllProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        const mapped: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price) || 0,
          rating: p.rating || 5,
          reviewCount: p.review_count || 0,
          imageUrl: p.image_url || '',
          category: p.category || 'Leather Goods',
          description: p.description || '',
          stock: p.stock || 0
        }));
        setAllProducts(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch all products", e);
    }
  };

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
    if (status !== 'authenticated') {
      showNotification('warning', 'Please login first to manage your cart');
      return;
    }
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
    if (status !== 'authenticated') {
      showNotification('warning', 'Please login first to add items to your cart');
      return;
    }
    
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
            showNotification('success', `${product.name} added to cart successfully!`);
        } else {
            const errorData = await res.json();
            showNotification('error', errorData.error || 'Failed to add item to cart');
            setCart(prev => prev.filter(i => i.id !== tempId)); // Revert
        }
    } catch (e) {
        console.error("Add to cart failed", e);
        showNotification('error', 'Failed to add item to cart. Please try again.');
        setCart(prev => prev.filter(i => i.id !== tempId)); // Revert
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
             const res = await fetch('/api/cart', {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ id, quantity: newQuantity })
             });
             if (!res.ok) {
                 const errorData = await res.json();
                 showNotification('error', errorData.error || 'Failed to update quantity');
                 fetchCart(); // Revert
             }
         } catch (e) {
             console.error("Update quantity failed", e);
             showNotification('error', 'Failed to update quantity. Please try again.');
             fetchCart(); // Revert
         }
     } else {
         showNotification('success', 'Cart updated');
     }
  };

  const removeFromCart = async (id: string) => {
    // Optimistic
    const prevCart = [...cart];
    setCart(prev => prev.filter(i => i.id !== id));

    if (status === 'authenticated') {
        try {
            const res = await fetch(`/api/cart?id=${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorData = await res.json();
                showNotification('error', errorData.error || 'Failed to remove item from cart');
                setCart(prevCart); // Revert
            } else {
                showNotification('success', 'Item removed from cart');
            }
        } catch (e) {
            console.error("Remove from cart failed", e);
            showNotification('error', 'Failed to remove item from cart. Please try again.');
            setCart(prevCart); // Revert
        }
    } else {
        showNotification('success', 'Item removed from cart');
    }
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = async (productId: string) => {
    if (status !== 'authenticated') {
      showNotification('warning', 'Please login first to manage your wishlist');
      return;
    }
    // Optimistic update
    const isAdded = !wishlist.includes(productId);
    setWishlist(prev => isAdded ? [...prev, productId] : prev.filter(id => id !== productId));

    try {
        let res;
        if (isAdded) {
            res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });
        } else {
            res = await fetch(`/api/wishlist?productId=${productId}`, { method: 'DELETE' });
        }

        if (!res.ok) {
            const errorData = await res.json();
            showNotification('error', errorData.error || 'Failed to update wishlist');
            fetchWishlist(); // Revert
        } else {
            showNotification('success', isAdded ? 'Added to wishlist!' : 'Removed from wishlist');
        }
    } catch (e) {
        console.error("Wishlist toggle failed", e);
        showNotification('error', 'Failed to update wishlist. Please try again.');
        fetchWishlist(); // Revert
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
      showNotification('success', 'Email notification generated successfully');
    } catch (e) {
      console.error("Email generation failed", e);
      showNotification('error', 'Failed to generate email notification');
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
                const data = await res.json();
                showNotification('success', 'Order placed successfully!');
            } else {
                const errorData = await res.json();
                showNotification('error', errorData.error || 'Failed to place order');
                return;
            }
        } catch (e) {
            console.error("Place order failed", e);
            showNotification('error', 'Failed to place order. Please try again.');
            return;
        }
    } else {
        showNotification('error', 'You must be logged in to place an order');
        return;
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
    return recentlyViewed
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  };

  const getSearchResults = () => {
    // This function is now deprecated as search is handled by the API
    // Keeping for backward compatibility
    return [];
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