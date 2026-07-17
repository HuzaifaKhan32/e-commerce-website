'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiLock, FiCheckCircle, FiLoader, FiMapPin } from 'react-icons/fi';
import Link from 'next/link';
import { CartItem } from '@/types';
import { CheckoutInfo } from '@/context/StoreContext';
import { useStore } from '@/context/StoreContext';
import { calculateOrderSummary, formatPrice } from '@/utils/orderSummary';

interface SavedAddress {
  id: string;
  name: string;
  type: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

interface CheckoutPageProps {
  items: CartItem[];
  onPlaceOrder: (info: CheckoutInfo) => Promise<void>;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, onPlaceOrder }) => {
  const { session, isPlacingOrder } = useStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
  });

  const summary = calculateOrderSummary(items);

  useEffect(() => {
    if (session.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: session.user?.name || prev.fullName,
        email: session.user?.email || prev.email,
      }));

      fetch('/api/addresses')
        .then((res) => (res.ok ? res.json() : []))
        .then((data: SavedAddress[]) => {
          setSavedAddresses(data);
          const defaultAddr = data.find((a) => a.is_default) || data[0];
          if (defaultAddr) {
            applyAddress(defaultAddr);
            setSelectedAddressId(defaultAddr.id);
          }
        })
        .catch(() => {});
    }
  }, [session.user]);

  const applyAddress = (addr: SavedAddress) => {
    setFormData({
      fullName: addr.name,
      email: session.user?.email || formData.email,
      phone: addr.phone,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postal_code,
      country: addr.country || 'Pakistan',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSelectedAddressId(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-[800px] mx-auto mb-16">
        <div className="flex items-center justify-center w-full">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-serif font-bold text-sm ${step >= 1 ? 'bg-primary text-white shadow-lg' : 'bg-white border border-taupe text-taupe'}`}>1</div>
            <span className={`ml-3 text-sm font-bold tracking-widest uppercase ${step >= 1 ? 'text-secondary' : 'text-taupe'}`}>Shipping Info</span>
          </div>
          <div className="flex-1 h-[2px] bg-taupe/20 mx-8 max-w-[120px]" />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-serif font-bold text-sm ${step >= 2 ? 'bg-primary text-white shadow-lg' : 'bg-white border border-taupe text-taupe'}`}>2</div>
            <span className={`ml-3 text-sm font-bold tracking-widest uppercase ${step >= 2 ? 'text-secondary' : 'text-taupe'}`}>Review Order</span>
          </div>
        </div>
      </div>

      {!session.user && (
        <div className="max-w-[800px] mx-auto mb-8 bg-ivory/60 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-secondary font-medium">
            Sign in to save your details and track your order. Your bag is reserved.
          </p>
          <Link href="/auth?callbackUrl=/checkout">
            <button className="px-6 py-3 bg-secondary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary transition-all">
              Sign In
            </button>
          </Link>
        </div>
      )}

      <div className="max-w-[800px] mx-auto">
        {step === 1 ? (
          <div className="bg-white p-10 rounded-2xl shadow-soft border border-secondary/5 animate-fade-in">
            <div className="mb-10">
              <h2 className="font-serif text-3xl text-secondary font-bold mb-2 tracking-tight">Shipping Information</h2>
              <p className="text-grey/70 text-sm">Where should we deliver your order?</p>
            </div>

            {savedAddresses.length > 0 && (
              <div className="mb-10 space-y-3">
                <p className="text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-4">Saved Addresses</p>
                <div className="grid gap-3">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => {
                        applyAddress(addr);
                        setSelectedAddressId(addr.id);
                      }}
                      className={`text-left p-5 rounded-xl border transition-all flex gap-4 ${
                        selectedAddressId === addr.id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                          : 'border-taupe/20 hover:border-primary/40'
                      }`}
                    >
                      <FiMapPin className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-secondary text-sm">{addr.name} · {addr.type}</p>
                        <p className="text-xs text-grey mt-1">
                          {addr.street}, {addr.city}, {addr.state} {addr.postal_code}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleNext} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Full Name</label>
                  <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="e.g. Ahmed Khan"
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
                    className="w-full rounded-xl border border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    placeholder="e.g. ahmed@example.com"
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
                  className="w-full rounded-xl border border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  placeholder="+92 300 1234567"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Address Line 1</label>
                <input
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
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
                    className="w-full rounded-xl border border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Province</label>
                  <input
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Postal Code</label>
                  <input
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary placeholder-taupe/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-taupe/20 bg-ivory/20 px-5 py-4 text-secondary focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none cursor-pointer"
                >
                  <option>Pakistan</option>
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
                        <p className="text-grey/60 text-xs font-medium">{item.color}</p>
                      </div>
                      <p className="text-secondary font-bold font-serif">{formatPrice(item.price)}</p>
                    </div>
                    <p className="text-[10px] font-bold text-taupe uppercase tracking-widest mt-3">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

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
                <button onClick={() => setStep(1)} className="text-primary font-bold text-xs uppercase tracking-widest hover:text-secondary transition-colors underline underline-offset-4">
                  Edit
                </button>
              </div>

              <div className="pt-8 border-t border-taupe/10">
                <h4 className="text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-4">Payment Method</h4>
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-primary/30 shadow-sm">
                  <div className="w-5 h-5 rounded-full border-4 border-primary mt-1" />
                  <div>
                    <p className="text-secondary font-bold text-sm">Cash on Delivery</p>
                    <p className="text-grey/60 text-xs mt-1">Pay with cash upon delivery. Please have the exact amount ready.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-taupe/10">
              <div className="flex justify-between text-sm text-grey">
                <span className="font-medium">Subtotal</span>
                <span className="text-secondary font-bold">{formatPrice(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-grey">
                <span className="font-medium">Shipping</span>
                <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">Free</span>
              </div>
              <div className="flex justify-between text-sm text-grey">
                <span className="font-medium">Tax</span>
                <span className="text-secondary font-bold">{formatPrice(summary.tax)}</span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-taupe/10 mt-6">
                <span className="text-xl font-serif font-bold text-secondary">Total Amount</span>
                <span className="text-3xl font-bold text-primary">{formatPrice(summary.total)}</span>
              </div>
            </div>

            <p className="text-[11px] text-taupe text-center mb-6 tracking-wide">
              Lifetime warranty on hardware · Free shipping across Pakistan · Hand-inspected before dispatch
            </p>

            <button
              onClick={() => onPlaceOrder(formData)}
              disabled={isPlacingOrder}
              className={`w-full bg-secondary hover:bg-primary text-white font-bold py-5 px-8 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest text-sm ${isPlacingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isPlacingOrder ? (
                <>
                  <FiLoader className="animate-spin text-xl" /> Processing Order...
                </>
              ) : (
                <>
                  <FiLock className="text-xl" /> Place Order
                </>
              )}
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-taupe/50 text-[10px] font-bold tracking-[0.2em] uppercase">
              <FiCheckCircle className="text-sm" /> Secure checkout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
