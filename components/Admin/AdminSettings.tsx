'use client';

import React, { useState, useEffect } from 'react';
import { FiSave, FiUser, FiLock } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

const AdminSettings: React.FC = () => {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setStatus('saving');
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            id: session.user.id,
            name,
            password: password || undefined 
        })
      });

      if (res.ok) {
        setStatus('success');
        setPassword(''); // Clear password field
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-secondary tracking-tight">Admin Settings</h1>
        <p className="text-grey font-light text-sm mt-1">Update your administrative profile.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d8] shadow-sm overflow-hidden p-8">
        <form onSubmit={handleUpdate} className="space-y-8">
           <div className="space-y-2">
            <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Display Name</label>
            <div className="relative group">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-[#f8f7f6] border border-taupe/20 text-secondary focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">New Password (Optional)</label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-[#f8f7f6] border border-taupe/20 text-secondary focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              />
            </div>
            <p className="text-[10px] text-grey pl-1">* Only enter a value if you wish to change your vault key.</p>
          </div>

          <button 
            type="submit"
            disabled={status === 'saving'}
            className="w-full h-14 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm hover:opacity-90 disabled:opacity-70"
          >
            {status === 'saving' ? 'Saving...' : <><FiSave className="text-lg" /> Save Changes</>}
          </button>

          {status === 'success' && (
            <p className="text-center text-xs font-bold text-green-600 uppercase tracking-widest animate-bounce">
              Profile Updated Successfully
            </p>
          )}
          {status === 'error' && (
            <p className="text-center text-xs font-bold text-red-500 uppercase tracking-widest animate-bounce">
              Update Failed. Please Try Again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;