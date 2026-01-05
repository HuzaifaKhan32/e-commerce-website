'use client';

import React from 'react';
import { FiSearch, FiChevronRight, FiChevronDown, FiMessageCircle } from 'react-icons/fi';

const FAQPage: React.FC = () => {
  const sections = [
    {
      id: "ordering",
      title: "Ordering",
      questions: [
        { q: "How do I place an order?", a: "Simply browse our collection, select your desired item, and click 'Add to Cart'. When you are ready, follow the secure checkout prompts to complete your purchase." },
        { q: "Can I modify my order after placing it?", a: "We process orders quickly. If you need modifications, please contact our concierge team within 1 hour of purchase." },
        { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay. We also offer financing through Klarna in select regions." }
      ]
    },
    {
      id: "shipping",
      title: "Shipping & Delivery",
      questions: [
        { q: "Do you ship internationally?", a: "Currently, we only ship to Pakistan. We are working on expanding to other countries soon." },
        { q: "How long will my order take to arrive?", a: "Standard shipping takes 3-4 days." }
      ]
    },
    {
      id: "returns",
      title: "Returns & Exchanges",
      questions: [
        { q: "What is your return policy?", a: "We accept returns of unused items in original packaging within 30 days of delivery. Custom or personalized items are final sale." }
      ]
    },
    {
      id: "products",
      title: "Products & Care",
      questions: [
        { q: "How do I care for my leather goods?", a: "Avoid direct sunlight and moisture. Use a high-quality leather conditioner every 3-6 months. Store in provided dust bags." },
        { q: "Where are your products made?", a: "All Luxe Leather goods are handcrafted by skilled artisans in Florence, Italy, using ethically sourced vegetable-tanned leather." }
      ]
    }
  ];

  return (
    <div className="animate-fade-in bg-background-light min-h-screen">
      {/* Hero & Search */}
      <div className="bg-white border-b border-secondary/5 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-secondary tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-grey font-light text-xl max-w-2xl mx-auto">
            Find answers to common questions about our craftsmanship, shipping, and leather care.
          </p>
          
          <div className="max-w-xl mx-auto mt-12 relative group">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-taupe text-xl group-focus-within:text-primary transition-colors" />
            <input 
              className="w-full h-16 pl-14 pr-6 rounded-2xl bg-ivory/30 border-0 shadow-soft text-secondary placeholder-taupe/60 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all outline-none" 
              placeholder="Search for answers..." 
              type="text"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar Nav */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-2">
              <h3 className="px-4 pb-4 text-[10px] font-bold text-taupe uppercase tracking-[0.3em]">Categories</h3>
              <nav className="space-y-1">
                {sections.map((section, idx) => (
                  <a 
                    key={section.id}
                    href={`#${section.id}`} 
                    className={`flex items-center justify-between px-5 py-4 text-sm font-bold rounded-xl transition-all uppercase tracking-widest ${idx === 0 ? 'bg-white shadow-soft text-primary border-l-4 border-primary' : 'text-grey hover:bg-white hover:text-primary'}`}
                  >
                    {section.title}
                    <FiChevronRight className="text-lg opacity-30" />
                  </a>
                ))}
              </nav>
              
              <div className="mt-12 p-8 bg-secondary rounded-2xl text-center shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <FiMessageCircle className="text-primary text-4xl mx-auto mb-4" />
                <h4 className="font-serif font-bold text-white text-lg mb-2">Need help?</h4>
                <p className="text-[10px] text-ivory/60 uppercase tracking-widest mb-6">Available 24/7</p>
                <button className="text-xs font-bold text-primary underline underline-offset-4 hover:text-white transition-all uppercase tracking-widest">Contact Support</button>
              </div>
            </div>
          </aside>

          {/* Main FAQ Content */}
          <div className="col-span-1 lg:col-span-9 space-y-20">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <h2 className="font-serif text-3xl font-bold text-secondary mb-10 flex items-center gap-5">
                  <span className="w-12 h-0.5 bg-primary/30 rounded-full"></span> 
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.questions.map((item, qIdx) => (
                    <details 
                      key={qIdx} 
                      className="group bg-white rounded-2xl border border-secondary/5 overflow-hidden transition-all duration-300 hover:shadow-soft"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-6 p-8 transition-colors group-open:bg-ivory/10">
                        <span className="text-lg font-bold text-secondary font-serif group-hover:text-primary transition-colors">{item.q}</span>
                        <FiChevronDown className="text-taupe text-xl transition-transform duration-500 group-open:rotate-180 group-open:text-primary" />
                      </summary>
                      <div className="px-8 pb-8 pt-0 text-grey font-light leading-relaxed animate-fade-in text-base">
                        <p>{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}

            {/* Support Banner */}
            <div className="bg-secondary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C9A96E 0%, transparent 50%)' }}></div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="font-serif text-4xl font-bold text-white mb-6">Still have questions?</h3>
                <p className="text-ivory/80 mb-10 text-lg font-light">Our dedicated concierge team is here to assist you with any inquiries regarding our products or your order.</p>
                <button className="inline-flex items-center justify-center h-16 px-12 bg-primary hover:bg-white text-secondary text-sm font-bold rounded-xl transition-all shadow-xl uppercase tracking-widest active:scale-95">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;