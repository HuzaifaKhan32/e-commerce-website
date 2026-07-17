'use client';

import React, { useEffect, useState } from 'react';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiLoader, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';
import { formatPrice } from '@/utils/orderSummary';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setError('Failed to load orders');
      }
    } catch (e) {
      console.error('Failed to fetch orders', e);
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'processing':
        return <FiPackage className="text-blue-500" />;
      case 'shipped':
        return <FiTruck className="text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taupe/20">
        <div className="flex flex-col">
          <h2 className="text-secondary text-3xl font-serif font-bold leading-tight">Order History</h2>
          <p className="text-grey text-sm mt-1">View and track all your orders.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-4 text-sm font-medium">
          {error}
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-taupe/20 border-dashed">
          <FiShoppingBag className="text-6xl text-taupe/40 mb-6" />
          <h3 className="text-2xl font-serif font-bold text-secondary mb-2">No Orders Yet</h3>
          <p className="text-grey mb-8 text-center max-w-md">
            You haven not placed any orders yet. Start shopping to see your order history here.
          </p>
          <Link href="/shop">
            <button className="bg-secondary hover:bg-primary text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-taupe/20 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="bg-ivory/30 px-6 py-4 border-b border-taupe/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-taupe uppercase tracking-widest">Order ID</p>
                    <p className="text-secondary font-bold font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-taupe uppercase tracking-widest">Date</p>
                    <p className="text-secondary font-medium text-sm">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-taupe uppercase tracking-widest">Total</p>
                    <p className="text-primary font-bold text-lg">{formatPrice(order.total)}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-taupe/10 last:border-0 last:pb-0">
                      <div className="w-20 h-20 bg-ivory rounded-lg overflow-hidden shrink-0 border border-taupe/10">
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-secondary font-bold text-base truncate">{item.products.name}</h4>
                        <p className="text-grey text-sm mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-secondary font-bold font-serif">{formatPrice(item.price)}</p>
                        <p className="text-[10px] text-taupe uppercase tracking-widest mt-1">Per Item</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-taupe/20 flex flex-wrap items-center justify-between gap-4">
                  <button className="text-primary hover:text-secondary text-sm font-bold uppercase tracking-widest transition-colors underline underline-offset-4">
                    View Details
                  </button>
                  {order.status.toLowerCase() === 'delivered' && (
                    <Link href="/shop">
                      <button className="px-6 py-3 bg-secondary hover:bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md">
                        Buy Again
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
