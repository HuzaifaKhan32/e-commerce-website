'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  FiLink,
  FiZoomIn,
  FiMinus
} from 'react-icons/fi';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import ProductReviews from './ProductReviews';

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
  productImages: ProductImage[];
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
  productImages,
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
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Store scroll position before modal opens
  const scrollPositionRef = useRef(0);

  // Mobile fullscreen modal states
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [modalScale, setModalScale] = useState(1);
  const [modalTranslate, setModalTranslate] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);

  const modalContentRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const swipeDistanceX = useRef(0);
  const swipeDistanceY = useRef(0);
  const isSwipingRef = useRef(false);

  // Get all images for this product
  const images = productImages.length > 0
    ? productImages.map(img => img.image_url)
    : [product.imageUrl];

  const mainImage = images[mainImageIndex] || product.imageUrl;

  useEffect(() => {
    setMainImageIndex(0);
    setQuantity(1);
    setIsZoomed(false);
    setZoomPos({ x: 0, y: 0 });
  }, [product.id]);

  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle browser back button when modal is open
  useEffect(() => {
    if (!isMobileModalOpen) return;

    // Push a state to intercept back button
    window.history.pushState({ modalOpen: true }, '');

    const handlePopState = (e: PopStateEvent) => {
      // Prevent default back navigation
      e.preventDefault();
      e.stopPropagation();

      // Close modal and restore scroll
      setIsMobileModalOpen(false);
      setModalScale(1);
      setModalTranslate({ x: 0, y: 0 });

      // Restore scroll position and body overflow
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
  }, [isMobileModalOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleImageChange = (index: number) => {
    setMainImageIndex(index);
    setIsZoomed(false);
    setZoomPos({ x: 0, y: 0 });
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, 'Standard'); // Pass default value since jackets don't have color variants
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
        navigator.clipboard.writeText(window.location.href);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  // Mobile modal handlers
  const openMobileModal = (index: number) => {
    // Save current scroll position
    scrollPositionRef.current = window.scrollY;
    
    setModalImageIndex(index);
    setModalScale(1);
    setModalTranslate({ x: 0, y: 0 });
    setIsMobileModalOpen(true);
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.width = '100%';
  };

  const closeMobileModal = useCallback(() => {
    setIsMobileModalOpen(false);
    setModalScale(1);
    setModalTranslate({ x: 0, y: 0 });
    
    // Restore scroll position and body styles
    const scrollY = scrollPositionRef.current;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }, []);

  const nextModalImage = useCallback(() => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
    setModalScale(1);
    setModalTranslate({ x: 0, y: 0 });
  }, [images.length]);

  const prevModalImage = useCallback(() => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setModalScale(1);
    setModalTranslate({ x: 0, y: 0 });
  }, [images.length]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      swipeDistanceX.current = 0;
      swipeDistanceY.current = 0;
      isSwipingRef.current = false;
    } else if (e.touches.length === 2) {
      // Pinch gesture - only when already zoomed or explicitly pinching
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialPinchDistance(distance);
      setInitialScale(modalScale);
      setIsPinching(true);
      isSwipingRef.current = false; // Cancel swipe when pinching
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && !isPinching) {
      const deltaX = e.touches[0].clientX - touchStartX.current;
      const deltaY = e.touches[0].clientY - touchStartY.current;

      swipeDistanceX.current = deltaX;
      swipeDistanceY.current = deltaY;

      // Determine if this is a swipe gesture (horizontal movement dominates)
      if (!isSwipingRef.current && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
        isSwipingRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }

      // If zoomed, allow panning
      if (modalScale > 1) {
        e.preventDefault();
        const maxPan = (modalScale - 1) * 200;
        setModalTranslate({
          x: Math.max(-maxPan, Math.min(maxPan, modalTranslate.x + deltaX * 0.5)),
          y: Math.max(-maxPan, Math.min(maxPan, modalTranslate.y + deltaY * 0.5))
        });
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }
      // If not zoomed and this is a horizontal swipe, prevent default to avoid conflicts
      else if (isSwipingRef.current && Math.abs(deltaX) > 20) {
        e.preventDefault();
      }
    } else if (e.touches.length === 2 && isPinching) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.min(Math.max(initialScale * (distance / initialPinchDistance), 1), 3);
      setModalScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    // Only trigger image change on touch end, not during move
    if (!isPinching && modalScale === 1 && isSwipingRef.current) {
      const swipeThreshold = 50;
      const deltaX = swipeDistanceX.current;

      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > swipeThreshold) {
          prevModalImage();
        } else if (deltaX < -swipeThreshold) {
          nextModalImage();
        }
      }
    }

    setIsPinching(false);
    isSwipingRef.current = false;
    swipeDistanceX.current = 0;
    swipeDistanceY.current = 0;
  };

  // Double tap to zoom - only when not swiping
  const lastTapTime = useRef(0);
  const handleTouchEndTap = (e: React.TouchEvent) => {
    // Don't trigger zoom if user was swiping
    if (isSwipingRef.current || Math.abs(swipeDistanceX.current) > 20) {
      return;
    }

    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime.current;

    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      e.preventDefault();
      if (modalScale > 1) {
        setModalScale(1);
        setModalTranslate({ x: 0, y: 0 });
      } else {
        setModalScale(2);
      }
    }
    lastTapTime.current = currentTime;
  };

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
            className={`relative aspect-[4/3] bg-white rounded-xl overflow-hidden shadow-xl border border-secondary/5 group ${isMobile ? 'cursor-pointer' : 'cursor-zoom-in'}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => !isMobile && setIsZoomed(true)}
            onMouseLeave={() => !isMobile && setIsZoomed(false)}
            onClick={() => isMobile && openMobileModal(mainImageIndex)}
          >
            <img
              ref={mainImageRef}
              src={mainImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ease-out ${isZoomed && !isMobile ? 'scale-[1.5]' : 'scale-100'}`}
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                willChange: 'transform'
              }}
              draggable={false}
            />
            {!isZoomed && !isMobile && (
              <>
                <button
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white text-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageChange((mainImageIndex - 1 + images.length) % images.length);
                  }}
                >
                  <FiChevronLeft className="text-3xl" />
                </button>
                <button
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white text-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageChange((mainImageIndex + 1) % images.length);
                  }}
                >
                  <FiChevronRight className="text-3xl" />
                </button>
              </>
            )}
            {isMobile && (
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white pointer-events-none">
                <FiZoomIn className="text-xl" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleImageChange(idx)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${mainImageIndex === idx ? 'border-primary shadow-md' : 'border-transparent shadow-sm grayscale hover:grayscale-0'}`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Information */}
        <div className="flex flex-col">
          <div className="mb-8">
            <span className="inline-block text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-3">Handcrafted Leather Jacket</span>
            <h1 className="font-serif text-5xl text-secondary font-bold leading-tight mb-4 tracking-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`text-2xl ${i < product.rating ? 'fill-current' : 'text-taupe'}`} />
                ))}
              </div>
              <span className="text-sm text-taupe font-medium underline cursor-pointer hover:text-primary transition-colors">({product.reviewCount} verified reviews)</span>
            </div>

            {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
              <p className="mb-4 text-xs text-secondary/80 tracking-widest uppercase font-medium border-l-2 border-primary pl-3">
                Only {product.stock} handcrafted {product.stock === 1 ? 'piece' : 'pieces'} remaining
              </p>
            )}
            {product.stock !== undefined && product.stock === 0 && (
              <p className="mb-4 text-xs text-taupe tracking-widest uppercase font-bold">
                Currently unavailable
              </p>
            )}

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-grey leading-relaxed mb-10 text-lg border-b border-secondary/10 pb-10 font-light whitespace-pre-line">
            {product.description || "Premium leather jacket handcrafted with meticulous attention to detail. Features genuine leather construction, durable hardware, and timeless styling that improves with age."}
          </p>

          {/* Remove Color Selection - not applicable for jackets with fixed colors */}

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

          <div className="mb-8 space-y-2">
            <p className="text-[11px] text-secondary/70 tracking-wide flex items-center gap-2">
              <FiAward className="text-primary shrink-0" />
              Lifetime warranty on hardware
            </p>
            <p className="text-[11px] text-secondary/70 tracking-wide flex items-center gap-2">
              <FiTruck className="text-primary shrink-0" />
              Free shipping across Pakistan included
            </p>
          </div>

          {/* Specifications Accordion */}
          <div className="flex flex-col divide-y divide-secondary/10 border-t border-b border-secondary/10 mb-8">
            <details className="group py-6 cursor-pointer" open>
              <summary className="flex justify-between items-center font-bold text-secondary uppercase tracking-[0.2em] text-[10px] list-none">
                Material & Construction
                <span className="text-xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="mt-4 text-grey leading-relaxed text-sm animate-fade-in font-light">
                Crafted from premium genuine leather with reinforced stitching throughout. Features durable metal hardware, quality lining, and multiple pockets for functionality.
              </div>
            </details>
            <details className="group py-6 cursor-pointer">
              <summary className="flex justify-between items-center font-bold text-secondary uppercase tracking-[0.2em] text-[10px] list-none">
                Care Instructions
                <span className="text-xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="mt-4 text-grey leading-relaxed text-sm animate-fade-in font-light">
                Wipe clean with a soft, dry cloth. For deeper cleaning, use leather-specific products. Store in a cool, dry place away from direct sunlight. Leather will develop natural patina over time.
              </div>
            </details>
          </div>

          {/* Shipping Badge */}
          <div className="flex items-center gap-4 p-5 bg-white border border-secondary/5 rounded-xl shadow-sm">
            <FiTruck className="text-primary text-3xl" />
            <span className="text-xs font-bold text-grey uppercase tracking-widest">Complimentary shipping across Pakistan on all orders.</span>
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
            <p className="text-grey text-sm font-light mb-8">Copy the link to share this product.</p>

            <div className="bg-ivory/30 p-4 rounded-xl border border-taupe/10 flex items-center justify-between gap-4 overflow-hidden mb-4">
              <span className="text-xs text-grey truncate font-medium">{typeof window !== 'undefined' ? window.location.href : ''}</span>
              <button
                onClick={handleCopyLink}
                className="text-[10px] font-bold text-primary hover:text-secondary transition-colors uppercase tracking-widest shrink-0"
              >
                Copy
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${copyFeedback ? 'bg-green-600 text-white' : 'bg-secondary text-white hover:bg-primary'}`}
            >
              {copyFeedback ? (
                <span className="flex items-center justify-center gap-2">
                  <FiCheck /> Link Copied!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiLink /> Copy Link
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Fullscreen Image Modal */}
      {isMobileModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center md:hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={(e) => {
            handleTouchEnd();
            handleTouchEndTap(e);
          }}
        >
          {/* Close button - positioned lower to avoid header overlap */}
          <button
            onClick={closeMobileModal}
            className="absolute top-16 right-6 z-[10000] bg-black/50 backdrop-blur-sm text-white p-4 rounded-full shadow-lg"
          >
            <FiX className="text-2xl" />
          </button>

          {/* Previous button */}
          <button
            onClick={prevModalImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-4 rounded-full shadow-lg"
          >
            <FiChevronLeft className="text-3xl" />
          </button>

          {/* Next button */}
          <button
            onClick={nextModalImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-4 rounded-full shadow-lg"
          >
            <FiChevronRight className="text-3xl" />
          </button>

          {/* Image with zoom/pan */}
          <div
            ref={modalContentRef}
            className="w-full h-full flex items-center justify-center overflow-hidden"
          >
            <img
              src={images[modalImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain"
              style={{
                transform: `scale(${modalScale}) translate(${modalTranslate.x / modalScale}px, ${modalTranslate.y / modalScale}px)`,
                touchAction: 'none',
                willChange: 'transform'
              }}
              draggable={false}
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {modalImageIndex + 1} / {images.length}
          </div>

          {/* Zoom indicator */}
          {modalScale > 1 && (
            <button
              onClick={() => {
                setModalScale(1);
                setModalTranslate({ x: 0, y: 0 });
              }}
              className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full"
            >
              <FiMinus className="text-xl" />
            </button>
          )}
        </div>
      )}

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

export default ProductDetailPage;
