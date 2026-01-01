'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiStar, FiHeart, FiChevronRight, FiChevronDown, FiShoppingBag, FiCheck, FiLoader, FiSearch } from 'react-icons/fi';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ShopPageProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds: string[];
  isProductInCart: (productId: string) => boolean;
}

const ShopPage: React.FC<ShopPageProps> = ({
  products,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  isProductInCart
}) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('0');
  const [maxPrice, setMaxPrice] = useState<string>('1200');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    // Initialize filtered products with all products
    setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    let result = [...products];

    // Filter by category if any is selected
    if (activeCategory.length > 0) {
      result = result.filter(product =>
        activeCategory.some(cat => product.category.toLowerCase().includes(cat.toLowerCase()))
      );
    }

    // Filter by price range
    result = result.filter(product =>
      product.price >= Number(minPrice) && product.price <= Number(maxPrice)
    );

    // Sort products
    switch (sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'top-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        // Assuming products are already sorted by creation date from API
        break;
    }

    setFilteredProducts(result);
  }, [products, activeCategory, minPrice, maxPrice, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setActiveCategory(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleApplyFilters = () => {
    // Filters are applied automatically via useEffect
  };

  const handleClearFilters = () => {
    setActiveCategory([]);
    setMinPrice('0');
    setMaxPrice('1200');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link href="/" className="text-sm font-medium text-taupe hover:text-primary">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <FiChevronRight className="text-taupe text-sm mx-1" />
              <Link href="/shop" className="text-sm font-medium text-taupe hover:text-primary">Shop</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <FiChevronRight className="text-taupe text-sm mx-1" />
              <span className="text-sm font-medium text-secondary">Leather Goods</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-serif font-bold text-secondary mb-3">Shop Leather Goods</h2>
        <p className="text-grey text-lg font-light max-w-2xl leading-relaxed">
          Explore our premium collection of handcrafted essentials designed for longevity and style.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-28 space-y-8 bg-white/50 p-8 rounded-xl border border-secondary/10 shadow-soft">
            <div className="flex items-center justify-between border-b border-secondary/10 pb-5">
              <h3 className="text-lg font-bold text-secondary uppercase tracking-widest">Filters</h3>
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Category */}
            <div className="space-y-4">
              <h4 className="font-bold text-secondary text-sm uppercase tracking-widest">Category</h4>
              <div className="space-y-3">
                {['Men\'s Purses', 'Women\'s Purses', 'Jackets', 'Belts', 'Accessories', 'Footwear'].map(cat => (
                  <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeCategory.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="form-checkbox h-5 w-5 text-primary border-taupe rounded focus:ring-primary/20 cursor-pointer"
                    />
                    <span className={`text-sm transition-colors ${activeCategory.includes(cat) ? 'text-secondary font-bold' : 'text-grey group-hover:text-secondary'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-secondary/10" />

            {/* Price Range */}
            <div className="space-y-5">
              <h4 className="font-bold text-secondary text-sm uppercase tracking-widest">Price Range</h4>
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grey text-xs">$</span>
                  <input
                    className="w-full pl-6 pr-2 py-2 text-sm border border-taupe/30 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-secondary bg-transparent"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <span className="text-taupe">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grey text-xs">$</span>
                  <input
                    className="w-full pl-6 pr-2 py-2 text-sm border border-taupe/30 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-secondary bg-transparent"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <hr className="border-secondary/10" />

            {/* Colors */}
            <div className="space-y-4">
              <h4 className="font-bold text-secondary text-sm uppercase tracking-widest">Color</h4>
              <div className="flex flex-wrap gap-3">
                {[{
                  name: 'Espresso',
                  hex: '#3E2723'
                },
                {
                  name: 'Black',
                  hex: '#000000'
                },
                {
                  name: 'Tan',
                  hex: '#C19A6B'
                },
                {
                  name: 'Burgundy',
                  hex: '#800020'
                },
                {
                  name: 'Cream',
                  hex: '#F5F5DC'
                },
                {
                  name: 'Brown',
                  hex: '#8B4513'
                }].map(color => (
                  <button
                    key={color.name}
                    className="w-9 h-9 rounded-full border border-secondary/10 ring-2 ring-offset-2 ring-transparent hover:ring-primary focus:ring-primary transition-all shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <hr className="border-secondary/10" />

            {/* Rating */}
            <div className="space-y-4">
              <h4 className="font-bold text-secondary text-sm uppercase tracking-widest">Rating</h4>
              <div className="space-y-3">
                {[5, 4, 3].map(stars => (
                  <label key={stars} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-primary border-taupe rounded focus:ring-primary/20 cursor-pointer" />
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`text-lg ${i < stars ? 'fill-current' : 'text-taupe'}`} />
                      ))}
                      {stars === 4 && <span className="text-xs text-grey ml-2 font-bold uppercase tracking-wider">& Up</span>}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyFilters}
              className="w-full bg-secondary hover:bg-primary text-white font-bold py-4 rounded-lg transition-all shadow-lg uppercase tracking-widest text-xs active:scale-95"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-white p-5 rounded-xl border border-secondary/10 shadow-soft">
            <p className="text-grey text-sm font-medium mb-4 sm:mb-0 uppercase tracking-widest">
              Showing <span className="text-secondary font-bold">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-grey font-bold uppercase tracking-widest hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-background-light border border-secondary/10 text-secondary text-sm font-bold rounded-lg pl-5 pr-12 py-3 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer uppercase tracking-widest"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="top-rated">Top Rated</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-secondary">
                  <FiChevronDown />
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onProductClick(product)}
                  onAddToCart={() => onAddToCart(product)}
                  onToggleWishlist={() => onToggleWishlist(product.id)}
                  isWishlisted={wishlistIds.includes(product.id)}
                  isInCart={isProductInCart(product.id)}
                />
              ))}
            </div>
          ) : (

            <div className="text-center py-20 bg-ivory/30 rounded-3xl border border-taupe/10">
              <FiSearch className="text-6xl text-taupe/40 mx-auto mb-6" />
              <h3 className="text-2xl font-serif font-bold text-secondary mb-4">No products found</h3>
              <p className="text-grey mb-10 max-w-sm mx-auto font-light">We couldn't find any products matching your criteria. Try adjusting your filters.</p>
              <button
                onClick={handleClearFilters}
                className="bg-secondary text-white px-10 py-4 rounded-lg font-bold hover:bg-primary transition-all shadow-lg uppercase tracking-widest text-xs"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-16 flex flex-col items-center gap-6">
            <p className="text-[10px] text-grey font-bold uppercase tracking-[0.3em]">Showing {filteredProducts.length} products</p>
            <div className="w-64 h-1 bg-secondary/5 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary rounded-full"></div>
            </div>
            <button className="px-12 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all font-bold text-xs uppercase tracking-[0.2em] shadow-sm active:scale-95">
              Load More Products
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShopPage;