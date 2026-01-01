import React, { useState, useEffect } from 'react';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiX, FiStar, FiPlus, FiLoader } from 'react-icons/fi';
import { Product } from '@/types';
import ProductCard from './ProductCard';

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
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistIds.length === 0) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const allProductsData = await res.json();
          const mapped: Product[] = allProductsData.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price) || 0,
            rating: p.rating || 5,
            reviewCount: p.review_count || 0,
            imageUrl: p.image_url || '',
            category: p.category || 'Leather Goods'
          }));
          
          const filtered = mapped.filter(p => wishlistIds.includes(p.id));
          setItems(filtered);
        }
      } catch (e) {
        console.error("Failed to fetch wishlist products", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistIds]);

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

      {isLoading ? (
        <div className="py-20 text-center">
          <FiLoader className="animate-spin text-4xl text-primary mx-auto" />
        </div>
      ) : items.length === 0 ? (
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
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick(product)}
              onAddToCart={() => onAddToCart(product)}
              onToggleWishlist={() => onToggleWishlist(product.id)}
              isWishlisted={true}
              isInCart={isProductInCart(product.id)}
            />
          ))}

          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-taupe/30 p-10 text-center hover:border-primary hover:bg-white/50 transition-all cursor-pointer group h-full" onClick={onContinueShopping}>
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