'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiStar, FiFilter, FiX, FiChevronRight, FiChevronDown, FiShoppingBag, FiCheck, FiLoader, FiSearch } from 'react-icons/fi';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const scrollPositionRef = useRef(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
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
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, activeCategory, minPrice, maxPrice, sortBy]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Show max 5 page buttons

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryToggle = (category: string) => {
    setActiveCategory(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    document.body.style.overflow = '';
  };

  const handleClearFilters = () => {
    setActiveCategory([]);
    setMinPrice('0');
    setMaxPrice('1200');
    setSortBy('newest');
  };

  // Close filter sidebar when pressing back button
  useEffect(() => {
    if (!isFilterOpen) return;

    window.history.pushState({ filterOpen: true }, '');

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsFilterOpen(false);
      
      // Restore scroll position
      const scrollY = scrollPositionRef.current;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isFilterOpen]);

  const openFilterSidebar = () => {
    // Save current scroll position
    scrollPositionRef.current = window.scrollY;
    
    setIsFilterOpen(true);
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.width = '100%';
  };

  const closeFilterSidebar = () => {
    setIsFilterOpen(false);
    
    // Restore scroll position and body styles
    const scrollY = scrollPositionRef.current;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  };

  const activeFilterCount = activeCategory.length + (minPrice !== '0' || maxPrice !== '1200' ? 1 : 0);

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

      {/* Header with Filter Button */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-4xl font-serif font-bold text-secondary mb-3">Shop Leather Goods</h2>
            <p className="text-grey text-lg font-light max-w-2xl leading-relaxed">
              Explore our premium collection of handcrafted essentials designed for longevity and style.
            </p>
          </div>
          <button
            onClick={openFilterSidebar}
            className="flex items-center justify-center gap-3 bg-secondary hover:bg-primary text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95 shrink-0"
          >
            <FiFilter className="text-xl" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-secondary text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product Grid - Full Width */}
        <section className="flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-white p-5 rounded-xl border border-secondary/10 shadow-soft">
            <p className="text-grey text-sm font-medium mb-4 sm:mb-0 uppercase tracking-widest">
              Showing <span className="text-secondary font-bold">{startIndex + 1}-{Math.min(endIndex, filteredProducts.length)}</span> of <span className="text-secondary font-bold">{filteredProducts.length}</span> products
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
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {currentProducts.map((product) => (
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
          {totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center gap-8">
              {/* Pagination Info */}
              <p className="text-[10px] text-grey font-bold uppercase tracking-[0.3em]">
                Page {currentPage} of {totalPages}
              </p>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all shadow-sm ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-2 border-secondary text-secondary hover:bg-secondary hover:text-white active:scale-95'
                  }`}
                  aria-label="Previous page"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center gap-2">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 text-grey font-bold">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`w-12 h-12 rounded-lg font-bold text-sm transition-all shadow-sm ${
                          currentPage === page
                            ? 'bg-primary text-white border-2 border-primary scale-110'
                            : 'bg-white border-2 border-secondary/20 text-secondary hover:border-primary hover:text-primary active:scale-95'
                        }`}
                        aria-label={`Go to page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                {/* Mobile: Current Page Display */}
                <div className="sm:hidden px-4 py-3 bg-white border-2 border-primary rounded-lg">
                  <span className="text-primary font-bold text-sm">{currentPage} / {totalPages}</span>
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all shadow-sm ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-2 border-secondary text-secondary hover:bg-secondary hover:text-white active:scale-95'
                  }`}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs">
                <div className="w-full h-2 bg-secondary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(currentPage / totalPages) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Filter Sidebar Drawer */}
      {isFilterOpen && (
        <>
          {/* Backdrop - Dark blurred overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998] animate-fade-in"
            onClick={closeFilterSidebar}
            aria-hidden="true"
          />

          {/* Sidebar Container */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[9999] shadow-2xl animate-slide-in flex flex-col">
            {/* Header - Fixed at top */}
            <div className="shrink-0 bg-white border-b border-secondary/10 px-6 py-6 flex items-center justify-between shadow-md">
              <h3 className="text-lg font-bold text-secondary uppercase tracking-widest">Filters</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={closeFilterSidebar}
                  className="p-3 text-taupe hover:text-primary transition-colors bg-ivory rounded-full shadow-sm hover:shadow-md"
                  aria-label="Close filters"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Category */}
              <div className="space-y-4">
                <h4 className="font-bold text-secondary text-sm uppercase tracking-widest">Category</h4>
                <div className="space-y-3">
                  {["Men's Purses", "Women's Purses", 'Jackets', 'Belts', 'Accessories', 'Footwear'].map(cat => (
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
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default ShopPage;
