'use client';

import React from 'react';
import { FiTrendingUp, FiShoppingBag, FiDollarSign, FiUsers, FiCalendar, FiDownload, FiAlertCircle } from 'react-icons/fi';

const AdminDashboard: React.FC = () => {
  const [lowStockProducts, setLowStockProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          // Filter for products with stock <= 10
          const lowStock = data.filter((p: any) => p.stock !== undefined && p.stock <= 10);
          setLowStockProducts(lowStock);
        }
      } catch (e) {
        console.error("Failed to fetch products for low stock alert", e);
      }
    };
    fetchProducts();
  }, []);

  const stats = [
    { label: 'Total Sales', value: '$124,500', trend: '+12%', icon: <FiDollarSign />, color: 'bg-green-500/10 text-green-600' },
    { label: 'New Orders', value: '342', trend: '+5%', icon: <FiShoppingBag />, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Avg. Order', value: '$365', trend: '-2%', icon: <FiTrendingUp />, trendColor: 'text-red-500', color: 'bg-purple-500/10 text-purple-600' },
    { label: 'Total Customers', value: '1,205', trend: '+1%', icon: <FiUsers />, color: 'bg-orange-500/10 text-orange-600' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-secondary tracking-tight">Maison Overview</h1>
          <p className="text-grey font-light text-sm mt-1">Refined insights for your artisanal enterprise.</p>
        </div>
        <div className="flex gap-4">
          <button className="h-12 px-6 flex items-center gap-2 rounded-xl border border-[#e5e0d8] bg-white text-secondary font-bold text-xs uppercase tracking-widest hover:bg-[#f8f7f6] transition-all">
            <FiCalendar className="text-lg" /> Oct 24, 2023
          </button>
          <button className="h-12 px-6 flex items-center gap-2 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 shadow-lg shadow-primary/30 transition-all">
            <FiDownload className="text-lg" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-[#e5e0d8] shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${stat.trendColor || 'text-green-600 bg-green-500/10'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-secondary tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#e5e0d8] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-bold text-secondary uppercase tracking-widest">Revenue Growth</h3>
              <p className="text-xs text-grey font-light">Performance trajectory for October</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-primary"></span>
              <span className="text-0px font-bold text-grey uppercase tracking-widest">Revenue</span>
            </div>
          </div>
          
          <div className="relative h-64 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#eeaa2b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#eeaa2b" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,150 Q100,100 200,120 T400,80 T600,100 T800,20 V200 H0 Z" fill="url(#chartGradient)" />
              <path d="M0,150 Q100,100 200,120 T400,80 T600,100 T800,20" fill="none" stroke="#eeaa2b" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="flex justify-between mt-6 text-[10px] font-black text-taupe uppercase tracking-widest">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-[#e5e0d8] p-8 shadow-sm flex-1">
            <h3 className="text-lg font-bold text-secondary uppercase tracking-widest mb-6">Trending Styles</h3>
            <div className="space-y-6">
              {[
                { name: 'The Oxford Satchel', cat: 'Leather Goods', sales: '$12,400', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100' },
                { name: 'Classic Tote', cat: 'Featured', sales: '$8,320', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100' },
                { name: 'Executive Wallet', cat: 'Accessories', sales: '$5,150', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="size-12 rounded-lg overflow-hidden shrink-0 border border-taupe/20">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-secondary truncate">{item.name}</p>
                    <p className="text-[10px] text-grey uppercase tracking-widest">{item.cat}</p>
                  </div>
                  <p className="text-xs font-black text-secondary">{item.sales}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-orange-800 mb-4">
              <FiAlertCircle className="text-xl" />
              <h4 className="text-xs font-black uppercase tracking-widest">Low Stock Alerts</h4>
            </div>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-orange-900/60 font-medium">All stock levels healthy</p>
                </div>
              ) : (
                lowStockProducts.map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-xs">
                    <span className="text-orange-900 font-medium truncate max-w-[150px]" title={p.name}>
                      {p.name}
                    </span>
                    <span className="bg-orange-200 text-orange-900 font-black px-2 py-0.5 rounded text-[10px] whitespace-nowrap">
                      {p.stock} LEFT
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;