
import React from 'react';
import { HERO_IMAGE } from '../constants.ts';

const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-[70vh] min-h-[600px] overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat animate-fade-in"
        style={{ backgroundImage: `url("${HERO_IMAGE}")` }}
      />
      <div className="absolute inset-0 bg-black/20 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-left">
        <div className="opacity-0 animate-fade-in-up max-w-3xl">
          <span className="inline-block text-primary font-medium tracking-[0.2em] text-sm uppercase mb-4 pl-1">Est. 1985</span>
          <h1 className="text-white font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mb-6 hero-text-shadow">
            Crafted Leather,<br/>Timeless Style
          </h1>
          <p className="text-ivory/90 text-lg md:text-xl font-light max-w-xl mb-10 hero-text-shadow leading-relaxed">
            Experience the epitome of luxury with our hand-stitched collection. Designed for the modern professional who values heritage and durability.
          </p>
          <button className="btn-hover bg-primary text-secondary hover:bg-white hover:text-secondary px-10 py-4 rounded-sm font-bold text-sm tracking-[0.15em] uppercase transition-all duration-300 shadow-xl border border-primary hover:border-white">
            Shop Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
