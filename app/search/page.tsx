'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiSearch, FiLoader } from 'react-icons/fi';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const {
    toggleCart,
    toggleWishlist,
    wishlist,
    isProductInCart,
  } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    } else {
      setIsLoading(false);
    }
  }, [query]);

  const fetchSearchResults = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

      if (res.ok) {
        const data = await res.json();
        const mappedProducts: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price) || 0,
          rating: parseFloat(p.rating) || 0,
          reviewCount: p.review_count || 0,
          imageUrl: p.image_url || '',
          category: p.category || '',
          description: p.description || '',
          material: 'Full-grain · Hand-stitched',
        }));
        setProducts(mappedProducts);
      } else {
        setError('Failed to fetch search results');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch search results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-secondary mb-4">
          Search Results
        </h1>
        {query && (
          <p className="text-grey text-lg">
            Showing results for <span className="font-bold text-secondary">"{query}"</span>
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-4 mb-8">
          {error}
        </div>
      )}

      {!query ? (
        <div className="flex flex-col items-center justify-center py-20 bg-ivory/30 rounded-3xl border border-taupe/10">
          <FiSearch className="text-6xl text-taupe/40 mb-6" />
          <h3 className="text-2xl font-serif font-bold text-secondary mb-4">No Search Query</h3>
          <p className="text-grey mb-10 max-w-sm mx-auto text-center">
            Please enter a search term to find products.
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-ivory/30 rounded-3xl border border-taupe/10">
          <FiSearch className="text-6xl text-taupe/40 mb-6" />
          <h3 className="text-2xl font-serif font-bold text-secondary mb-4">No Results Found</h3>
          <p className="text-grey mb-10 max-w-sm mx-auto text-center">
            We could not find any products matching "{query}". Try different keywords or browse our catalog.
          </p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-secondary text-white px-10 py-4 rounded-xl font-bold hover:bg-primary transition-all shadow-lg uppercase tracking-widest text-xs"
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <>
          <p className="text-grey mb-8 text-sm uppercase tracking-widest">
            Found <span className="text-secondary font-bold">{products.length}</span> {products.length === 1 ? 'product' : 'products'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
                onAddToCart={() => toggleCart(product)}
                onToggleWishlist={() => toggleWishlist(product.id)}
                isWishlisted={wishlist.includes(product.id)}
                isInCart={isProductInCart(product.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="animate-spin text-4xl text-primary" />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
