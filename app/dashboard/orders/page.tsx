
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiPackage, FiTruck, FiCheck, FiChevronRight, FiRefreshCw } from 'react-icons/fi';

export default function OrdersPage() {
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

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-1 pb-4 border-b border-taupe/20">
        <h1 className="text-3xl font-bold text-secondary font-serif tracking-tight">My Orders</h1>
        <p className="text-grey">Track your shipments and view order history.</p>
      </div>

      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="bg-white border border-taupe/20 rounded-2xl p-6 animate-pulse h-40"></div>
        ) : orders.map((order) => (
          <div key={order.id} className="bg-white border border-taupe/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-32 aspect-square shrink-0 rounded-xl overflow-hidden bg-background-light border border-taupe/10">
                <img src={order.order_items[0]?.products?.image_url || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800"} alt="Product" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-secondary">Order #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-grey font-medium">Placed on {new Date(order.created_at).toLocaleDateString()} • {order.order_items.length} {order.order_items.length > 1 ? 'Items' : 'Item'}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 border ${
                        order.status === 'delivered' 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {order.status}
                      </span>
                      <p className="font-serif font-bold text-lg text-secondary">${parseFloat(order.total).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href={`/dashboard/orders/${order.id}`} className="flex-1 md:flex-none">
                    <button className="w-full bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                      View Order Details <FiChevronRight />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && orders.length === 0 && (
          <div className="py-20 text-center bg-white border border-taupe/20 border-dashed rounded-2xl">
            <FiPackage className="text-5xl text-taupe mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary mb-2">No orders yet</h3>
            <p className="text-grey mb-8">You haven't placed any orders with us yet.</p>
            <Link href="/shop">
              <button className="bg-primary text-white px-10 py-3 rounded-xl font-bold">Explore Our Shop</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
