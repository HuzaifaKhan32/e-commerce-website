'use client';

import React, { useState, useEffect } from 'react';
import {
  FiStar,
  FiHeart,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiTruck,
  FiGlobe,
  FiAward,
  FiShare2,
  FiX,
  FiFacebook,
  FiTwitter,
  FiLink
} from 'react-icons/fi';
import { Product } from '@/types';
import { PLACEHOLDER_FEATURED_PRODUCTS, PLACEHOLDER_BEST_SELLERS } from '@/constants';
import ProductCard from './ProductCard';
import ProductReviews from './ProductReviews';

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, color: string) => void;
  onToggleWishlist: (id: string) => void;
  onProductClick: (product: Product) => void;
  wishlist: string[];
  isProductInCart: (id: string) => boolean;
  isWishlisted: boolean;
  isInCart: boolean;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  product, 
  relatedProducts,
  onBack, 
  onAddToCart, 
  onToggleWishlist, 
  onProductClick,
  wishlist,
  isProductInCart,
  isWishlisted,
  isInCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Espresso');
  const [mainImage, setMainImage] = useState(product.imageUrl);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    setMainImage(product.imageUrl);
    setQuantity(1);
    setSelectedColor('Espresso');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id, product.imageUrl]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const colors = [
    { name: 'Espresso', hex: '#3E2723' },
    { name: 'Midnight', hex: '#1e1a14' },
    { name: 'Cognac', hex: '#8D6E63' }
  ];

  const thumbnails = [
    product.imageUrl,
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=400"
  ];

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
        navigator.clipboard.writeText(window.location.href);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  // allProducts and relatedProducts filtering logic removed in favor of prop
  
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in relative">
      {/* Breadcrumbs */}
      <nav className="flex mb-10 text-sm tracking-wide text-taupe">
        <button onClick={onBack} className="hover:text-primary transition-colors uppercase font-bold tracking-widest text-[10px]">Home</button>
        <span className="mx-3">/</span>
        <span className="uppercase font-bold tracking-widest text-[10px]">{product.category || 'Leather Goods'}</span>
        <span className="mx-3">/</span>
        <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 mb-24">
        {/* Left Column: Gallery */}
        <div className="flex flex-col gap-8">
          <div 
            className="relative aspect-[4/3] bg-white rounded-xl overflow-hidden shadow-xl border border-secondary/5 group cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img 
              src={mainImage} 
              alt={product.name} 
              className={`w-full h-full object-cover transition-transform duration-500 ease-out ${isZoomed ? 'scale-150' : 'scale-100'}`} 
              style={{ 
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` 
              }}
            />
            {!isZoomed && (
              <>
                <button className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white text-secondary">
                  <FiChevronLeft className="text-3xl" />
                </button>
                <button className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white text-secondary">
                  <FiChevronRight className="text-3xl" />
                </button>
              </>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {thumbnails.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(img)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${mainImage === img ? 'border-primary shadow-md' : 'border-transparent shadow-sm grayscale hover:grayscale-0'}`}
              >
                <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Information */}
        <div className="flex flex-col">
          <div className="mb-8">
            <span className="inline-block text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-3">Premium Heritage Selection</span>
            <h1 className="font-serif text-5xl text-secondary font-bold leading-tight mb-4 tracking-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`text-2xl ${i < product.rating ? 'fill-current' : 'text-taupe'}`} />
                ))}
              </div>
              <span className="text-sm text-taupe font-medium underline cursor-pointer hover:text-primary transition-colors">({product.reviewCount} verified reviews)</span>
            </div>

            {product.stock !== undefined && (
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
              <span className="text-xl text-taupe line-through">${(product.price * 1.25).toFixed(2)}</span>
            </div>
          </div>

          <p className="text-grey leading-relaxed mb-10 text-lg border-b border-secondary/10 pb-10 font-light whitespace-pre-line">
            {product.description || "Handcrafted from full-grain Italian Vachetta leather that develops a unique patina over time. Meticulously stitched with bonded nylon thread and hand-painted edges for ultimate durability."}
          </p>

          {/* Color Selection */}
          <div className="mb-10">
            <h3 className="text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-4">Color: <span className="text-secondary font-bold capitalize ml-2">{selectedColor}</span></h3>
            <div className="flex gap-4">
              {colors.map((c) => (
                <button 
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-12 h-12 rounded-full border-2 transition-all p-0.5 transform hover:scale-110 shadow-sm ${selectedColor === c.name ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.name && <FiCheck className="text-white mx-auto text-2xl" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex flex-wrap gap-5 mb-12">
            <div className="flex items-center border border-secondary/20 rounded-lg h-16 w-40 bg-white shadow-sm overflow-hidden">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex-1 h-full text-grey hover:bg-ivory transition-colors text-3xl font-light"
              >-</button>
              <input 
                type="number" 
                value={quantity}
                readOnly
                className="w-12 text-center border-none bg-transparent text-secondary font-bold text-2xl focus:ring-0 p-0"
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="flex-1 h-full text-grey hover:bg-ivory transition-colors text-3xl font-light"
              >+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className={`flex-1 ${isInCart ? 'bg-primary' : 'bg-secondary'} text-white h-16 rounded-lg font-bold tracking-widest hover:opacity-95 transition-all duration-300 shadow-xl flex items-center justify-center gap-4 group active:scale-95 uppercase text-sm`}
            >
              {isInCart ? (
                <>
                  <FiCheck className="text-2xl" />
                  IN BAG
                </>
              ) : (
                <>
                  <FiShoppingBag className="text-2xl group-hover:scale-110 transition-transform" />
                  ADD TO BAG
                </>
              )}
            </button>
            
            <div className="flex gap-3">
              <button 
                onClick={() => onToggleWishlist(product.id)}
                className={`h-16 w-16 flex items-center justify-center border border-secondary/20 rounded-lg transition-all bg-white shadow-sm group active:scale-95 ${
                  isWishlisted ? 'text-primary border-primary' : 'text-secondary hover:text-primary hover:border-primary'
                }`}
                title="Wishlist"
              >
                <FiHeart className={`text-3xl group-hover:scale-110 transition-transform ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="h-16 w-16 flex items-center justify-center border border-secondary/20 rounded-lg transition-all bg-white shadow-sm text-secondary hover:text-primary hover:border-primary group active:scale-95"
                title="Share Product"
              >
                <FiShare2 className="text-3xl group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Specifications Accordion */}
          <div className="flex flex-col divide-y divide-secondary/10 border-t border-b border-secondary/10 mb-8">
            <details className="group py-6 cursor-pointer" open>
              <summary className="flex justify-between items-center font-bold text-secondary uppercase tracking-[0.2em] text-[10px] list-none">
                Material & Finish
                <span className="text-xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="mt-4 text-grey leading-relaxed text-sm animate-fade-in font-light">
                Vegetable-tanned full-grain Italian Vachetta leather. Hand-painted edges with premium beeswax finish. Solid brass hardware that ages beautifully.
              </div>
            </details>
            <details className="group py-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-secondary uppercase tracking-[0.2em] text-[10px] list-none">
                Dimensions
                <span className="text-xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="mt-4 text-grey leading-relaxed text-sm animate-fade-in font-light">
                Optimized for international currencies. Fits standard credit cards and identification. Slim profile designed for front-pocket comfort.
              </div>
            </details>
          </div>

          {/* Shipping Badge */}
          <div className="flex items-center gap-4 p-5 bg-white border border-secondary/5 rounded-xl shadow-sm">
            <FiTruck className="text-primary text-3xl" />
            <span className="text-xs font-bold text-grey uppercase tracking-widest">Free shipping on all orders over $150.</span>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-secondary/5 p-8 relative animate-scale-in">
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-taupe hover:text-primary transition-colors"
            >
              <FiX className="text-2xl" />
            </button>
            
            <h3 className="font-serif text-3xl text-secondary font-bold mb-2">Share Product</h3>
            <p className="text-grey text-sm font-light mb-10">Share this masterpiece with your connections.</p>
            
            <div className="grid grid-cols-3 gap-6 mb-12">
              <a href="#" className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-2xl bg-ivory flex items-center justify-center text-secondary text-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <FiFacebook />
                </div>
                <span className="text-[10px] font-bold text-taupe uppercase tracking-widest group-hover:text-secondary transition-colors">Facebook</span>
              </a>
              <a href="#" className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-2xl bg-ivory flex items-center justify-center text-secondary text-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <FiTwitter />
                </div>
                <span className="text-[10px] font-bold text-taupe uppercase tracking-widest group-hover:text-secondary transition-colors">Twitter</span>
              </a>
              <button onClick={handleCopyLink} className="flex flex-col items-center gap-3 group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-sm ${copyFeedback ? 'bg-green-600 text-white' : 'bg-ivory text-secondary group-hover:bg-primary group-hover:text-white'}`}>
                  {copyFeedback ? <FiCheck /> : <FiLink />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${copyFeedback ? 'text-green-600' : 'text-taupe group-hover:text-secondary'}`}>
                  {copyFeedback ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>
            
            <div className="bg-ivory/30 p-4 rounded-xl border border-taupe/10 flex items-center justify-between gap-4 overflow-hidden">
              <span className="text-xs text-grey truncate font-medium">{typeof window !== 'undefined' ? window.location.href : ''}</span>
              <button 
                onClick={handleCopyLink}
                className="text-[10px] font-bold text-primary hover:text-secondary transition-colors uppercase tracking-widest shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Craftsmanship Section */}
      <section className="py-24 border-t border-secondary/5">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="font-serif text-4xl text-secondary font-bold mb-6 tracking-tight">Uncompromising Craftsmanship</h3>
            <p className="text-grey leading-relaxed mb-8 text-lg font-light">
              Every Luxe Leather piece begins its journey in the heart of Tuscany. Our master artisans select only the finest hides, 
              ensuring each piece showcases the natural grain and character of the leather.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-secondary/5 shadow-sm">
                <FiAward className="text-primary text-4xl mb-4" />
                <h4 className="font-bold text-secondary mb-2 uppercase tracking-widest text-[10px]">Lifetime Warranty</h4>
                <p className="text-xs text-grey font-light">We stand behind the quality of our craftsmanship for life.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-secondary/5 shadow-sm">
                <FiGlobe className="text-primary text-4xl mb-4" />
                <h4 className="font-bold text-secondary mb-2 uppercase tracking-widest text-[10px]">Sustainable Sourcing</h4>
                <p className="text-xs text-grey font-light">Ethically sourced leather from LWG gold-certified tanneries.</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] group">
            <img src="https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=1200" alt="Artisan hands" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} product={product} />

      {/* Related Products */}
      <section className="mb-12">
        <h2 className="font-serif text-4xl text-secondary font-bold mb-12 text-center tracking-tight">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {relatedProducts.map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              isWishlisted={wishlist.includes(p.id)}
              isInCart={isProductInCart(p.id)}
              onAddToCart={() => handleAddToCart()} 
              onToggleWishlist={() => onToggleWishlist(p.id)} 
              onClick={() => onProductClick(p)} 
            />
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default ProductDetailPage;