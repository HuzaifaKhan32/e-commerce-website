'use client';

import React from 'react';
import { FiStar, FiAward } from 'react-icons/fi';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    role: 'Creative Director',
    content: 'The quality is exceptional. My wallet has aged beautifully over two years and still looks stunning. Worth every penny.',
    rating: 5,
  },
  {
    id: '2',
    name: 'James Anderson',
    role: 'Entrepreneur',
    content: 'Finally found a brand that understands craftsmanship. The attention to detail in every stitch is remarkable.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emma Thompson',
    role: 'Fashion Blogger',
    content: 'These pieces aren\'t just accessories, they\'re investments. The leather develops a unique patina that tells your story.',
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#F5E6D3]/30 relative overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 leather-grain opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#8B4513]" />
            <span className="text-[#8B4513] font-bold tracking-[0.2em] text-xs uppercase">Customer Stories</span>
            <div className="w-8 h-px bg-[#8B4513]" />
          </div>
          <h2 className="text-[#2C2416] font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Pieces That Age With You
          </h2>
          <p className="text-[#8B4513] max-w-2xl mx-auto font-light leading-relaxed">
            Real experiences from people who choose quality over trends
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-[#D4A574]/20 group hover:-translate-y-2 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Subtle leather grain on hover */}
              <div className="absolute inset-0 leather-grain opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />

              {/* Rating Stars */}
              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="text-[#B87333] fill-current text-lg"
                  />
                ))}
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-[#2C2416] text-base leading-relaxed mb-6 italic relative z-10">
                "{testimonial.content}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-[#D4A574]/20 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4A574] to-[#8B4513] flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[#2C2416] font-bold font-serif">
                    {testimonial.name}
                  </p>
                  <p className="text-[#8B4513] text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '15K+', label: 'Pieces Crafted' },
            { value: '4.9/5', label: 'Workshop Rating' },
            { value: '98%', label: 'Return Customers' },
            { value: '38 Years', label: 'Same Hands' },
          ].map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-white/80 backdrop-blur-sm rounded-lg border border-[#D4A574]/20 hover:border-[#8B4513]/40 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Subtle grain on hover */}
              <div className="absolute inset-0 leather-grain opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

              <p className="text-4xl font-bold text-[#8B4513] font-serif mb-2 relative z-10">
                {stat.value}
              </p>
              <p className="text-[#2C2416] text-sm uppercase tracking-widest font-bold relative z-10">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
