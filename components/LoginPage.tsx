
import React, { useState } from 'react';
import { FiMail, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

interface LoginPageProps {
  onLogin: (user: { name: string, email: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      onLogin({ 
        name: activeTab === 'signin' ? 'Valued Customer' : form.name || 'New Member', 
        email: form.email 
      });
      setIsLoading(false);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({ name: 'Julian Rossi', email: 'julian@maison.it' });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 relative bg-background-light min-h-[calc(100vh-80px)]">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3E2723 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="relative w-full max-w-[450px] bg-white rounded-2xl shadow-soft border border-taupe/20 overflow-hidden z-10 animate-fade-in">
        <div className="flex border-b border-taupe/20">
          <button 
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-5 text-center font-bold text-sm tracking-widest uppercase transition-all ${activeTab === 'signin' ? 'text-secondary border-b-2 border-primary bg-background-light/30' : 'text-taupe hover:text-secondary'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-5 text-center font-bold text-sm tracking-widest uppercase transition-all ${activeTab === 'signup' ? 'text-secondary border-b-2 border-primary bg-background-light/30' : 'text-taupe hover:text-secondary'}`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-8 pt-10 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-secondary font-serif tracking-tight mb-2">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-grey font-light text-sm">
              {activeTab === 'signin' ? 'Please enter your details to sign in.' : 'Join Luxe Leather for a premium experience.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'signup' && (
              <div className="group relative">
                <label className="block text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-2 ml-1" htmlFor="name">Full Name</label>
                <input 
                    required
                    className="w-full h-14 pl-5 pr-12 bg-ivory/20 border border-taupe/40 rounded-xl text-secondary placeholder-taupe/50 focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none" 
                    id="name" 
                    placeholder="Enter your name" 
                    type="text" 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>
            )}

            <div className="group relative">
              <label className="block text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-2 ml-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <input 
                  required
                  className="w-full h-14 pl-5 pr-12 bg-ivory/20 border border-taupe/40 rounded-xl text-secondary placeholder-taupe/50 focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none" 
                  id="email" 
                  placeholder="name@example.com" 
                  type="email" 
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
                <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-taupe pointer-events-none">
                  <FiMail className="text-xl" />
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-[10px] font-bold text-grey uppercase tracking-[0.2em]" htmlFor="password">Password</label>
              </div>
              <div className="relative">
                <input 
                  required
                  className="w-full h-14 pl-5 pr-12 bg-ivory/20 border border-taupe/40 rounded-xl text-secondary placeholder-taupe/50 focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none" 
                  id="password" 
                  placeholder="Enter your password" 
                  type={showPassword ? 'text' : 'password'} 
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-taupe hover:text-primary transition-colors cursor-pointer outline-none"
                >
                  {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                </button>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className={`w-full h-14 bg-primary hover:bg-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/10 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-4 uppercase tracking-widest text-xs ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
              type="submit"
            >
              <span>{isLoading ? 'Processing...' : (activeTab === 'signin' ? 'Sign In' : 'Create Account')}</span>
              {!isLoading && <FiArrowRight className="text-lg" />}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-taupe/20"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                <span className="bg-white px-4 text-taupe font-bold">Or</span>
              </div>
            </div>

            <button 
                onClick={handleGoogleLogin}
                className="w-full h-14 bg-white border border-taupe/40 text-secondary font-bold rounded-xl hover:bg-ivory/30 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] shadow-sm active:scale-[0.98]" 
                type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          <div className="text-center mt-10">
            <p className="text-xs text-grey font-medium">
              {activeTab === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
                className="font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest ml-1"
              >
                {activeTab === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
