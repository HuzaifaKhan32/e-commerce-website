
import React, { useState } from 'react';
import { FiSearch, FiFilter, FiMoreVertical, FiEye, FiTruck } from 'react-icons/fi';

interface AdminOrdersProps {
  onShipOrder?: (data: { customerName: string }) => void;
}

const AdminOrders: React.FC<AdminOrdersProps> = ({ onShipOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockOrders = [
    { id: '10234', customer: 'James Doe', email: 'james@example.com', date: 'Oct 24, 2023', status: 'Completed', total: '$450.00', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { id: '10235', customer: 'Sarah Smith', email: 'sarah.s@example.com', date: 'Oct 24, 2023', status: 'Processing', total: '$1,205.00', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: '10236', customer: 'Robert Jones', email: 'robert.j@example.com', date: 'Oct 23, 2023', status: 'Pending', total: '$220.00', img: '' },
    { id: '10237', customer: 'Emily Davis', email: 'emily.d@example.com', date: 'Oct 23, 2023', status: 'Completed', total: '$75.00', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100' },
  ];

  const filteredOrders = mockOrders.filter(o => 
    o.id.includes(searchTerm) || o.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-grey/10 text-grey border-grey/20';
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
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#f8f7f6]/50 transition-colors">
                  <td className="py-5 px-8">
                    <span className="text-sm font-black text-primary">#{o.id}</span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-taupe/20 border border-taupe/20 overflow-hidden shrink-0 flex items-center justify-center font-black text-[10px] text-secondary">
                        {o.img ? <img src={o.img} alt={o.customer} className="w-full h-full object-cover" /> : o.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-secondary truncate">{o.customer}</p>
                        <p className="text-[10px] text-grey uppercase tracking-widest">{o.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-sm text-grey font-medium">{o.date}</td>
                  <td className="py-5 px-8">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(o.status)}`}>
                      <span className="size-1.5 rounded-full bg-current mr-2"></span>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right font-black text-secondary text-sm">{o.total}</td>
                  <td className="py-5 px-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {o.status === 'Processing' && (
                        <button 
                            onClick={() => onShipOrder?.({ customerName: o.customer })}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
