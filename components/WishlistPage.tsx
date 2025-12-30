'use client';

import React from 'react';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiX, FiStar, FiPlus } from 'react-icons/fi';
import { FEATURED_PRODUCTS, BEST_SELLERS } from '@/constants';
import { Product } from '@/types';

interface WishlistPageProps {
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onContinueShopping: () => void;
  onClearAll: () => void;
  onProductClick: (product: Product) => void;
  isProductInCart: (id: string) => boolean;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ 
  wishlistIds, 
  onToggleWishlist, 
  onAddToCart, 
  onContinueShopping,
  onClearAll,
  onProductClick,
  isProductInCart
}) => {
  const allProducts = [...FEATURED_PRODUCTS, ...BEST_SELLERS];
  const items = allProducts.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-taupe/30 pb-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-secondary">My Wishlist</h1>
          <p className="mt-2 text-sm text-grey font-medium tracking-wide">{items.length} items saved</p>
        </div>
        {items.length > 0 && (
          <button 
            onClick={onClearAll}
            className="group flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-secondary shadow-sm ring-1 ring-taupe/30 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
          >
            <FiTrash2 className="text-lg" /> Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-32 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-ivory mb-6">
            <FiPlus className="text-3xl text-taupe" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-secondary mb-4">Your wishlist is empty</h3>
          <p className="text-grey mb-10 max-w-sm mx-auto">Discover our latest handcrafted collections and save your favorites here.</p>
          <button 
            onClick={onContinueShopping}
            className="bg-secondary text-white px-10 py-4 rounded-lg font-bold hover:bg-primary transition-all shadow-lg active:scale-95"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <div key={product.id} className="group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-secondary/5">
              <div className="relative aspect-[4/5] overflow-hidden cursor-pointer" onClick={() => onProductClick(product)}>
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-secondary shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1 text-primary mb-2">
                  <FiStar className="fill-current" />
                  <span className="text-xs font-bold text-grey/60 ml-1">{product.rating.toFixed(1)}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-secondary mb-1 truncate cursor-pointer" onClick={() => onProductClick(product)}>{product.name}</h3>
                <p className="text-sm text-grey mb-6">{product.category}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-bold text-secondary">${product.price.toFixed(2)}</span>
                  <button 
                    onClick={() => onAddToCart(product)}
                    className={`h-11 px-5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                      isProductInCart(product.id) 
                        ? 'bg-secondary text-white' 
                        : 'bg-primary text-white hover:bg-secondary'
                    }`}
                  >
                    <FiShoppingBag /> {isProductInCart(product.id) ? 'Added' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-taupe/30 p-10 text-center hover:border-primary hover:bg-white/50 transition-all cursor-pointer group" onClick={onContinueShopping}>
            <div className="mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-ivory text-taupe group-hover:bg-primary group-hover:text-white transition-all">
              <FiPlus className="text-4xl" />
            </div>
            <h3 className="font-serif text-xl font-bold text-secondary mb-2">Add More</h3>
            <p className="text-sm text-grey/60">Continue browsing our collections</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;