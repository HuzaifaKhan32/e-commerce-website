
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiPackage, FiTruck, FiCheck, FiHome, FiInfo, FiCreditCard, FiDownload, FiRefreshCw, FiHelpCircle, FiLoader } from 'react-icons/fi';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (e) {
        console.error("Failed to fetch order", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32 animate-fade-in">
        <FiLoader className="animate-spin text-5xl text-primary mb-4" />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-20">Order not found</div>;
  }

  const getStatusProgress = (status: string) => {
    const steps = ['pending', 'confirmed', 'shipped', 'completed'];
    const currentIdx = steps.indexOf(status.toLowerCase());
    
    if (status.toLowerCase() === 'not confirmed') return 0;
    if (currentIdx === -1) return 0;
    
    // Weight each step: 0%, 33%, 66%, 100%
    return (currentIdx / (steps.length - 1)) * 100;
  };

  const currentStatus = order.status.toLowerCase();
  const progressWidth = getStatusProgress(currentStatus);

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
          <h1 className="text-secondary text-3xl md:text-4xl font-serif font-bold tracking-tight">Order #{order.id.slice(0, 8)}</h1>
          <div className="flex items-center gap-3 text-grey text-sm font-medium">
            <span>Placed on {new Date(order.created_at).toLocaleDateString()}</span>
            <span className="h-1 w-1 rounded-full bg-taupe/40"></span>
            <span>{order.order_items.length} Items</span>
            <span className="h-1 w-1 rounded-full bg-taupe/40"></span>
            <span className="text-primary font-bold">Total: ${parseFloat(order.total).toFixed(2)}</span>
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
              <p className="text-secondary text-lg font-bold font-serif uppercase tracking-widest">{order.status}</p>
              <p className="text-grey text-sm mt-1">Order Status Update: <span className="text-secondary font-bold">{new Date(order.created_at).toLocaleDateString()}</span></p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                currentStatus === 'not confirmed' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-primary/5 text-primary border-primary/10'
            }`}>
              {currentStatus !== 'completed' && <span className="h-2 w-2 rounded-full bg-current animate-pulse"></span>}
              {order.status}
            </div>
          </div>
          
          <div className="relative w-full py-8 px-2">
            <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-background-light rounded-full"></div>
            <div 
                className="absolute top-1/2 left-0 h-1 bg-primary transition-all duration-1000 rounded-full"
                style={{ width: `${progressWidth}%` }}
            ></div>
            <div className="relative flex w-full justify-between">
              <div className="flex flex-col items-center gap-3">
                <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white shadow-sm transition-colors ${progressWidth >= 0 ? 'bg-primary text-white' : 'bg-background-light text-taupe'}`}>
                  {progressWidth > 0 ? <FiCheck /> : <FiPackage />}
                </div>
                <p className="hidden md:block absolute top-12 text-[10px] font-bold text-secondary uppercase tracking-widest">Pending</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white shadow-sm transition-colors ${progressWidth >= 33 ? 'bg-primary text-white' : 'bg-background-light text-taupe'}`}>
                  {progressWidth > 33 ? <FiCheck /> : <FiCheck />}
                </div>
                <p className="hidden md:block absolute top-12 text-[10px] font-bold text-secondary uppercase tracking-widest">Confirmed</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className={`z-10 flex h-10 w-10 -mt-1 items-center justify-center rounded-full ring-4 ring-white shadow-lg transition-colors ${progressWidth >= 66 ? 'bg-primary text-white' : 'bg-background-light text-taupe'}`}>
                  <FiTruck className="text-lg" />
                </div>
                <p className="hidden md:block absolute top-14 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Shipped</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white shadow-sm transition-colors ${progressWidth >= 100 ? 'bg-primary text-white' : 'bg-background-light text-taupe'}`}>
                  <FiHome />
                </div>
                <p className="hidden md:block absolute top-12 text-[10px] font-bold text-secondary uppercase tracking-widest">Delivered</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-background-light p-4 border border-taupe/10 flex items-start gap-3">
            <FiInfo className="text-primary mt-1 shrink-0" />
            <div className="text-sm text-grey">
              <p className="mb-1 text-secondary font-bold">Latest Update</p>
              <p className="font-medium">
                {currentStatus === 'pending' && "Your order is awaiting confirmation from our artisans."}
                {currentStatus === 'confirmed' && "Your masterpiece is being carefully prepared and packaged."}
                {currentStatus === 'shipped' && "Your package is currently in transit to your destination."}
                {currentStatus === 'completed' && "Your heritage piece has been delivered. Enjoy the luxury."}
                {currentStatus === 'not confirmed' && "There is an issue with your order. Please contact support."}
              </p>
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
                  {order.order_items.map((item: any) => (
                    <tr key={item.id} className="group hover:bg-background-light/30 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-taupe/10 bg-background-light">
                            <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-base font-bold text-secondary font-serif">{item.products.name}</p>
                            <p className="text-xs text-grey font-medium mt-1">Color: {item.color || 'Original'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center text-sm font-bold text-primary">${parseFloat(item.price).toFixed(2)}</td>
                      <td className="px-6 py-6 text-center text-sm text-grey font-medium">{item.quantity}</td>
                      <td className="px-6 py-6 text-right text-sm font-bold text-secondary">${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
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
                  <span className="text-secondary font-bold">${parseFloat(order.total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-grey font-medium">
                  <span>Shipping</span>
                  <span className="text-secondary font-bold">$0.00</span>
                </div>
                <div className="flex justify-between items-center text-grey font-medium">
                  <span>Tax (0%)</span>
                  <span className="text-secondary font-bold">$0.00</span>
                </div>
                <div className="my-2 border-t border-dashed border-taupe/20"></div>
                <div className="flex justify-between items-end">
                  <span className="text-secondary font-bold text-lg">Grand Total</span>
                  <span className="text-2xl font-serif font-bold text-primary">${parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full mt-8 flex items-center justify-center gap-2 rounded-xl bg-background-light hover:bg-taupe/20 border border-secondary text-secondary px-4 py-3 text-sm font-bold transition-all">
                <FiRefreshCw /> Reorder Items
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
