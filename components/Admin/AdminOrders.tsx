'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMoreVertical, FiEye, FiTruck, FiChevronDown, FiChevronUp } from 'react-icons/fi';

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
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
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

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="animate-fade-in relative">
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
          <table className="w-full text-left border-collapse">
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
                <React.Fragment key={o.id}>
                  <tr className={`transition-colors ${expandedOrderId === o.id ? 'bg-[#f8f7f6]' : 'hover:bg-[#f8f7f6]/50'}`}>
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
                          onClick={(e) => e.stopPropagation()}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                onShipOrder?.({ customerName: o.users?.name });
                              }}
                              className="p-2.5 text-primary hover:text-secondary transition-all rounded-lg bg-primary/10 hover:bg-primary/20 shadow-sm flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                          >
                              <FiTruck className="text-lg" /> Ship
                          </button>
                        )}
                        <button 
                          onClick={() => toggleExpand(o.id)}
                          className={`p-2.5 transition-all rounded-lg shadow-sm flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${expandedOrderId === o.id ? 'bg-secondary text-white' : 'text-taupe hover:text-primary hover:bg-white'}`}
                        >
                          {expandedOrderId === o.id ? 'Close' : 'View'}
                          {expandedOrderId === o.id ? <FiChevronUp className="text-lg" /> : <FiChevronDown className="text-lg" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedOrderId === o.id && (
                    <tr className="bg-[#f8f7f6] animate-fade-in">
                      <td colSpan={6} className="p-0">
                        <div className="p-8 border-t border-[#e5e0d8] mx-4 mb-4 bg-white rounded-xl shadow-inner border border-taupe/10">
                          <div className="flex justify-between items-center mb-6 border-b border-taupe/10 pb-4">
                            <h3 className="text-xl font-bold text-secondary font-serif">Order Details <span className="text-taupe font-sans text-sm font-normal ml-2">#{o.id}</span></h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-taupe uppercase tracking-widest border-b border-taupe/10 pb-2">Customer Information</h4>
                              <div className="flex items-start gap-4">
                                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                  {o.users?.name?.[0] || 'U'}
                                </div>
                                <div>
                                  <p className="font-bold text-secondary text-lg">{o.users?.name}</p>
                                  <p className="text-sm text-grey">{o.users?.email}</p>
                                  <p className="text-xs text-taupe mt-1 uppercase tracking-widest">Premium Member</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-taupe uppercase tracking-widest border-b border-taupe/10 pb-2">Order Summary</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-grey mb-1">Order Date</p>
                                  <p className="font-bold text-secondary">{new Date(o.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-grey mb-1">Payment Status</p>
                                  <p className="font-bold text-green-600 flex items-center gap-1">
                                    <span className="size-2 rounded-full bg-green-500"></span> Paid
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-grey mb-1">Shipping Method</p>
                                  <p className="font-bold text-secondary">Standard Delivery</p>
                                </div>
                                <div>
                                  <p className="text-xs text-grey mb-1">Total Amount</p>
                                  <p className="font-bold text-primary text-xl">${Number(o.total).toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-taupe uppercase tracking-widest border-b border-taupe/10 pb-2 mb-4">Items Ordered ({o.order_items.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                              {o.order_items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-taupe/10 bg-[#f8f7f6]/50 hover:bg-[#f8f7f6] transition-colors">
                                  <div className="size-20 rounded-lg bg-white border border-taupe/10 overflow-hidden shrink-0">
                                    {item.products?.image_url ? (
                                      <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs text-grey">No Img</div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <p className="font-bold text-secondary text-sm truncate mb-1" title={item.products?.name}>{item.products?.name || 'Unknown Product'}</p>
                                    <div className="flex justify-between items-end">
                                      <p className="text-xs text-grey bg-white px-2 py-1 rounded border border-taupe/10 font-medium">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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