'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiCheck, FiX, FiUploadCloud, FiImage } from 'react-icons/fi';
import { Product } from '@/types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Leather Goods',
    price: '',
    stock: '',
    image_url: '',
    description: ''
  });

  useEffect(() => {
     fetchProducts();
  }, []);

  const fetchProducts = async () => {
     setIsLoading(true);
     try {
       const res = await fetch('/api/products');
       if (res.ok) {
         const data = await res.json();
         const mapped = data.map((p: any) => ({
             id: p.id,
             name: p.name,
             price: p.price,
             rating: p.rating || 0,
             reviewCount: p.review_count || 0,
             imageUrl: p.image_url || '',
             category: p.category || 'Uncategorized',
             stock: p.stock || 0,
             description: p.description || ''
         }));
         setProducts(mapped);
       }
     } catch (e) {
       console.error("Failed to fetch products", e);
     } finally {
       setIsLoading(false);
     }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
       try {
         const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
         if (res.ok) {
             setProducts(products.filter(p => p.id !== id));
         } else {
             alert("Failed to delete product");
         }
       } catch (e) {
         console.error(e);
       }
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setIsEditing(true);
      setFormData({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock?.toString() || '0',
        image_url: product.imageUrl,
        description: product.description || ''
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: '',
        name: '',
        category: 'Leather Goods',
        price: '',
        stock: '',
        image_url: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const payload = {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock) || 0,
            image_url: formData.image_url,
            description: formData.description,
            ...(isEditing ? { id: formData.id } : { rating: 0, review_count: 0 })
        };

        const method = isEditing ? 'PUT' : 'POST';
        const res = await fetch('/api/products', {
            method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            fetchProducts();
            setIsModalOpen(false);
        } else {
            alert(`Failed to ${isEditing ? 'update' : 'create'} product`);
        }
    } catch (e) {
        console.error(e);
    }
  };

  // Drag and Drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file");
        return;
      }

      // In a real app, we would upload to Supabase Storage here
      // For now, since we don't have the storage bucket setup guaranteed,
      // we'll simulate it by using a FileReader for preview, but warn the user.
      // Or we can try to upload if we had an endpoint.
      
      // Let's create a temporary object URL for preview
      // const objectUrl = URL.createObjectURL(file);
      // setFormData(prev => ({ ...prev, image_url: objectUrl }));
      
      alert("Drag & Drop file detected. Please note: Actual file uploading to Supabase Storage requires a 'products' bucket. For now, please use the Image URL field for permanent storage.");
    }
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-secondary tracking-tight">Product Catalog</h1>
          <p className="text-grey font-light text-sm mt-1">Manage your collection of handcrafted heritage.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="h-12 px-8 flex items-center gap-3 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-lg shadow-primary/30 transition-all"
        >
          <FiPlus className="text-lg" /> New Product
        </button>
      </div>

      {/* Main Table Area - Same as before but with minor tweaks */}
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
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
              <div className="p-10 text-center text-grey">Loading inventory...</div>
          ) : (
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
                      <div className="size-14 rounded-xl overflow-hidden border border-taupe/20 shrink-0 bg-gray-100">
                         {p.imageUrl ? (
                           <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                         ) : (
                           <FiImage className="w-full h-full p-4 text-taupe" />
                         )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-secondary truncate">{p.name}</p>
                        <p className="text-[10px] text-grey uppercase tracking-widest">ID: #{p.id.substring(0, 8)}</p>
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
                      <p className="text-sm font-bold text-secondary">{(p as any).stock || 0} in stock</p>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <p className="text-sm font-black text-secondary">${p.price.toFixed(2)}</p>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openModal(p)}
                        className="p-3 text-taupe hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm"
                      >
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
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-[#e5e0d8] overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#e5e0d8] flex justify-between items-center bg-[#f8f7f6]">
              <div>
                <h3 className="text-2xl font-black text-secondary tracking-tight">
                  {isEditing ? 'Edit Masterpiece' : 'New Masterpiece'}
                </h3>
                <p className="text-xs text-grey font-light">
                  {isEditing ? 'Update item details' : 'Add a new item to your luxury collection.'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-taupe hover:text-primary transition-colors">
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              {/* Image Section with Drag & Drop */}
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Product Imagery</label>
                 
                 <div className="flex gap-4 items-start">
                    {/* Preview Box */}
                    <div className="size-32 rounded-xl bg-ivory border-2 border-dashed border-taupe/30 flex items-center justify-center shrink-0 overflow-hidden relative group">
                        {formData.image_url ? (
                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <FiImage className="text-3xl text-taupe/50" />
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div 
                          className={`relative w-full h-20 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${dragActive ? 'border-primary bg-primary/5' : 'border-taupe/30 hover:border-primary/50'}`}
                          onDragEnter={handleDrag} 
                          onDragLeave={handleDrag} 
                          onDragOver={handleDrag} 
                          onDrop={handleDrop}
                        >
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    alert("File selected. Please use URL for now as storage is not configured.");
                                }
                            }} />
                            <div className="text-center pointer-events-none">
                                <p className="text-xs font-bold text-secondary flex items-center justify-center gap-2">
                                    <FiUploadCloud className="text-lg" />
                                    <span>Drag & Drop or Click to Upload</span>
                                </p>
                                <p className="text-[10px] text-grey mt-1">Supports JPG, PNG, WEBP</p>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-taupe">URL</span>
                            <input 
                                type="text" 
                                placeholder="https://..."
                                value={formData.image_url}
                                onChange={e => setFormData({...formData, image_url: e.target.value})}
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-taupe/30 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
                            />
                        </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Product Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                   />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                   >
                    <option>Leather Goods</option>
                    <option>Accessories</option>
                    <option>Footwear</option>
                    <option>Jackets</option>
                    <option>Featured</option>
                    <option>Best Seller</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Price (USD)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                   />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Initial Inventory</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Description</label>
                <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full p-4 rounded-xl border border-taupe/30 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none text-sm"
                    placeholder="Describe the craftsmanship, materials, and story..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-xl border border-taupe/30 text-secondary font-bold text-sm uppercase tracking-widest hover:bg-[#f8f7f6] transition-all">Cancel</button>
                <button type="submit" className="flex-1 h-14 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:opacity-90 shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2">
                  <FiCheck className="text-xl" /> {isEditing ? 'Update Item' : 'Create Item'}
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