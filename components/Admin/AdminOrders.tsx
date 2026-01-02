'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMoreVertical, FiEye, FiTruck } from 'react-icons/fi';

interface AdminOrdersProps {
  onShipOrder?: (data: { customerName: string }) => void;
}

interface Order {
    id: string;
    total: number;
    status: string;
    created_at: string;
    users: { name: string; email: string };
    order_items: { id: string; quantity: number; products: { name: string; image_url: string } }[];
}

const AdminOrders: React.FC<AdminOrdersProps> = ({ onShipOrder }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
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
    } catch (e) {
      console.error("Failed to fetch orders", e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.includes(searchTerm) || o.users?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'confirmed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'not confirmed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-grey/10 text-grey border-grey/20';
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus.toLowerCase() } : o));
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      console.error("Error updating order status", e);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-secondary tracking-tight">Orders Ledger</h1>
          <p className="text-grey font-light text-sm mt-1">Registry of all Lusso Maison transactions.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e0d8] flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe text-lg" />
            <input 
              type="text" 
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-[#f8f7f6] border border-[#e5e0d8] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
          <button className="h-11 px-6 flex items-center gap-2 rounded-xl border border-[#e5e0d8] text-secondary font-bold text-xs uppercase tracking-widest hover:bg-[#f8f7f6] transition-all">
            <FiFilter /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
             <div className="p-10 text-center text-grey">Loading orders...</div>
          ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8f7f6] border-b border-[#e5e0d8] text-[10px] font-black text-taupe uppercase tracking-[0.2em]">
                <th className="py-5 px-8 text-primary">Order ID</th>
                <th className="py-5 px-8">Customer</th>
                <th className="py-5 px-8">Date</th>
                <th className="py-5 px-8">Status</th>
                <th className="py-5 px-8 text-right">Total</th>
                <th className="py-5 px-8 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e0d8]">
              {filteredOrders.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="p-10 text-center text-grey text-sm">No orders found.</td>
                 </tr>
              ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#f8f7f6]/50 transition-colors">
                  <td className="py-5 px-8">
                    <span className="text-sm font-black text-primary">#{o.id.substring(0, 8)}</span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-taupe/20 border border-taupe/20 overflow-hidden shrink-0 flex items-center justify-center font-black text-[10px] text-secondary">
                        {o.users?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-secondary truncate">{o.users?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-grey uppercase tracking-widest">{o.users?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-sm text-grey font-medium">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="py-5 px-8">
                    <div className="relative group/status">
                      <select 
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all focus:ring-2 focus:ring-primary/20 outline-none ${getStatusColor(o.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="not confirmed">Not Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                      </select>
                      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current opacity-50">
                        <FiMoreVertical className="rotate-90" />
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right font-black text-secondary text-sm">${Number(o.total).toFixed(2)}</td>
                  <td className="py-5 px-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {o.status === 'pending' && (
                        <button 
                            onClick={() => onShipOrder?.({ customerName: o.users?.name })}
                            className="p-2.5 text-primary hover:text-secondary transition-all rounded-lg bg-primary/10 hover:bg-primary/20 shadow-sm flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                        >
                            <FiTruck className="text-lg" /> Ship
                        </button>
                      )}
                      <button className="p-2.5 text-taupe hover:text-primary transition-all rounded-lg hover:bg-white shadow-sm">
                        <FiEye className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;