'use client';

import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  rating: number;
  review_count: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStock, setFormStock] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormPrice('');
    setFormImageUrl('');
    setFormCategory('');
    setFormDescription('');
    setFormStock('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormImageUrl(product.image_url);
    setFormCategory(product.category);
    setFormDescription('');
    setFormStock(product.stock.toString());
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: formName,
      price: parseFloat(formPrice),
      image_url: formImageUrl,
      category: formCategory,
      description: formDescription,
      stock: parseInt(formStock),
      ...(editingProduct ? { id: editingProduct.id } : {}),
    };

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
        toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
        toast.success('Product deleted successfully!');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary mb-2">Products</h1>
          <p className="text-grey">Manage your product catalog</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg"
        >
          <FiPlus className="text-xl" />
          Add Product
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-grey" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-taupe/20 rounded-xl bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
      </div>

      <div className="bg-white rounded-2xl border border-taupe/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ivory/30 border-b border-taupe/20">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Product</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Category</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Price</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Stock</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Rating</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-taupe uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe/10">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-ivory/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-taupe/10"
                      />
                      <span className="font-bold text-secondary">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-grey">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-primary">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-grey">{product.rating.toFixed(1)} ({product.review_count})</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-secondary/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-taupe/20">
              <h3 className="text-xl font-bold font-serif text-secondary">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-grey hover:text-secondary">
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div>
                <label className="block text-xs font-bold text-taupe uppercase tracking-widest mb-2">Product Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-taupe uppercase tracking-widest mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-taupe uppercase tracking-widest mb-2">Stock</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-taupe uppercase tracking-widest mb-2">Category</label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="e.g. Wallets, Bags, Accessories"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-taupe uppercase tracking-widest mb-2">Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-taupe uppercase tracking-widest mb-2">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-taupe/30 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[100px]"
                  placeholder="Product description..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-grey hover:bg-ivory rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-secondary hover:bg-primary text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="text-white" /> Saving...
                    </>
                  ) : (
                    'Save Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
