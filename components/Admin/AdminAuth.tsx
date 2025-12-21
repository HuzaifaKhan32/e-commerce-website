
import React, { useState } from 'react';
import { FiLock, FiUser, FiArrowRight, FiArrowLeft, FiLayers } from 'react-icons/fi';

interface AdminAuthProps {
  onLogin: () => void;
  onExit: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onLogin, onExit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation: credentials "admin" / "admin"
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Invalid Maison credentials. Access denied.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f7f6] p-6 relative">
      <div className="absolute top-10 left-10">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 text-[10px] font-black text-taupe uppercase tracking-[0.3em] hover:text-secondary transition-all group"
        >
          <FiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" /> Back to Store
        </button>
      </div>

      <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-2xl border border-[#e5e0d8] p-10 animate-fade-in relative z-10">
        <div className="text-center mb-12">
          <div className="size-16 bg-[#eeaa2b] rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl shadow-[#eeaa2b]/30">
            <FiLayers />
          </div>
          <h1 className="font-serif text-4xl text-secondary font-bold tracking-tight mb-2">Lusso Maison</h1>
          <p className="text-grey font-light text-sm uppercase tracking-[0.2em]">Administrative Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em] ml-1">Grand Master ID</label>
            <div className="relative group">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe group-focus-within:text-primary transition-colors" />
              <input 
                required
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-[#f8f7f6] border border-taupe/20 text-secondary focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em] ml-1">Vault Key</label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe group-focus-within:text-primary transition-colors" />
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-[#f8f7f6] border border-taupe/20 text-secondary focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-bold uppercase tracking-widest text-center animate-bounce">
              {error}
            </p>
          )}

          <button 
            type="submit"
            className="w-full h-16 bg-[#eeaa2b] hover:bg-secondary text-white font-black rounded-2xl shadow-xl shadow-[#eeaa2b]/30 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm group"
          >
            Enter Portal <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-12 text-center text-[10px] text-taupe font-bold uppercase tracking-[0.3em]">
          Secure Lusso RSA Encryption Active
        </div>
      </div>

      <div className="absolute bottom-10 text-[10px] text-taupe font-bold uppercase tracking-[0.4em]">
        © 2024 Lusso Heritage Admin
      </div>
    </div>
  );
};

export default AdminAuth;
