
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HERO_IMAGE } from '../constants';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-[90vh] overflow-hidden bg-black">
      {/* Optimized Background Image */}
      <div className="absolute inset-0 w-full h-full opacity-60">
        <Image
          src={HERO_IMAGE}
          alt="Luxury leather craftsmanship"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Gradient Overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Grain texture */}
      <div className="absolute inset-0 grain-overlay opacity-40" />

      {/* Content */}
      <div className="relative h-full min-h-[75vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
        <div className="opacity-0 animate-fade-in-up max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-[#D4A574]/30 rounded-full mb-5 animate-slide-in-top">
            <div className="w-1.5 h-1.5 bg-[#D4A574] rounded-full animate-pulse" />
            <span className="text-[#D4A574] font-semibold tracking-[0.2em] text-[10px] uppercase">
              Est. 1985 · Karachi Atelier
            </span>
          </div>

          {/* Main Heading - Significantly Reduced */}
          <h1 className="text-white font-serif text-2xl md:text-3xl lg:text-5xl font-bold leading-tight tracking-tight mb-4 hero-text-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Crafted Leather, <span className="text-[#D4A574]">Timeless Style</span>
          </h1>

          {/* Subtitle - Compact and Elegant */}
          <p className="text-neutral-300 text-sm font-light max-w-md mx-auto mb-6 hero-text-shadow leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Hand-stitched luxury for the modern professional who values heritage and durability.
          </p>

          {/* CTA Buttons - Refined and Compact */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link href="/shop">
              <button className="group relative overflow-hidden bg-[#D4A574] text-[#2C2416] hover:bg-white hover:text-[#2C2416] px-6 py-2.5 rounded-lg font-bold text-xs tracking-wider uppercase transition-all duration-500 shadow-xl border border-[#D4A574] hover:border-white cursor-pointer w-full sm:w-auto transform hover:scale-105">
                <span className="relative z-10">Shop Collection</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </button>
            </Link>
            <Link href="/about">
              <button className="group px-6 py-2.5 rounded-lg font-bold text-xs tracking-wider uppercase transition-all duration-300 border border-white/40 text-white hover:bg-white hover:text-[#2C2416] cursor-pointer w-full sm:w-auto backdrop-blur-sm transform hover:scale-105">
                Our Craft
              </button>
            </Link>
          </div>

          {/* Scroll Indicator - Centered */}
          <div className="mt-12 flex justify-center animate-bounce">
            <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1.5">
              <div className="w-0.5 h-1.5 bg-[#D4A574] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
