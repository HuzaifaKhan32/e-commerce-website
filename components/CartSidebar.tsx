'use client';

import React, { useEffect, useRef } from 'react';
import { FiX, FiShoppingBag, FiTrash2, FiMinus, FiPlus, FiArrowRight, FiLock, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import { calculateOrderSummary, formatPrice } from '@/utils/orderSummary';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, session } = useStore();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const summary = calculateOrderSummary(cart);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />

      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-luxury transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-taupe/10">
            <div className="flex items-center gap-3">
              <FiShoppingBag className="text-2xl text-primary" />
              <h2 className="text-xl font-serif font-bold text-secondary">Your Bag</h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{cart.length}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-taupe hover:text-secondary transition-colors"
              aria-label="Close cart"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="size-20 bg-ivory rounded-full flex items-center justify-center text-taupe/30 mb-6">
                  <FiShoppingBag className="text-4xl" />
                </div>
                <p className="text-grey mb-8 font-light italic max-w-xs">
                  &ldquo;A bag empty of leather is a bag empty of heritage.&rdquo;
                </p>
                <button
                  onClick={onClose}
                  className="bg-secondary text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-ivory/30 border border-taupe/5 group">
                    <div className="w-20 h-24 shrink-0 rounded-lg overflow-hidden bg-white">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-secondary truncate">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-taupe/40 hover:text-red-500 transition-colors"
                            aria-label={`Remove ${item.name}`}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                        <p className="text-[10px] text-taupe font-bold uppercase tracking-wider mt-1">{item.color}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-taupe/20 rounded-lg bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-grey hover:bg-taupe/5"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus className="text-xs" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-secondary">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-grey hover:bg-taupe/5"
                            aria-label="Increase quantity"
                          >
                            <FiPlus className="text-xs" />
                          </button>
                        </div>
                        <span className="font-serif font-bold text-sm text-secondary">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-taupe/10 bg-ivory/10 space-y-4">
              {!summary.qualifiesForFreeShipping && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-taupe uppercase tracking-widest font-bold">
                    <span>Free shipping progress</span>
                    <span>{formatPrice(summary.amountUntilFreeShipping)} to go</span>
                  </div>
                  <div className="w-full h-1.5 bg-taupe/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (summary.subtotal / summary.freeShippingThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-grey text-sm">Subtotal</span>
                <span className="text-xl font-serif font-bold text-secondary">{formatPrice(summary.subtotal)}</span>
              </div>
              <p className="text-[10px] text-taupe/80 italic">
                Tax calculated at checkout · Free shipping across Pakistan on orders over {formatPrice(summary.freeShippingThreshold)}
              </p>

              <div className="flex items-center justify-between gap-4 text-[9px] text-grey/70 font-bold uppercase tracking-[0.12em] py-2 border-y border-taupe/10">
                <span className="flex items-center gap-1"><FiLock /> Secure</span>
                <span className="flex items-center gap-1"><FiRefreshCw /> 30-day returns</span>
                <span className="flex items-center gap-1"><FiCheckCircle /> COD available</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/cart" onClick={onClose}>
                  <button className="w-full h-12 border border-secondary/20 text-secondary rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-secondary hover:text-white transition-all">
                    View Bag
                  </button>
                </Link>
                <Link href={session.user ? '/checkout' : '/auth?callbackUrl=/checkout'} onClick={onClose}>
                  <button className="w-full h-12 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-secondary transition-all flex items-center justify-center gap-2">
                    Checkout <FiArrowRight />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
