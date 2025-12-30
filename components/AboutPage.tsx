'use client';

import React from 'react';
import { FiArrowRight, FiArrowLeft, FiTarget, FiHeart, FiAward, FiGlobe, FiTool, FiSun } from 'react-icons/fi';

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden bg-secondary">
        <div 
          className="absolute inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat opacity-60" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=1200")' }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-secondary via-secondary/40 to-transparent"></div>
        <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center lg:px-8">
          <span className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-sm">Est. 1985</span>
          <h1 className="mb-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl font-serif">
            About Our Craft
          </h1>
          <p className="max-w-xl text-lg font-light leading-relaxed text-gray-200 md:text-xl">
            Defining luxury through patience, precision, and an unwavering commitment to the art of leatherworking.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-background-light py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-24">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-primary text-sm font-bold tracking-widest uppercase">Our Story</h2>
                <h3 className="text-4xl font-bold leading-tight text-secondary lg:text-5xl font-serif">
                  From a humble workshop to a global atelier.
                </h3>
              </div>
              <div className="space-y-6 text-lg leading-relaxed text-grey font-light">
                <p>
                  Our journey began thirty years ago with a single promise: to create leather goods that age as beautifully as the memories they carry. Nestled in the heart of Tuscany, our founder Marco Rossi started with just a set of vintage tools and a passion for full-grain leather.
                </p>
                <p>
                  We believe that in a world of fast fashion, true luxury lies in slowing down. Every stitch is deliberate, every cut is calculated, and every piece of leather is hand-selected for its unique character and resilience.
                </p>
              </div>
              <div className="pt-4 opacity-50">
                <img alt="Branding" className="h-16" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwW4I75Y4K5JqGmhKiyHhuwo_ffot4Gb04kSyD3N51k_RuPGkzmRNbMRp0wpL1nlwKkqipJ5ukf6owzQjJj768z9GPzOl_WaQh6sUaukaQvJ_NWRz0ubaayyhpIwQl0D3c_wOTt8qi9ddQs6uA0KAniHjAY3dsbOKPRJJ6EduGn2gek8hClrCYOGn2AMHmf_-rjS68JvRWrtBCKsKh46GhoL108uo68_X_SHgKVUfpKqC1mZprA-PuxJ9WAQ3oCf8VeOZ6g4NO-A9X" />
              </div>
            </div>
            <div className="relative flex-1">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=800" 
                  alt="Artisan working" 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
              <div className="absolute -top-8 -right-8 -z-10 h-64 w-64 rounded-full bg-taupe/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-3">Our Values</h2>
            <h3 className="text-4xl font-bold text-secondary lg:text-5xl font-serif">Principles that guide every cut</h3>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              { icon: <FiGlobe />, title: "Ethically Sourced", desc: "We partner exclusively with tanneries that adhere to strict environmental standards, ensuring our materials respect nature." },
              { icon: <FiTool />, title: "Master Craftsmanship", desc: "Our artisans have decades of experience. Every edge is burnished by hand, and every seam is inspected for perfection." },
              { icon: <FiSun />, title: "Timeless Design", desc: "We ignore fleeting trends. Our aesthetic is rooted in classical proportions and functional elegance that lasts a lifetime." }
            ].map((value, idx) => (
              <div key={idx} className="group flex flex-col items-center text-center p-10 bg-background-light rounded-2xl shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-transparent hover:border-primary/20">
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white text-primary text-4xl shadow-md group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {value.icon}
                </div>
                <h4 className="mb-4 text-2xl font-bold text-secondary font-serif">{value.title}</h4>
                <p className="text-grey font-light leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Artisans */}
      <section className="bg-background-light py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-secondary lg:text-5xl font-serif">Meet the Artisans</h2>
              <p className="mt-4 text-lg text-grey font-light">The skilled hands and creative minds behind every collection.</p>
            </div>
            <button className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-all uppercase tracking-widest">
              View All Team
              <FiArrowRight className="text-xl transition-transform group-hover:translate-x-2" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Elena Rossi", role: "Head Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400", desc: "Bringing modern functionality to classic silhouettes since 2010." },
              { name: "Sarah Jenkins", role: "Master Leatherworker", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400", desc: "Specializing in hand-stitching and intricate edge detailing." },
              { name: "Marcus Thorne", role: "Production Lead", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400", desc: "Ensuring every batch of leather meets our rigorous standards." },
              { name: "Amara Diallo", role: "Sustainability Director", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400", desc: "Guiding our mission towards zero-waste manufacturing." }
            ].map((member, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white shadow-soft transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <img alt={member.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src={member.img} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary font-serif">{member.name}</h3>
                  <p className="text-sm text-primary font-bold uppercase tracking-widest mt-1">{member.role}</p>
                  <p className="mt-4 text-sm text-grey font-light line-clamp-2">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;