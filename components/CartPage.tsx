
import React from 'react';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiArrowRight, FiLock, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { CartItem } from '../types.ts';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ items, onUpdateQuantity, onRemove, onContinueShopping, onCheckout }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-taupe/30 pb-6">
        <h1 className="font-serif text-3xl md:text-4xl text-secondary font-bold">Shopping Cart</h1>
        <p className="mt-2 sm:mt-0 text-grey font-medium">{items.length} items</p>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-grey text-xl mb-8">Your cart is currently empty.</p>
          <button 
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary transition-all"
          >
            <FiArrowLeft /> Start Shopping
          </button>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-grey/60 uppercase tracking-widest pb-2 border-b border-taupe/20">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-soft border border-taupe/10 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="shrink-0 w-full sm:w-28 h-36 rounded-lg overflow-hidden">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row justify-between gap-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-serif font-bold text-secondary">{item.name}</h3>
                      <p className="text-sm text-grey">Color: <span className="font-medium text-secondary">{item.color}</span></p>
                      <p className="text-xs text-green-700 flex items-center gap-1 font-medium">
                        <FiCheckCircle /> In Stock
                      </p>
                    </div>

                    <div className="flex flex-row sm:flex-col md:flex-row items-center justify-between sm:gap-8 w-full sm:w-auto">
                      <div className="flex items-center border border-taupe/30 rounded-lg overflow-hidden h-10 bg-ivory/30">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-10 h-full flex items-center justify-center text-grey hover:bg-taupe/10"
                        ><FiMinus /></button>
                        <span className="w-8 text-center text-sm font-bold text-secondary">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-10 h-full flex items-center justify-center text-grey hover:bg-taupe/10"
                        ><FiPlus /></button>
                      </div>

                      <div className="flex flex-col items-end min-w-[80px]">
                        <span className="font-serif font-bold text-lg text-secondary">${(item.price * item.quantity).toFixed(2)}</span>
                        <span className="text-xs text-grey/60 hidden md:block">${item.price.toFixed(2)} each</span>
                      </div>

                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-grey/40 hover:text-red-500 transition-colors p-2"
                      ><FiTrash2 className="text-xl" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={onContinueShopping}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </button>
          </div>

          <div className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="bg-white rounded-xl p-8 shadow-xl border border-taupe/20 sticky top-28">
              <h2 className="text-xl font-serif font-bold text-secondary mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between text-grey">
                  <span>Subtotal</span>
                  <span className="font-bold text-secondary">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-grey">
                  <span>Shipping estimate</span>
                  <span className="text-green-700 font-bold uppercase tracking-widest text-xs">Free</span>
                </div>
                <div className="flex justify-between text-grey">
                  <span>Tax estimate</span>
                  <span className="font-bold text-secondary">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-taupe/20 pt-8 mb-8 flex justify-between items-center">
                <span className="text-lg font-bold text-secondary">Order Total</span>
                <span className="font-serif text-3xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>

              <button 
                onClick={onCheckout}
                className="w-full bg-primary text-white h-16 rounded-lg font-bold tracking-widest hover:bg-secondary transition-all shadow-lg flex items-center justify-center gap-3 group active:scale-95"
              >
                CHECKOUT <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8 flex justify-between text-[10px] text-grey/40 font-bold uppercase tracking-[0.15em]">
                <div className="flex items-center gap-1"><FiLock /> Secure</div>
                <div className="flex items-center gap-1"><FiRefreshCw /> Returns</div>
                <div className="flex items-center gap-1"><FiCheckCircle /> Warranty</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
