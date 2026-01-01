'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { FiSearch, FiLoader } from 'react-icons/fi';
import { Product } from '@/types';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const {
    toggleCart,
    toggleWishlist,
    wishlist,
    isProductInCart,
    addToRecentlyViewed
  } = useStore();

  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${response.status}: ${errorData.error || 'Failed to fetch search results'}`);
          }
          const data = await response.json();
          
          const mappedResults: Product[] = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            rating: p.rating || 5,
            reviewCount: p.review_count || 0,
            imageUrl: p.image_url || '',
            category: p.category || 'Leather Goods',
            description: p.description || ''
          }));
          
          setResults(mappedResults);

          // Log if no results found
          if (data.length === 0) {
            console.info('No search results found for query:', query);
          }
        } catch (err: any) {
          console.error('Detailed error fetching search results:', err);
          setError(`Error fetching search results: ${err.message || 'Unknown error'}`);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSearchResults();
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const navigateToProduct = (product: Product) => {
    addToRecentlyViewed(product.id);
    router.push(`/product/${product.id}`);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[60vh]">
      <div className="mb-16">
        <p className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-3">Search Results</p>
        <h2 className="text-secondary font-serif text-4xl font-bold tracking-tight">
          {results.length} matches for "{query}"
        </h2>
        <div className="h-1.5 w-24 bg-primary mt-6 rounded-full"></div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <FiLoader className="animate-spin text-4xl text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-ivory/30 rounded-3xl border border-taupe/10">
          <FiSearch className="text-6xl text-taupe/40 mx-auto mb-6" />
          <h3 className="text-2xl font-serif font-bold text-secondary mb-4">Search Error</h3>
          <p className="text-grey mb-10 max-w-sm mx-auto font-light">{error}</p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-secondary text-white px-10 py-4 rounded-lg font-bold hover:bg-primary transition-all shadow-lg uppercase tracking-widest text-xs"
          >
            Browse Full Shop
          </button>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {results.map((product) => (
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
      ) : (
        <div className="text-center py-20 bg-ivory/30 rounded-3xl border border-taupe/10">
          <FiSearch className="text-6xl text-taupe/40 mx-auto mb-6" />
          <h3 className="text-2xl font-serif font-bold text-secondary mb-4">No matching heritage found</h3>
          <p className="text-grey mb-10 max-w-sm mx-auto font-light">We couldn't find any artisanal goods matching your criteria. Try adjusting your search term.</p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-secondary text-white px-10 py-4 rounded-lg font-bold hover:bg-primary transition-all shadow-lg uppercase tracking-widest text-xs"
          >
            Browse Full Shop
          </button>
        </div>
      )}
    </section>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <FiLoader className="animate-spin text-6xl text-primary" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}