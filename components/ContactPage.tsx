
import React from 'react';
import { FiSend, FiMapPin, FiPhone, FiMail, FiChevronDown } from 'react-icons/fi';

const ContactPage: React.FC = () => {
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
            <form className="space-y-8 bg-white p-10 rounded-2xl shadow-soft border border-secondary/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Full Name</label>
                  <input className="w-full bg-ivory/20 border border-taupe/20 rounded-xl px-5 py-4 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="James Smith" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Email Address</label>
                  <input className="w-full bg-ivory/20 border border-taupe/20 rounded-xl px-5 py-4 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="james@example.com" type="email" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Subject</label>
                <input className="w-full bg-ivory/20 border border-taupe/20 rounded-xl px-5 py-4 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="How can we help?" type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-grey uppercase tracking-[0.2em]">Message</label>
                <textarea className="w-full bg-ivory/20 border border-taupe/20 rounded-xl px-5 py-4 text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none min-h-[200px] resize-none" placeholder="Write your message here..."></textarea>
              </div>
              <button className="w-full sm:w-auto px-10 py-5 bg-secondary hover:bg-primary text-white font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95" type="submit">
                SEND MESSAGE <FiSend className="group-hover:translate-x-1 transition-transform" />
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
              { q: "What is your shipping policy?", a: "We offer complimentary insured shipping on all orders over $200. Standard delivery typically takes 3-5 business days." },
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
