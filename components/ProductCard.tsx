
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FiStar, FiHeart, FiPlus, FiCheck, FiLoader } from 'react-icons/fi';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isWishlisted: boolean;
  isInCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  isInCart
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Give visual feedback before navigation
    setTimeout(() => {
      onClick();
    }, 150);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist();
  };

  return (
    <div
      className="group aged-leather-card rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full relative"
      onClick={handleClick}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center">
          <FiLoader className="animate-spin text-5xl text-[#8B4513]" />
        </div>
      )}

      {/* Subtle leather grain overlay */}
      <div className="absolute inset-0 leather-grain opacity-20 pointer-events-none z-[1]" />

      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5E6D3]">
        <Image
          alt={product.name}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          src={product.imageUrl || (product as any).image_url || ''}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={85}
        />
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 transition-all border border-[#D4A574]/20 ${
            isWishlisted ? 'text-[#8B4513]' : 'text-[#2C2416] hover:text-[#8B4513]'
          }`}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <FiHeart className={`text-xl ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-[#F5E6D3]/30 relative z-[2]">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[#2C2416] font-serif text-lg font-bold leading-tight group-hover:text-[#8B4513] transition-colors flex-1">
            {product.name}
          </h3>
        </div>

        <p className="text-[9px] text-[#8B4513] uppercase tracking-[0.2em] font-bold mb-2 flex items-center gap-1">
          <span className="w-2 h-px bg-[#8B4513]" />
          {(product.material || 'Full-grain · Hand-stitched')}
        </p>

        {(product.stock !== undefined && product.stock > 0 && product.stock <= 5) && (
          <span className="inline-block w-fit mb-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#8B4513] bg-[#D4A574]/20 border border-[#D4A574]/40 rounded">
            Limited run
          </span>
        )}

        <div className="flex items-center gap-1 mb-3" role="group" aria-label={`Rating: ${product.rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`text-sm ${i < product.rating ? 'text-[#B87333] fill-current' : 'text-[#D4A574]'}`}
              aria-hidden="true"
            />
          ))}
          <span className="text-xs text-[#8B4513] ml-1 font-medium" aria-label={`${product.reviewCount} reviews`}>
            ({product.reviewCount})
          </span>
          <span className="sr-only">{product.rating} out of 5 stars</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#D4A574]/20">
          <p className="text-[#8B4513] font-bold text-xl font-serif">${product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-lg transition-all duration-300 transform active:scale-90 shadow-sm border ${
              isInCart
                ? 'bg-[#8B4513] text-white border-[#8B4513]'
                : 'bg-white text-[#8B4513] border-[#D4A574]/30 hover:bg-[#8B4513] hover:text-white hover:border-[#8B4513]'
            }`}
            aria-label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
          >
            {isInCart ? <FiCheck className="text-xl" /> : <FiPlus className="text-xl" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
