'use client';

import React, { useEffect, useState } from 'react';
import { 
  FiPlus, 
  FiHome, 
  FiBriefcase, 
  FiMapPin, 
  FiEdit2, 
  FiTrash2, 
  FiCheckCircle, 
  FiX, 
  FiLoader 
} from 'react-icons/fi';

interface Address {
  id: string;
  name: string;
  type: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at?: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Form fields state
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Home');
  const [formStreet, setFormStreet] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formPostalCode, setFormPostalCode] = useState('');
  const [formCountry, setFormCountry] = useState('Pakistan');
  const [formPhone, setFormPhone] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);

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
      console.error('Failed to fetch addresses', e);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormName('');
    setFormType('Home');
    setFormStreet('');
    setFormCity('');
    setFormState('');
    setFormPostalCode('');
    setFormCountry('Pakistan');
    setFormPhone('');
    setFormIsDefault(false);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setFormName(addr.name);
    setFormType(addr.type);
    setFormStreet(addr.street);
    setFormCity(addr.city);
    setFormState(addr.state);
    setFormPostalCode(addr.postal_code);
    setFormCountry(addr.country);
    setFormPhone(addr.phone);
    setFormIsDefault(addr.is_default);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formStreet || !formCity || !formState || !formPostalCode || !formPhone) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      name: formName,
      type: formType,
      street: formStreet,
      city: formCity,
      state: formState,
      postalCode: formPostalCode,
      country: formCountry,
      phone: formPhone,
      isDefault: formIsDefault,
      ...(editingAddress ? { id: editingAddress.id } : {})
    };

    try {
      const method = editingAddress ? 'PUT' : 'POST';
      const res = await fetch('/api/addresses', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchAddresses();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to save address.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const res = await fetch(`/api/addresses?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchAddresses();
      } else {
        alert('Failed to delete address.');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred.');
    }
  };

  const handleSetDefault = async (addr: Address) => {
    try {
      const res = await fetch('/api/addresses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: addr.id,
          name: addr.name,
          type: addr.type,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postal_code,
          country: addr.country,
          phone: addr.phone,
          isDefault: true
        })
      });

      if (res.ok) {
        fetchAddresses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taupe/20">
        <div className="flex flex-col">
          <h2 className="text-secondary text-3xl font-serif font-bold leading-tight">Saved Addresses</h2>
          <p className="text-grey text-sm mt-1">Manage your shipping destinations for a faster checkout.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex w-full sm:w-auto items-center justify-center rounded-xl h-12 px-6 bg-primary hover:bg-secondary transition-all text-white gap-2 text-sm font-bold shadow-md shadow-primary/20"
        >
          <FiPlus className="text-[18px]" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <FiLoader className="animate-spin text-4xl text-primary" />
          </div>
        ) : (
          addresses.map((address) => (
            <div 
              key={address.id} 
              className={`group relative flex flex-col bg-white rounded-2xl p-6 border transition-all duration-300 shadow-sm hover:shadow-md ${
                address.is_default ? 'border-primary' : 'border-taupe/20'
              }`}
            >
              {address.is_default && (
                <div className="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1 uppercase tracking-wider">
                  <FiCheckCircle className="text-[12px]" />
                  Default
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-xl ${address.is_default ? 'bg-primary/10 text-primary' : 'bg-background-light text-taupe'}`}>
                  {address.type.toLowerCase() === 'home' ? <FiHome className="text-lg" /> : <FiBriefcase className="text-lg" />}
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

              <div className="flex items-center justify-between pt-4 border-t border-taupe/20">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => openEditModal(address)}
                    className="text-secondary hover:text-primary text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <div className="h-4 w-px bg-taupe/20"></div>
                  <button 
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
                {!address.is_default && (
                  <button 
                    onClick={() => handleSetDefault(address)}
                    className="text-xs text-grey hover:text-primary font-bold underline"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {!isLoading && addresses.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-taupe/20 border-dashed rounded-2xl">
            <FiMapPin className="text-4xl text-taupe mx-auto mb-4" />
            <p className="text-grey font-medium">No saved addresses yet.</p>
          </div>
        )}

        {!isLoading && (
          <button 
            onClick={openAddModal}
            className="flex flex-col items-center justify-center min-h-[240px] rounded-2xl border-2 border-dashed border-taupe/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
          >
            <div className="size-14 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform border border-taupe/10">
              <FiPlus className="text-taupe group-hover:text-primary text-3xl" />
            </div>
            <span className="text-secondary font-bold text-lg">Add New Address</span>
            <span className="text-grey text-sm mt-1">Ship to a new destination</span>
          </button>
        )}
      </div>

      {/* Address Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-secondary/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-taupe/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-taupe/15">
              <h3 className="text-xl font-bold font-serif text-secondary">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-grey hover:text-secondary transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveAddress} className="flex flex-col overflow-hidden">
              <div className="overflow-y-auto p-6 flex flex-col gap-6">
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-4 text-sm font-medium">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest mb-2">Country / Region</label>
                    <select 
                      className="w-full h-12 px-4 rounded-xl border border-taupe/30 bg-background-light/30 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                      value={formCountry}
                      onChange={(e) => setFormCountry(e.target.value)}
                    >
                      <option>Pakistan</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>France</option>
                      <option>Australia</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest mb-2">Address Label (e.g. Home, Office)</label>
                    <input 
                      className="w-full h-12 px-4 rounded-xl border border-taupe/30 bg-background-light/30 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                      placeholder="e.g. Home, Work, Parents' House"
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest mb-2">Address Type</label>
                    <select 
                      className="w-full h-12 px-4 rounded-xl border border-taupe/30 bg-background-light/30 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest mb-2">Phone Number</label>
                    <input 
                      className="w-full h-12 px-4 rounded-xl border border-taupe/30 bg-background-light/30 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                      placeholder="(555) 000-0000"
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest mb-2">Street Address</label>
                    <input 
                      className="w-full h-12 px-4 rounded-xl border border-taupe/30 bg-background-light/30 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                      placeholder="Street address, P.O. box, company name"
                      type="text"
                      value={formStreet}
                      onChange={(e) => setFormStreet(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest mb-2">City</label>
                    <input 
                      className="w-full h-12 px-4 rounded-xl border border-taupe/30 bg-background-light/30 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                      placeholder="City"
                      type="text"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest mb-2">State / Province / Region</label>
                    <input 
                      className="w-full h-12 px-4 rounded-xl border border-taupe/30 bg-background-light/30 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                      placeholder="State"
                      type="text"
                      value={formState}
                      onChange={(e) => setFormState(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest mb-2">Zip / Postal Code</label>
                    <input 
                      className="w-full h-12 px-4 rounded-xl border border-taupe/30 bg-background-light/30 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                      placeholder="Zip code"
                      type="text"
                      value={formPostalCode}
                      onChange={(e) => setFormPostalCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={formIsDefault}
                        onChange={(e) => setFormIsDefault(e.target.checked)}
                        className="rounded border-taupe/40 text-primary focus:ring-primary/20 size-5"
                      />
                      <span className="text-sm text-secondary font-medium group-hover:text-primary transition-colors">
                        Set as default shipping address
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-taupe/15 bg-background-light/30 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 h-12 rounded-xl text-sm font-bold text-secondary hover:bg-background-light transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 h-12 rounded-xl text-sm font-bold text-white bg-secondary hover:bg-primary shadow-lg shadow-secondary/15 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Address'
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
