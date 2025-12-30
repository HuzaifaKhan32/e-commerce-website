'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiStar, FiHeart, FiChevronRight, FiChevronDown, FiShoppingBag, FiCheck } from 'react-icons/fi';
import { FEATURED_PRODUCTS, BEST_SELLERS } from '@/constants';
import { Product } from '@/types';

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
  const [activeCategory, setActiveCategory] = useState<string[]>(['Women\'s Purses']);
  const allProducts = products;

  const handleCategoryToggle = (category: string) => {
    setActiveCategory(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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
              <button className="text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest transition-colors">Clear All</button>
            </div>

            {/* Category */}
            <div className="space-y-4">
              <h4 className="font-bold text-secondary text-sm uppercase tracking-widest">Category</h4>
              <div className="space-y-3">
                {['Men\'s Purses', 'Women\'s Purses', 'Jackets', 'Belts'].map(cat => (
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
                  <input className="w-full pl-6 pr-2 py-2 text-sm border border-taupe/30 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-secondary bg-transparent" type="number" defaultValue={50} />
                </div>
                <span className="text-taupe">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grey text-xs">$</span>
                  <input className="w-full pl-6 pr-2 py-2 text-sm border border-taupe/30 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-secondary bg-transparent" type="number" defaultValue={1200} />
                </div>
              </div>
              <div className="relative pt-2">
                <div className="h-1 bg-taupe/20 rounded-full w-full absolute top-2"></div>
                <div className="h-1 bg-primary rounded-full absolute top-2 left-[10%] right-[30%]"></div>
                <div className="flex justify-between relative">
                  <div className="w-4 h-4 bg-primary border-2 border-white rounded-full absolute -top-1.5 left-[10%] cursor-pointer hover:scale-125 transition-transform shadow-sm"></div>
                  <div className="w-4 h-4 bg-primary border-2 border-white rounded-full absolute -top-1.5 right-[30%] cursor-pointer hover:scale-125 transition-transform shadow-sm"></div>
                </div>
              </div>
            </div>

            <hr className="border-secondary/10" />

            {/* Colors */}
            <div className="space-y-4">
              <h4 className="font-bold text-secondary text-sm uppercase tracking-widest">Color</h4>
              <div className="flex flex-wrap gap-3">
                {[ 
                  { name: 'Espresso', hex: '#3E2723' },
                  { name: 'Black', hex: '#000000' },
                  { name: 'Tan', hex: '#C19A6B' },
                  { name: 'Burgundy', hex: '#800020' },
                  { name: 'Cream', hex: '#F5F5DC' }
                ].map(color => (
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
                {[5, 4].map(stars => (
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

            <button className="w-full bg-secondary hover:bg-primary text-white font-bold py-4 rounded-lg transition-all shadow-lg uppercase tracking-widest text-xs active:scale-95">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-white p-5 rounded-xl border border-secondary/10 shadow-soft">
            <p className="text-grey text-sm font-medium mb-4 sm:mb-0 uppercase tracking-widest">
              Showing <span className="text-secondary font-bold">{allProducts.length}</span> products
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-grey font-bold uppercase tracking-widest hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select className="appearance-none bg-background-light border border-secondary/10 text-secondary text-sm font-bold rounded-lg pl-5 pr-12 py-3 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer uppercase tracking-widest">
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-secondary">
                  <FiChevronDown />
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {allProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => onProductClick(product)}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-secondary/10 hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-1000" 
                  />
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary/95 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm shadow-md">
                      {product.id === '1' ? 'New' : product.id === '4' ? 'Best Seller' : 'Premium'}
                    </span>
                  </div>
                  
                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center bg-white/10 backdrop-blur-md">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className={`${isProductInCart(product.id) ? 'bg-secondary' : 'bg-white hover:bg-primary'} text-secondary ${isProductInCart(product.id) ? 'text-white' : 'hover:text-white'} px-8 py-3 rounded-lg shadow-xl text-xs font-bold uppercase tracking-widest transition-all w-full flex items-center justify-center gap-2 active:scale-95`}
                    >
                      {isProductInCart(product.id) ? <><FiCheck className="text-lg" /> Added</> : 'Quick Add'}
                    </button>
                  </div>

                  {/* Wishlist Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    className={`absolute top-4 right-4 p-3 bg-white/95 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-500 transition-all ${ 
                      wishlistIds.includes(product.id) ? 'text-primary' : 'text-grey hover:text-primary'
                    }`}
                  >
                    <FiHeart className={`text-xl ${wishlistIds.includes(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-secondary font-serif text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-primary font-bold text-xl ml-4">${product.price}</p>
                  </div>
                  <p className="text-grey/60 text-xs font-bold uppercase tracking-widest mb-6">Italian Full-Grain Leather</p>
                  
                  <div className="mt-auto pt-6 border-t border-secondary/5 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <FiStar className="text-primary fill-current text-sm" />
                      <span className="text-sm text-secondary font-bold tracking-tighter">{product.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-grey/50 font-bold ml-1 uppercase tracking-widest">({product.reviewCount})</span>
                    </div>
                    <FiShoppingBag className="text-secondary/20 text-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex flex-col items-center gap-6">
            <p className="text-[10px] text-grey font-bold uppercase tracking-[0.3em]">Showing {allProducts.length} products</p>
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