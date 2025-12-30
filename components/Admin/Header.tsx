'use client';

import React from 'react';
import { FiSearch, FiBell, FiChevronRight } from 'react-icons/fi';

interface HeaderProps {
  activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  return (
    <header className="sticky top-0 z-40 h-20 bg-[#f8f7f6]/80 backdrop-blur-md border-b border-[#e5e0d8] px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <nav className="flex items-center text-xs font-bold text-[#6b5e51] uppercase tracking-[0.2em]">
          <span className="hover:text-[#eeaa2b] cursor-pointer">Lusso</span>
          <FiChevronRight className="mx-2 text-sm" />
          <span className="text-[#3E2723] font-black">{activeTab}</span>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b5e51] text-lg group-focus-within:text-[#eeaa2b] transition-colors" />
          <input 
            type="text" 
            placeholder="Search Maison data..."
            className="h-11 w-72 pl-12 pr-4 bg-white border border-[#e5e0d8] rounded-full text-sm font-medium focus:ring-2 focus:ring-[#eeaa2b]/20 focus:border-[#eeaa2b] outline-none transition-all"
          />
        </div>
        
        <button className="relative size-11 flex items-center justify-center rounded-full bg-white border border-[#e5e0d8] text-[#6b5e51] hover:text-[#eeaa2b] hover:shadow-md transition-all group">
          <FiBell className="text-xl group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 size-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;