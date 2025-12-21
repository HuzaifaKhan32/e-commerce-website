
import React from 'react';
import { FiStar, FiHeart, FiPlus, FiCheck, FiTrash2 } from 'react-icons/fi';
import { Product } from '../types.ts';

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
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full transform hover:-translate-y-2 border border-secondary/5"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
          src={product.imageUrl} 
        />
        <button 
          onClick={handleWishlist}
          className={`absolute top-4 right-4 p-2.5 bg-white/95 rounded-full shadow-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 transition-colors ${
            isWishlisted ? 'text-primary' : 'text-secondary hover:text-primary'
          }`}
        >
          <FiHeart className={`text-2xl ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-secondary font-serif text-lg font-bold leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
        </div>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <FiStar 
              key={i} 
              className={`text-sm ${i < product.rating ? 'text-primary fill-current' : 'text-taupe'}`} 
            />
          ))}
          <span className="text-xs text-grey ml-1 font-medium">({product.reviewCount})</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-primary font-bold text-xl">${product.price.toFixed(2)}</p>
          <button 
            onClick={handleAddToCart}
            className={`p-3 rounded-full transition-all duration-300 transform active:scale-90 shadow-sm ${
              isInCart ? 'bg-secondary text-white' : 'bg-ivory text-secondary hover:bg-secondary hover:text-white'
            }`}
          >
            {isInCart ? <FiCheck className="text-2xl" /> : <FiPlus className="text-2xl" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
