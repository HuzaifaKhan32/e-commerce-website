'use client';

import React, { useState } from 'react';
import { FiArrowRight, FiLock, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { CartItem } from '@/types';
import { CheckoutInfo } from '@/context/StoreContext';

interface CheckoutPageProps {
  items: CartItem[];
  onPlaceOrder: (info: CheckoutInfo) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, onPlaceOrder }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<CheckoutInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal; // Simplified for checkout match

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Progress Indicator */}
      <div className="max-w-[800px] mx-auto mb-16">
        <div className="flex items-center justify-center w-full">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-serif font-bold text-sm ${step >= 1 ? 'bg-primary text-white shadow-lg' : 'bg-white border border-taupe text-taupe'}`}>1</div>
            <span className={`ml-3 text-sm font-bold tracking-widest uppercase ${step >= 1 ? 'text-secondary' : 'text-taupe'}`}>Shipping Info</span>
          </div>
          <div className="flex-1 h-[2px] bg-taupe/20 mx-8 max-w-[120px]"></div>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-serif font-bold text-sm ${step >= 2 ? 'bg-primary text-white shadow-lg' : 'bg-white border border-taupe text-taupe'}`}>2</div>
            <span className={`ml-3 text-sm font-bold tracking-widest uppercase ${step >= 2 ? 'text-secondary' : 'text-taupe'}`}>Review Order</span>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto">
        {step === 1 ? (
          <div className="bg-white p-10 rounded-2xl shadow-soft border border-secondary/5 animate-fade-in">
            <div className="mb-10">
              <h2 className="font-serif text-3xl text-secondary font-bold mb-2 tracking-tight">Shipping Information</h2>
              <p className="text-grey/70 text-sm">Where should we deliver your order?</p>
            </div>

            <form onSubmit={handleNext} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Full Name</label>
                  <input 
                    required 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                    placeholder="e.g. James Smith" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                    placeholder="e.g. james@example.com" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Phone Number</label>
                <input 
                  required 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                  placeholder="+1 (555) 000-0000" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Address Line 1</label>
                <input 
                  required 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                  placeholder="Street address" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">City</label>
                  <input 
                    required 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-xl border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">State / Province</label>
                  <input 
                    required 
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded-xl border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Postal Code</label>
                  <input 
                    required 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full rounded-xl border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Country</label>
                <select 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-xl border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none cursor-pointer"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white font-bold py-5 px-8 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-95"
              >
                Continue to Review <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-2xl shadow-soft border border-secondary/5 animate-fade-in">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="font-serif text-3xl text-secondary font-bold mb-2 tracking-tight">Review Your Order</h2>
                <p className="text-grey/70 text-sm">Please verify your details before placing order.</p>
              </div>
              <span className="bg-ivory text-secondary border border-taupe/20 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase">
                Cash on Delivery
              </span>
            </div>

            {/* Order Items */}
            <div className="divide-y divide-taupe/10 mb-10 border-t border-b border-taupe/10">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 py-6 items-center">
                  <div className="w-20 h-24 bg-ivory rounded-lg overflow-hidden shrink-0 border border-taupe/10 shadow-sm">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-secondary font-bold text-base mb-1">{item.name}</h3>
                        <p className="text-grey/60 text-xs font-medium">{item.color} / Standard</p>
                      </div>
                      <p className="text-secondary font-bold font-serif">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="mt-3">
                      <p className="text-[10px] font-bold text-taupe uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Details */}
            <div className="bg-ivory/30 rounded-2xl p-8 space-y-8 mb-10 border border-taupe/10">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-4">Ship To</h4>
                  <p className="text-secondary text-sm leading-relaxed font-medium">
                    {formData.fullName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.state} {formData.postalCode}<br />
                    {formData.country}
                  </p>
                </div>
                <button onClick={() => setStep(1)} className="text-primary font-bold text-xs uppercase tracking-widest hover:text-secondary transition-colors underline underline-offset-4">Edit</button>
              </div>

              <div className="pt-8 border-t border-taupe/10">
                <h4 className="text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-4">Payment Method</h4>
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-primary/30 shadow-sm">
                  <div className="w-5 h-5 rounded-full border-4 border-primary mt-1"></div>
                  <div>
                    <p className="text-secondary font-bold text-sm">Cash on Delivery</p>
                    <p className="text-grey/60 text-xs mt-1">Pay with cash upon delivery. Please have the exact amount ready.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Totals */}
            <div className="space-y-4 mb-10 pb-10 border-b border-taupe/10">
              <div className="flex justify-between text-sm text-grey">
                <span className="font-medium">Subtotal</span>
                <span className="text-secondary font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-grey">
                <span className="font-medium">Shipping</span>
                <span className="text-green-700 font-bold uppercase tracking-widest text-[10px]">Free</span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-taupe/10 mt-6">
                <span className="text-xl font-serif font-bold text-secondary">Total Amount</span>
                <span className="text-3xl font-bold text-secondary">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => onPlaceOrder(formData)}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-5 px-8 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <FiLock className="text-xl" /> PLACE ORDER
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-taupe/50 text-[10px] font-bold tracking-[0.2em] uppercase">
              <FiCheckCircle className="text-sm" /> Secure SSL Encryption
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;