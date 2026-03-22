'use client';

import React, { useState } from 'react';
import { FiSend, FiMapPin, FiPhone, FiMail, FiChevronDown, FiLoader } from 'react-icons/fi';
import { useNotification } from '@/components/NotificationProvider';

const ContactPage: React.FC = () => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', data.message || 'Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        showNotification('error', data.error || 'Failed to send message');
      }
    } catch (error) {
      showNotification('error', 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-fade-in">
      {/* Page Heading */}
      <section className="bg-background-light pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-primary font-bold tracking-[0.2em] text-xs mb-3 uppercase">Customer Support</p>
            <h2 className="text-secondary text-5xl md:text-6xl font-bold tracking-tight mb-6 font-serif">Get in Touch</h2>
            <p className="text-grey text-xl font-light leading-relaxed">
              We are here to help you with any questions regarding our leather goods. Our team is dedicated to providing you with the exceptional service that matches our craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-2xl shadow-soft border border-secondary/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Full Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-ivory/20 border border-taupe/20 rounded-xl px-5 py-4 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                    placeholder="James Smith" 
                    type="text" 
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Email Address</label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-ivory/20 border border-taupe/20 rounded-xl px-5 py-4 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                    placeholder="james@example.com" 
                    type="email" 
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Subject</label>
                <input 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-ivory/20 border border-taupe/20 rounded-xl px-5 py-4 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                  placeholder="How can we help?" 
                  type="text" 
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-ivory/20 border border-taupe/20 rounded-xl px-5 py-4 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none min-h-[200px] resize-none" 
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>
              <button 
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-10 py-5 bg-secondary hover:bg-primary text-white font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`} 
                type="submit"
              >
                {isSubmitting ? (
                  <>SENDING... <FiLoader className="animate-spin" /></>
                ) : (
                  <>SEND MESSAGE <FiSend className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Info & Map */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="bg-white p-8 rounded-2xl border border-secondary/5 shadow-soft space-y-10">
              {[ 
                { icon: <FiMapPin />, title: "Our Showroom", content: "123 Leather Lane, Artisan District\nCraftsmanship City, 90210" },
                { icon: <FiPhone />, title: "Phone", content: "+1 (555) 123-4567\nMon-Fri 9am to 6pm EST" },
                { icon: <FiMail />, title: "Email", content: "concierge@luxleather.com\nsupport@luxleather.com" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-ivory flex items-center justify-center text-primary text-2xl shadow-inner shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-secondary font-bold text-lg mb-2 font-serif">{item.title}</h4>
                    <p className="text-grey font-light text-sm whitespace-pre-line leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-secondary/5 shadow-soft group">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                alt="Map" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors" />
              <button className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-6 py-3 rounded-xl text-xs font-bold shadow-xl text-secondary hover:bg-primary hover:text-white transition-all uppercase tracking-widest">
                View on Google Maps
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-secondary/5 bg-white py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-secondary mb-4 font-serif">Frequently Asked Questions</h3>
            <p className="text-grey font-light">Find quick answers to common questions about our service.</p>
          </div>
          <div className="space-y-6">
            {[ 
              { q: "What is your shipping policy?", a: "We offer complimentary insured shipping on all orders over $200. Standard delivery typically takes 3-4 business days." },
              { q: "How do I care for my leather goods?", a: "Keep away from direct sunlight and heat. Clean with a soft dry cloth. We recommend conditioning every 3-6 months." },
              { q: "Do you offer international returns?", a: "Yes, we accept unused items in original packaging within 30 days. International return costs are the buyer's responsibility." }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-background-light rounded-2xl border border-secondary/5 overflow-hidden transition-all duration-300">
                <summary className="flex justify-between items-center p-6 cursor-pointer select-none">
                  <span className="font-bold text-secondary group-hover:text-primary transition-colors text-lg font-serif">{faq.q}</span>
                  <FiChevronDown className="text-taupe transition-transform duration-500 group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-grey font-light leading-relaxed border-t border-secondary/5 pt-6 animate-fade-in text-base">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;