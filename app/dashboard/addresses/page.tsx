
'use client';

import React, { useEffect, useState } from 'react';
import { FiPlus, FiHome, FiBriefcase, FiMapPin, FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (e) {
      console.error("Failed to fetch addresses", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taupe/20">
        <div className="flex flex-col">
          <h2 className="text-secondary text-3xl font-serif font-bold leading-tight">Saved Addresses</h2>
          <p className="text-grey text-sm mt-1">Manage your shipping destinations for a faster checkout.</p>
        </div>
        <button className="flex w-full sm:w-auto items-center justify-center rounded-xl h-12 px-6 bg-primary hover:bg-secondary transition-all text-white gap-2 text-sm font-bold shadow-md shadow-primary/20">
          <FiPlus className="text-[18px]" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="bg-white border border-taupe/20 rounded-2xl p-6 animate-pulse h-48"></div>
        ) : addresses.map((address) => (
          <div key={address.id} className={`group relative flex flex-col bg-white rounded-2xl p-6 border transition-all duration-300 shadow-sm hover:shadow-md ${address.is_default ? 'border-primary' : 'border-taupe/20'}`}>
            {address.is_default && (
              <div className="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1 uppercase tracking-wider">
                <FiCheckCircle className="text-[12px]" />
                Default
              </div>
            )}
            
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-3 rounded-xl ${address.is_default ? 'bg-primary/10 text-primary' : 'bg-background-light text-taupe'}`}>
                {address.type === 'Home' ? <FiHome /> : <FiBriefcase />}
              </div>
              <div>
                <h3 className="text-secondary text-lg font-bold">{address.name}</h3>
                <p className="text-tau/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{address.type}</p>
              </div>
            </div>

            <div className="flex-1 text-grey text-sm leading-relaxed mb-8 space-y-1 font-medium">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.postal_code}</p>
              <p>{address.country}</p>
              <p className="pt-2 text-secondary font-bold">{address.phone}</p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-taupe/20">
              <button className="text-secondary hover:text-primary text-xs font-bold flex items-center gap-2 transition-colors">
                <FiEdit2 /> Edit
              </button>
              <div className="h-4 w-px bg-taupe/20"></div>
              <button className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-2 transition-colors">
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}

        {!isLoading && addresses.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-taupe/20 border-dashed rounded-2xl">
            <FiMapPin className="text-4xl text-taupe mx-auto mb-4" />
            <p className="text-grey font-medium">No saved addresses yet.</p>
          </div>
        )}

        <button className="flex flex-col items-center justify-center min-h-[240px] rounded-2xl border-2 border-dashed border-taupe/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
          <div className="size-14 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform border border-taupe/10">
            <FiPlus className="text-taupe group-hover:text-primary text-3xl" />
          </div>
          <span className="text-secondary font-bold text-lg">Add New Address</span>
          <span className="text-grey text-sm mt-1">Ship to a new destination</span>
        </button>
      </div>
    </div>
  );
}
