'use client';

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiMail, FiEye, FiEyeOff, FiArrowRight, FiLock, FiCheckCircle } from 'react-icons/fi';

interface LoginPageProps {
  onLogin: (user: { name: string, email: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams?.get('error');

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsSuccess(true);
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  useEffect(() => {
    if (authError === 'Callback') {
      setError('There was a problem signing in with Google. Please try again.');
      // Clear the error from the URL without reloading
      router.replace('/auth', { scroll: false });
    }
  }, [authError, router]);

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'signup' && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsVerifying(true);
      } else {
        setError(data.message || 'Failed to send verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: form.email, 
          password: form.password, 
          name: form.name,
          code: verificationCode 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        // Automatically sign in after successful signup
        await signIn('credentials', {
          email: form.email,
          password: form.password,
          redirect: true,
          callbackUrl: '/dashboard'
        });
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'signup') {
      if (isVerifying) {
        handleSignup(e);
      } else {
        handleSendCode(e);
      }
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        setIsSuccess(true);
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', {
        callbackUrl: '/dashboard'
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('An error occurred during Google sign in');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-grow flex items-center justify-center py-16 px-4 bg-background-light min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-soft border border-taupe/20 p-10 text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="size-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <FiCheckCircle className="text-5xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-secondary font-serif mb-4">Welcome back!</h2>
          <p className="text-grey mb-8">You have been successfully authenticated. Redirecting you to your dashboard...</p>
          <div className="flex justify-center">
            <div className="w-12 h-1 bg-background-light rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary animate-progress"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-bold animate-shake">
                {error}
              </div>
            )}

            {activeTab === 'signup' && !isVerifying && (
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

            {!isVerifying ? (
              <>
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

                {activeTab === 'signup' && (
                  <div className="group relative">
                    <label className="block text-[10px] font-bold text-grey uppercase tracking-[0.2em] mb-2 ml-1" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="relative">
                      <input
                        required
                        className="w-full h-14 pl-5 pr-12 bg-ivory/20 border border-taupe/40 rounded-xl text-secondary placeholder-taupe/50 focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                      />
                      <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-taupe pointer-events-none">
                        <FiLock className="text-xl" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="group relative animate-fade-in">
                <div className="text-center mb-8">
                  <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                    <FiLock className="text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary font-serif mb-2">Verify your email</h3>
                  <p className="text-xs text-grey">We've sent a 6-digit code to <br/><span className="font-bold text-secondary">{form.email}</span></p>
                </div>
                
                <div className="flex justify-between gap-2 mb-6">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength={1}
                      className="w-12 h-14 text-center text-xl font-bold bg-ivory/20 border border-taupe/40 rounded-xl text-secondary focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                      value={verificationCode[index] || ''}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                        if (pastedData) {
                          setVerificationCode(pastedData);
                          const lastIndex = Math.min(pastedData.length, 5);
                          document.getElementById(`code-${lastIndex}`)?.focus();
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val) {
                          const newCode = verificationCode.split('');
                          newCode[index] = val;
                          const finalCode = newCode.join('').slice(0, 6);
                          setVerificationCode(finalCode);
                          if (index < 5) document.getElementById(`code-${index + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                          const newCode = verificationCode.split('');
                          newCode[index - 1] = '';
                          setVerificationCode(newCode.join(''));
                          document.getElementById(`code-${index - 1}`)?.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => {
                      setVerificationCode('');
                      setIsVerifying(false);
                    }}
                    className="text-[10px] text-taupe font-bold uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    Resend code or change email
                  </button>
                </div>
              </div>
            )}

            <button
              disabled={isLoading}
              className={`w-full h-14 bg-primary hover:bg-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/10 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-4 uppercase tracking-widest text-xs ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
            >
              <span>{isLoading ? 'Processing...' : (isVerifying ? 'Verify & Create Account' : (activeTab === 'signin' ? 'Sign In' : 'Send Verification Code'))}</span>
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