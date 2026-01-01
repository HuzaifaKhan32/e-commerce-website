'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import CollectionCard from '@/components/CollectionCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { useStore } from '@/context/StoreContext';
import { Product, Collection } from '@/types';
import { FiArrowRight, FiRotateCcw, FiLoader } from 'react-icons/fi';

export default function HomePage() {
  const router = useRouter();
  const {
    toggleCart,
    toggleWishlist,
    wishlist,
    isProductInCart,
    recentlyViewed,
    clearRecentlyViewed,
    getRecentlyViewedProducts,
    addToRecentlyViewed
  } = useStore();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`${response.status}: ${errorData.error || 'Failed to fetch products'}`);
        }
        const allProducts = await response.json();

        // Filter featured products (products with 'Featured' in category)
        const featured = allProducts.filter((p: Product) => p.category.toLowerCase().includes('featured'));
        setFeaturedProducts(featured.slice(0, 4)); // Limit to 4

        // Filter best sellers (products with 'Best Seller' in category)
        const bestSellersList = allProducts.filter((p: Product) => p.category.toLowerCase().includes('best seller'));
        setBestSellers(bestSellersList.slice(0, 4)); // Limit to 4

        // If no products found, set a more descriptive error or just continue with empty arrays
        if (allProducts.length === 0) {
          console.warn('No products found in database. Using empty arrays.');
        }
      } catch (err: any) {
        console.error('Detailed error fetching products:', err);
        setError(`Error fetching products: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCollections = async () => {
      try {
        // In a real implementation, collections would be stored in the database
        // For now, we'll use hardcoded collections but in a real app, these would come from an API
        const hardcodedCollections: Collection[] = [
          {
            id: 'm1',
            title: "Men's Collection",
            description: "Rugged durability meets refined style for the modern gentleman.",
            imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800'
          },
          {
            id: 'w1',
            title: "Women's Collection",
            description: "Elegant designs crafted to elevate your everyday essentials.",
            imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
          },
          {
            id: 'p1',
            title: "Premium Line",
            description: "Exquisite materials and limited edition craftsmanship.",
            imageUrl: 'https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=800'
          }
        ];
        setCollections(hardcodedCollections);
      } catch (err) {
        console.error('Error fetching collections:', err);
      }
    };

    fetchProducts();
    fetchCollections();
  }, []);

  const navigateToProduct = (product: Product) => {
    addToRecentlyViewed(product.id);
    router.push(`/product/${product.id}`);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-secondary mb-4">Error Loading Products</h2>
          <p className="text-grey mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary transition-all shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
          <FiLoader className="animate-spin text-5xl text-primary mb-4" />
          <p className="text-taupe font-bold tracking-widest uppercase text-[10px]">Loading Heritage Collection</p>
        </div>
      ) : (
        <>
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
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => navigateToProduct(product)}
                    onAddToCart={() => toggleCart(product)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    isWishlisted={wishlist.includes(product.id)}
                    isInCart={isProductInCart(product.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-secondary font-bold">No featured products available at the moment.</p>
                </div>
              )}
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
                {collections.map((collection, index) => (
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
                onClick={() => router.push('/shop')}
              >
                View All Collection
                <FiArrowRight className="text-xl group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {bestSellers.length > 0 ? (
                bestSellers.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => navigateToProduct(product)}
                    onAddToCart={() => toggleCart(product)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    isWishlisted={wishlist.includes(product.id)}
                    isInCart={isProductInCart(product.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-secondary font-bold">No best sellers available at the moment.</p>
                </div>
              )}
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
                    onClick={clearRecentlyViewed}
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
                      onToggleWishlist={() => toggleWishlist(product.id)}
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
    </>
  );
}
