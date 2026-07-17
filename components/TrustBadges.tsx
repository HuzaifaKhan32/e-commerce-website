'use client';

import React from 'react';
import { FiShield, FiTruck, FiRotateCcw, FiAward } from 'react-icons/fi';

const trustFeatures = [
  {
    icon: <FiShield className="text-4xl" />,
    title: 'Workshop Guarantee',
    description: 'Every piece examined by hand',
  },
  {
    icon: <FiTruck className="text-4xl" />,
    title: 'Careful Delivery',
    description: 'Wrapped in cloth, shipped worldwide',
  },
  {
    icon: <FiRotateCcw className="text-4xl" />,
    title: '30-Day Return',
    description: `If it doesn't age with you`,
  },
  {
    icon: <FiAward className="text-4xl" />,
    title: 'Lifetime Repairs',
    description: 'Crafted to last generations',
  },
];

const TrustBadges: React.FC = () => {
  return (
    <section className="py-16 bg-[#2C2416] border-y border-[#8B4513]/20 relative overflow-hidden">
      {/* Subtle workshop floor texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="leather-grain w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-[#8B4513]/10 transition-all duration-300 group border border-[#8B4513]/20"
            >
              <div className="text-[#D4A574] mb-4 transform group-hover:scale-110 transition-transform duration-300 relative">
                {feature.icon}
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-[#D4A574] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <h3 className="text-[#E8DCC4] font-bold text-base mb-2 font-serif">
                {feature.title}
              </h3>
              <p className="text-[#D4A574] text-sm leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
