'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiShoppingBag, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { useNotification } from '@/components/NotificationProvider';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      showNotification('error', 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', data.message || 'Thank you for subscribing!');
        setEmail(''); // Clear the input after successful submission
      } else {
        showNotification('error', data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      showNotification('error', 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-secondary text-ivory py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 cursor-pointer">
              <FiShoppingBag className="text-primary text-4xl" />
              <h2 className="font-serif text-2xl font-bold tracking-tight">LUXE LEATHER</h2>
            </Link>
            <p className="text-ivory/70 text-sm leading-relaxed mb-8 max-w-xs font-light">
              Crafting heritage quality leather goods for the modern individual since 1985. We prioritize durability, design, and timeless elegance.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FiInstagram />, label: 'Instagram' },
                { icon: <FiFacebook />, label: 'Facebook' },
                { icon: <FiTwitter />, label: 'Twitter' }
              ].map((social) => (
                <a
                  key={social.label}
                  className="text-ivory/70 hover:text-primary transition-all p-3 border border-ivory/10 rounded-full hover:border-primary transform hover:-translate-y-1"
                  href="#"
                  aria-label={social.label}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-8 text-primary uppercase tracking-widest">Shop</h3>
            <ul className="space-y-4 text-sm text-ivory/80">
              {[
                { name: 'New Arrivals', href: '/shop' },
                { name: 'Best Sellers', href: '/shop' },
                { name: "Men's Collection", href: '/shop' },
                { name: "Women's Collection", href: '/shop' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary transition-colors flex items-center gap-3 group text-left">
                    <span className="w-1.5 h-1.5 bg-primary/30 rounded-full group-hover:w-3 group-hover:bg-primary transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-8 text-primary uppercase tracking-widest">Support</h3>
            <ul className="space-y-4 text-sm text-ivory/80">
              {[
                { name: 'Contact Us', href: '/contact' },
                { name: 'Shipping & Returns', href: '/faq' },
                { name: 'Care Instructions', href: '/faq' },
                { name: 'FAQ', href: '/faq' },
                { name: 'About Us', href: '/about' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary transition-colors flex items-center gap-3 group text-left">
                    <span className="w-1.5 h-1.5 bg-primary/30 rounded-full group-hover:w-3 group-hover:bg-primary transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-8 text-primary uppercase tracking-widest">Stay in the Loop</h3>
            <p className="text-ivory/70 text-sm mb-6 font-light">Subscribe for exclusive offers, limited releases, and updates.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
              <input
                className="bg-ivory/5 border border-ivory/10 rounded-xl px-5 py-4 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full transition-all"
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-primary text-secondary font-bold text-sm px-5 py-4 rounded-xl hover:bg-white transition-all transform active:scale-95 shadow-lg tracking-widest uppercase ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBSCRIBE'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-ivory/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-ivory/30 text-[10px] tracking-[0.2em] uppercase">© 2024 Luxe Leather. Handcrafted Heritage.</p>
          <div className="flex gap-10 text-ivory/30 text-[10px] tracking-[0.2em] uppercase">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                showNotification('info', 'Privacy Policy page coming soon!');
              }}
              className="hover:text-ivory transition-colors underline-offset-8 hover:underline"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                showNotification('info', 'Terms & Conditions page coming soon!');
              }}
              className="hover:text-ivory transition-colors underline-offset-8 hover:underline"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;