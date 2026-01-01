
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiShoppingCart, FiPackage, FiCreditCard, FiHelpCircle, FiGift } from 'react-icons/fi';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error("Failed to fetch orders", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  const latestOrder = orders[0];
  const previousOrders = orders.slice(1);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary font-serif tracking-tight">
            Hello, {session?.user?.name?.split(' ')[0] || 'Member'}
          </h1>
          <p className="text-grey mt-1">Here's what's happening with your latest purchases.</p>
        </div>
        <Link href="/shop">
          <button className="hidden md:flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary transition-colors shadow-md">
            <FiShoppingCart className="text-[18px]" />
            Continue Shopping
          </button>
        </Link>
      </div>

      {/* Current Orders Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-secondary">Latest Order</h2>
        </div>
        
        {isLoading ? (
          <div className="bg-white border border-taupe/20 rounded-xl p-6 animate-pulse">
            <div className="h-40 bg-background-light rounded-lg"></div>
          </div>
        ) : latestOrder ? (
          <div className="bg-white border border-taupe/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="w-full md:w-48 aspect-[4/3] md:aspect-square shrink-0 rounded-lg overflow-hidden bg-background-light relative border border-taupe/10">
                <img 
                  src={latestOrder.order_items[0]?.products?.image_url || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800"} 
                  alt="Product" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-md border border-primary/20 uppercase tracking-wide">
                  {latestOrder.status}
                </span>
              </div>
              {/* Order Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-secondary">
                        {latestOrder.order_items[0]?.products?.name}
                        {latestOrder.order_items.length > 1 && ` + ${latestOrder.order_items.length - 1} more items`}
                      </h3>
                      <p className="text-sm text-grey font-medium">Order #{latestOrder.id.slice(0, 8)} • Placed on {new Date(latestOrder.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="font-serif font-bold text-lg text-secondary">${parseFloat(latestOrder.total).toFixed(2)}</p>
                  </div>
                  <div className="bg-background-light p-4 rounded-xl mb-4 border border-taupe/10 mt-4">
                    <div className="flex items-center gap-3 text-secondary">
                      <FiPackage className="text-primary text-xl" />
                      <div>
                        <p className="text-sm font-bold">Status: {latestOrder.status.charAt(0).toUpperCase() + latestOrder.status.slice(1)}</p>
                        <p className="text-xs text-grey">Your order is being processed and will be with you soon.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  <Link href={`/dashboard/orders/${latestOrder.id}`}>
                    <button className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm shadow-primary/20 flex items-center gap-2">
                      View Order Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-taupe/20 border-dashed rounded-xl p-12 text-center">
            <FiPackage className="text-4xl text-taupe mx-auto mb-4" />
            <h3 className="text-lg font-bold text-secondary mb-2">No orders yet</h3>
            <p className="text-grey mb-6">Discover our latest collection and place your first order.</p>
            <Link href="/shop">
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-primary/20">Start Shopping</button>
            </Link>
          </div>
        )}
      </section>

      {/* Previous Orders Section */}
      {previousOrders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-secondary">Order History</h2>
            <Link href="/dashboard/orders" className="text-primary text-sm font-bold hover:underline">View All Orders</Link>
          </div>
          <div className="bg-white border border-taupe/20 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                  <tr className="bg-background-light border-b border-taupe/20">
                    <th className="p-4 text-xs font-bold text-taupe uppercase tracking-wider">Order ID</th>
                    <th className="p-4 text-xs font-bold text-taupe uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-bold text-taupe uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-taupe uppercase tracking-wider">Total</th>
                    <th className="p-4 text-xs font-bold text-taupe uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-taupe/10">
                  {previousOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-background-light/50 transition-colors">
                      <td className="p-4 text-sm font-medium text-secondary">#{order.id.slice(0, 8)}</td>
                      <td className="p-4 text-sm text-grey">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          <span className={`size-1.5 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-bold text-secondary font-serif">${parseFloat(order.total).toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-primary text-sm font-bold hover:underline">View Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-taupe/20 p-6 rounded-xl hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-background-light p-3 rounded-xl group-hover:bg-primary/10 transition-colors text-secondary group-hover:text-primary">
              <FiCreditCard className="text-xl" />
            </div>
            <h3 className="font-bold text-secondary">Payment Methods</h3>
          </div>
          <p className="text-sm text-grey leading-relaxed">Manage your saved cards and billing information.</p>
        </div>
        <div className="bg-white border border-taupe/20 p-6 rounded-xl hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-background-light p-3 rounded-xl group-hover:bg-primary/10 transition-colors text-secondary group-hover:text-primary">
              <FiHelpCircle className="text-xl" />
            </div>
            <h3 className="font-bold text-secondary">Need Help?</h3>
          </div>
          <p className="text-sm text-grey leading-relaxed">Our concierge team is here to assist you 24/7.</p>
        </div>
        <div className="bg-white border border-taupe/20 p-6 rounded-xl hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-background-light p-3 rounded-xl group-hover:bg-primary/10 transition-colors text-secondary group-hover:text-primary">
              <FiGift className="text-xl" />
            </div>
            <h3 className="font-bold text-secondary">Gift Cards</h3>
          </div>
          <p className="text-sm text-grey leading-relaxed">Check your balance or redeem a new gift card.</p>
        </div>
      </section>
    </div>
  );
}
