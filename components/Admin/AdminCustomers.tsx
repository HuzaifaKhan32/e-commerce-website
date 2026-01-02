'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiMail, FiUser, FiCalendar, FiShield, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  emailVerified?: string;
}

const AdminCustomers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Failed to fetch users", e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-secondary tracking-tight">Customer Directory</h1>
          <p className="text-grey font-light text-sm mt-1">Manage and view all registered patrons of Lusso Maison.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e0d8]">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe text-lg" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-[#f8f7f6] border border-[#e5e0d8] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 text-center text-grey">
                <div className="animate-spin text-3xl text-primary mx-auto mb-4">⏳</div>
                Loading customer records...
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8f7f6] border-b border-[#e5e0d8] text-[10px] font-black text-taupe uppercase tracking-[0.2em]">
                  <th className="py-5 px-8">Customer</th>
                  <th className="py-5 px-8">Status</th>
                  <th className="py-5 px-8">Role</th>
                  <th className="py-5 px-8">Account ID</th>
                  <th className="py-5 px-8 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e0d8]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-grey text-sm">No customers found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#f8f7f6]/50 transition-colors">
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-xl bg-ivory border border-taupe/20 overflow-hidden shrink-0 flex items-center justify-center">
                            {u.image ? (
                              <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              <FiUser className="text-xl text-taupe" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-secondary truncate">{u.name || 'Anonymous'}</p>
                            <p className="text-xs text-grey font-medium flex items-center gap-1">
                              <FiMail className="text-[10px]" /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        {u.emailVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-600 border border-green-100">
                            <FiCheckCircle /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-orange-50 text-orange-600 border border-orange-100">
                            <FiXCircle /> Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-5 px-8">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          u.role === 'admin' ? 'bg-primary text-white' : 'bg-taupe/10 text-secondary'
                        }`}>
                          {u.role || 'User'}
                        </span>
                      </td>
                      <td className="py-5 px-8">
                        <code className="text-[10px] bg-ivory px-2 py-1 rounded border border-taupe/10 text-taupe">
                          {u.id.substring(0, 12)}...
                        </code>
                      </td>
                      <td className="py-5 px-8 text-center">
                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
