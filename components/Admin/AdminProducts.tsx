
import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiCheck, FiX } from 'react-icons/fi';
import { FEATURED_PRODUCTS, BEST_SELLERS } from '../../constants.ts';
import { Product } from '../../types.ts';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([...FEATURED_PRODUCTS, ...BEST_SELLERS]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this masterpiece from your collection?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-secondary tracking-tight">Product Catalog</h1>
          <p className="text-grey font-light text-sm mt-1">Manage your collection of handcrafted heritage.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="h-12 px-8 flex items-center gap-3 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-lg shadow-primary/30 transition-all"
        >
          <FiPlus className="text-lg" /> New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e0d8] flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe text-lg" />
            <input 
              type="text" 
              placeholder="Filter products..."
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
                <th className="py-5 px-8">Product</th>
                <th className="py-5 px-8">Category</th>
                <th className="py-5 px-8">Inventory</th>
                <th className="py-5 px-8">Price</th>
                <th className="py-5 px-8 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e0d8]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#f8f7f6]/50 transition-colors group">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="size-14 rounded-xl overflow-hidden border border-taupe/20 shrink-0">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-secondary truncate">{p.name}</p>
                        <p className="text-[10px] text-grey uppercase tracking-widest">ID: #{p.id.padStart(5, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className="px-3 py-1.5 rounded-full bg-ivory text-secondary border border-taupe/20 text-[10px] font-black uppercase tracking-widest">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-secondary">24 in stock</p>
                      <div className="w-24 h-1.5 bg-taupe/20 rounded-full mt-2 overflow-hidden">
                        <div className="w-2/3 h-full bg-primary rounded-full"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <p className="text-sm font-black text-secondary">${p.price.toFixed(2)}</p>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-3 text-taupe hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm">
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-3 text-taupe hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-secondary/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-[#e5e0d8] overflow-hidden animate-scale-in">
            <div className="p-8 border-b border-[#e5e0d8] flex justify-between items-center bg-[#f8f7f6]">
              <div>
                <h3 className="text-2xl font-black text-secondary tracking-tight">New Masterpiece</h3>
                <p className="text-xs text-grey font-light">Add a new item to your luxury collection.</p>
              </div>
              <button onClick={() => setIsAdding(false)} className="p-2 text-taupe hover:text-primary transition-colors">
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <form className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Product Name</label>
                  <input type="text" className="w-full h-12 px-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Category</label>
                  <select className="w-full h-12 px-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all">
                    <option>Leather Goods</option>
                    <option>Accessories</option>
                    <option>Footwear</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Price (USD)</label>
                  <input type="number" className="w-full h-12 px-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Initial Inventory</label>
                  <input type="number" className="w-full h-12 px-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Product Image URL</label>
                <input type="text" className="w-full h-12 px-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 h-14 rounded-xl border border-taupe/30 text-secondary font-bold text-sm uppercase tracking-widest hover:bg-[#f8f7f6] transition-all">Cancel</button>
                <button type="submit" className="flex-1 h-14 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:opacity-90 shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2">
                  <FiCheck className="text-xl" /> Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
