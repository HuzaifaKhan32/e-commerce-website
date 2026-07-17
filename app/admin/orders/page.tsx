'use client';

import React, { useEffect, useState } from 'react';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiLoader } from 'react-icons/fi';

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  users: {
    name: string;
    email: string;
  };
  order_items: {
    id: string;
    quantity: number;
    price: number;
    products: {
      name: string;
    };
  }[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (res.ok) {
        fetchOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update order status');
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif font-bold text-secondary mb-2">Orders</h1>
        <p className="text-grey">Manage and track customer orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-taupe/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ivory/30 border-b border-taupe/20">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Order ID</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Items</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Total</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Date</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe/10">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-ivory/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-bold text-secondary">
                    {order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-secondary">{order.users.name}</p>
                      <p className="text-xs text-grey">{order.users.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-grey">{order.order_items.length} items</td>
                  <td className="px-6 py-4 font-bold text-primary">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest w-fit ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-grey text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="px-3 py-2 border border-taupe/30 rounded-lg text-xs font-bold bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="bg-white rounded-2xl border border-taupe/20 border-dashed p-12 text-center">
          <FiPackage className="text-6xl text-taupe/40 mx-auto mb-4" />
          <p className="text-grey font-medium">No orders yet</p>
        </div>
      )}
    </div>
  );
}
