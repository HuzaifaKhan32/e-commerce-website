'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface CollectionCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  productCount: number;
  category: string;
}

const collections: CollectionCategory[] = [
  {
    id: 'purses',
    name: 'Purses',
    description: 'Elegant leather purses crafted for everyday sophistication',
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800',
    productCount: 24,
    category: 'Purses'
  },
  {
    id: 'wallets',
    name: 'Wallets',
    description: 'Slim, durable wallets that age beautifully with time',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    productCount: 18,
    category: 'Wallets'
  },
  {
    id: 'bags',
    name: 'Bags',
    description: 'Premium leather bags built for life\'s adventures',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    productCount: 32,
    category: 'Bags'
  },
  {
    id: 'jackets',
    name: 'Jackets',
    description: 'Handcrafted leather jackets with timeless appeal',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
    productCount: 15,
    category: 'Jackets'
  }
];

const ModernCollectionGrid: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-2 block">
          Discover Our Collections
        </span>
        <h2 className="text-secondary font-serif text-3xl md:text-4xl font-bold mb-3 tracking-tight">
          Crafted for Every Need
        </h2>
        <p className="text-grey max-w-xl mx-auto font-light leading-relaxed text-sm">
          Explore our signature collections of premium leather goods.
        </p>
      </div>

      {/* Compact 2x2 Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 max-w-4xl mx-auto">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/shop?category=${encodeURIComponent(collection.category)}`}
            className="group relative overflow-hidden rounded-lg bg-ivory/30 border border-taupe/10 hover:border-primary/30 transition-all duration-500 hover:shadow-xl"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              {/* Image */}
              <img
                src={collection.imageUrl}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent group-hover:from-secondary/95 transition-all duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <div className="transform transition-all duration-500 group-hover:translate-y-[-4px]">
                  {/* Product Count Badge */}
                  <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-0.5 mb-2">
                    <span className="text-white text-[10px] font-bold tracking-widest uppercase">
                      {collection.productCount}
                    </span>
                  </div>

                  {/* Collection Name */}
                  <h3 className="text-white font-serif text-base md:text-lg font-bold mb-1 tracking-tight">
                    {collection.name}
                  </h3>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-white font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span>Shop</span>
                    <FiArrowRight className="text-xs" />
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ModernCollectionGrid;
