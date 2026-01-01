
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiPackage, FiTruck, FiCheck, FiHome, FiInfo, FiCreditCard, FiDownload, FiRefreshCw, FiHelpCircle } from 'react-icons/fi';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-taupe hover:text-secondary font-bold text-xs uppercase tracking-widest transition-colors"
      >
        <FiArrowLeft /> Back to Orders
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-taupe/20 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-secondary text-3xl md:text-4xl font-serif font-bold tracking-tight">Order #{id}</h1>
          <div className="flex items-center gap-3 text-grey text-sm font-medium">
            <span>Placed on Oct 24, 2023</span>
            <span className="h-1 w-1 rounded-full bg-taupe/40"></span>
            <span>3 Items</span>
            <span className="h-1 w-1 rounded-full bg-taupe/40"></span>
            <span className="text-primary font-bold">Total: $744.86</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-taupe/30 bg-white px-5 py-2.5 text-xs font-bold text-secondary transition-colors hover:bg-background-light">
            <FiDownload /> Invoice
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-taupe/30 bg-white px-5 py-2.5 text-xs font-bold text-secondary transition-colors hover:bg-background-light">
            <FiHelpCircle /> Need Help?
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-secondary/10 transition-all hover:bg-primary">
            <FiTruck /> Track Order
          </button>
        </div>
      </div>

      {/* Order Progress */}
      <div className="rounded-2xl border border-taupe/20 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-secondary text-lg font-bold font-serif">Shipped</p>
              <p className="text-grey text-sm mt-1">Estimated Delivery: <span className="text-secondary font-bold">Oct 28, 2023</span></p>
            </div>
            <div className="flex items-center gap-2 text-primary bg-primary/5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/10">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              In Transit
            </div>
          </div>
          
          <div className="relative w-full py-8 px-2">
            <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-background-light rounded-full"></div>
            <div className="absolute top-1/2 left-0 h-1 w-[75%] -translate-y-1/2 bg-primary transition-all duration-1000 rounded-full"></div>
            <div className="relative flex w-full justify-between">
              <div className="flex flex-col items-center gap-3">
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary ring-4 ring-white shadow-sm">
                  <FiCheck className="text-white text-sm" />
                </div>
                <p className="hidden md:block absolute top-12 text-[10px] font-bold text-secondary uppercase tracking-widest">Confirmed</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary ring-4 ring-white shadow-sm">
                  <FiCheck className="text-white text-sm" />
                </div>
                <p className="hidden md:block absolute top-12 text-[10px] font-bold text-secondary uppercase tracking-widest">Processing</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="z-10 flex h-10 w-10 -mt-1 items-center justify-center rounded-full bg-primary ring-4 ring-white shadow-lg">
                  <FiTruck className="text-white text-lg" />
                </div>
                <p className="hidden md:block absolute top-14 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Shipped</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background-light border border-taupe/20 ring-4 ring-white">
                  <FiHome className="text-taupe text-sm" />
                </div>
                <p className="hidden md:block absolute top-12 text-[10px] font-bold text-taupe/60 uppercase tracking-widest">Delivered</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-background-light p-4 border border-taupe/10 flex items-start gap-3">
            <FiInfo className="text-primary mt-1 shrink-0" />
            <div className="text-sm text-grey">
              <p className="mb-1 text-secondary font-bold">Latest Update</p>
              <p className="font-medium">Package arrived at local distribution center in New York, NY. (Oct 26, 08:30 AM)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h3 className="text-xl font-serif font-bold text-secondary">Items Ordered</h3>
          <div className="overflow-hidden rounded-2xl border border-taupe/20 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead className="bg-background-light text-[10px] uppercase text-taupe font-bold tracking-[0.2em] border-b border-taupe/10">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 text-center">Price</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-taupe/10">
                  <tr className="group hover:bg-background-light/30 transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-taupe/10 bg-background-light">
                          <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800" alt="Product" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-secondary font-serif">Vintage Leather Satchel</p>
                          <p className="text-xs text-grey font-medium mt-1">Color: Espresso Brown</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center text-sm font-bold text-primary">$450.00</td>
                    <td className="px-6 py-6 text-center text-sm text-grey font-medium">1</td>
                    <td className="px-6 py-6 text-right text-sm font-bold text-secondary">$450.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-taupe/20 bg-white p-6 shadow-sm">
              <h4 className="text-secondary font-serif font-bold mb-6 text-lg border-b border-background-light pb-4">Order Summary</h4>
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between items-center text-grey font-medium">
                  <span>Subtotal</span>
                  <span className="text-secondary font-bold">$665.00</span>
                </div>
                <div className="flex justify-between items-center text-grey font-medium">
                  <span>Shipping</span>
                  <span className="text-secondary font-bold">$25.00</span>
                </div>
                <div className="flex justify-between items-center text-grey font-medium">
                  <span>Tax (8.25%)</span>
                  <span className="text-secondary font-bold">$54.86</span>
                </div>
                <div className="my-2 border-t border-dashed border-taupe/20"></div>
                <div className="flex justify-between items-end">
                  <span className="text-secondary font-bold text-lg">Grand Total</span>
                  <span className="text-2xl font-serif font-bold text-primary">$744.86</span>
                </div>
              </div>
              <button className="w-full mt-8 flex items-center justify-center gap-2 rounded-xl bg-background-light hover:bg-taupe/20 border border-secondary text-secondary px-4 py-3 text-sm font-bold transition-all">
                <FiRefreshCw /> Reorder Items
              </button>
            </div>

            <div className="rounded-2xl border border-taupe/20 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-background-light">
                <FiTruck className="text-primary text-xl" />
                <h4 className="text-secondary font-serif font-bold text-lg">Shipping</h4>
              </div>
              <div className="text-sm space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-taupe uppercase tracking-widest mb-2">Delivery Address</p>
                  <p className="text-secondary font-bold text-base">Katherine Peterson</p>
                  <p className="text-grey font-medium">1234 Luxury Lane, Apt 4B</p>
                  <p className="text-grey font-medium">Austin, TX 78701</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-taupe uppercase tracking-widest mb-2">Shipping Method</p>
                  <p className="text-secondary font-bold">FedEx Priority Overnight</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-taupe/20 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-background-light">
                <FiCreditCard className="text-primary text-xl" />
                <h4 className="text-secondary font-serif font-bold text-lg">Payment</h4>
              </div>
              <div className="text-sm space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-taupe uppercase tracking-widest mb-2">Payment Method</p>
                  <div className="flex items-center gap-3 text-secondary bg-background-light p-3 rounded-xl border border-taupe/10">
                    <FiCreditCard className="text-xl" />
                    <div className="flex flex-col">
                      <span className="font-bold">Visa ending in 4242</span>
                      <span className="text-[10px] text-grey uppercase tracking-widest">Exp: 12/26</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
