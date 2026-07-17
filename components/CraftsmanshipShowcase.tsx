'use client';

import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

interface CraftStep {
  id: number;
  label: string;
  detail: string;
}

const craftSteps: CraftStep[] = [
  { id: 1, label: 'Leather Selection', detail: 'Full-grain Italian hides, naturally tanned' },
  { id: 2, label: 'Pattern Cutting', detail: 'Hand-cut using steel dies from 1985' },
  { id: 3, label: 'Edge Finishing', detail: 'Burnished by hand with beeswax compound' },
  { id: 4, label: 'Saddle Stitching', detail: 'Two needles, waxed linen thread, 7 SPI' },
  { id: 5, label: 'Hardware Setting', detail: 'Solid brass rivets, hand-set with precision' },
  { id: 6, label: 'Final Inspection', detail: 'Every piece examined under workshop light' },
];

const CraftsmanshipShowcase: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section className="py-24 bg-gradient-to-b from-[#F5E6D3] to-[#E8DCC4] relative overflow-hidden">
      {/* Subtle grain texture */}
      <div className="absolute inset-0 leather-grain opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 text-[#8B4513] text-xs uppercase tracking-[0.3em] font-bold">
              <div className="w-8 h-px bg-[#8B4513]" />
              <span>The Making</span>
              <div className="w-8 h-px bg-[#8B4513]" />
            </div>
          </div>
          <h2 className="text-[#2C2416] font-serif text-4xl md:text-5xl font-bold mb-4 embossed">
            Six Steps to Heirloom Quality
          </h2>
          <p className="text-[#8B4513] max-w-2xl mx-auto font-light leading-relaxed">
            Every piece passes through our workshop unchanged since 1985
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Step List */}
          <div className="md:col-span-1 space-y-3">
            {craftSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full text-left group transition-all duration-300 ${
                  activeStep === step.id
                    ? 'bg-white shadow-lg'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              >
                <div className="p-4 flex items-start gap-4">
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      activeStep === step.id
                        ? 'border-[#8B4513] bg-[#8B4513]'
                        : 'border-[#D4A574] bg-transparent'
                    }`}
                  >
                    {activeStep === step.id && (
                      <FiCheck className="text-white text-sm" />
                    )}
                    {activeStep !== step.id && (
                      <span className="text-[#8B4513] text-xs font-bold">
                        {step.id}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold mb-1 transition-colors ${
                      activeStep === step.id ? 'text-[#2C2416]' : 'text-[#8B4513]'
                    }`}>
                      {step.label}
                    </p>
                    {activeStep === step.id && (
                      <p className="text-xs text-[#8B4513]/70 leading-relaxed animate-fade-in">
                        {step.detail}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Visual Display */}
          <div className="md:col-span-2">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#2C2416] workshop-light">
              {/* Stitched border effect */}
              <div className="absolute inset-4 border border-dashed border-[#E8DCC4]/30 rounded pointer-events-none z-10" />

              {/* Content based on active step */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center animate-fade-in">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#D4A574]/20 border-2 border-[#D4A574] mb-6">
                    <span className="text-[#E8DCC4] text-4xl font-serif font-bold">
                      {activeStep}
                    </span>
                  </div>
                  <h3 className="text-[#E8DCC4] text-2xl font-serif font-bold mb-3">
                    {craftSteps[activeStep - 1].label}
                  </h3>
                  <p className="text-[#D4A574] text-sm max-w-md mx-auto leading-relaxed">
                    {craftSteps[activeStep - 1].detail}
                  </p>

                  {/* Decorative stitching lines */}
                  <svg
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-16 opacity-20"
                    viewBox="0 0 100 50"
                  >
                    <path
                      d="M 10 25 L 90 25"
                      className="stitching-line"
                      fill="none"
                    />
                    <path
                      d="M 10 35 L 90 35"
                      className="stitching-line"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quality Statement */}
            <div className="mt-6 p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-[#8B4513]/20">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[#8B4513] flex items-center justify-center">
                  <span className="text-[#E8DCC4] text-xl font-serif font-bold">38</span>
                </div>
                <div>
                  <p className="text-[#2C2416] font-bold mb-1">Years of Unchanged Process</p>
                  <p className="text-[#8B4513] text-sm leading-relaxed">
                    Our workshop methods haven't changed since we opened in 1985. Same tools, same hands, same dedication to quality over speed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipShowcase;
