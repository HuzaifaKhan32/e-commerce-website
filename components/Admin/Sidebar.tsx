'use client';

import React from 'react';
import { 
  FiGrid, 
  FiShoppingBag, 
  FiBox, 
  FiUsers, 
  FiPieChart, 
  FiSettings, 
  FiLogOut, 
  FiLayers 
} from 'react-icons/fi';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag /> },
    { id: 'products', label: 'Products', icon: <FiBox /> },
    { id: 'customers', label: 'Customers', icon: <FiUsers /> },
    { id: 'analytics', label: 'Analytics', icon: <FiPieChart /> },
  ];

  return (
    <>
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50 bg-white border-r border-[#e5e0d8] shadow-sm">
        <div className="h-20 flex items-center px-8 border-b border-[#e5e0d8]">
          <div className="flex items-center gap-3">
            <div className="size-9 flex items-center justify-center rounded bg-[#eeaa2b] text-white shadow-lg shadow-[#eeaa2b]/30">
              <FiLayers className="text-xl" />
            </div>
            <h2 className="text-[#3E2723] text-2xl font-black tracking-tight">Lusso</h2>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          <p className="px-4 text-[10px] font-bold text-[#6b5e51] uppercase tracking-[0.2em] mb-4">Main Menu</p>
          
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-[#eeaa2b]/10 text-[#eeaa2b] shadow-sm' 
                  : 'text-[#6b5e51] hover:bg-[#f8f7f6] hover:text-[#3E2723]'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="pt-8 pb-2">
            <p className="px-4 text-[10px] font-bold text-[#6b5e51] uppercase tracking-[0.2em] mb-4">Management</p>
            <button
              onClick={() => onTabChange('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === 'settings' 
                  ? 'bg-[#eeaa2b]/10 text-[#eeaa2b]' 
                  : 'text-[#6b5e51] hover:bg-[#f8f7f6] hover:text-[#3E2723]'
              }`}
            >
              <FiSettings className="text-xl" />
              Settings
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-[#e5e0d8] bg-[#f8f7f6]/50">
          <div className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-[#e5e0d8] hover:bg-white transition-all group cursor-pointer">
            <div className="size-10 rounded-full overflow-hidden border-2 border-[#eeaa2b]/20 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
                alt="Admin" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-[#3E2723] truncate">Marco Rossi</p>
              <p className="text-[10px] text-[#6b5e51] font-bold uppercase tracking-widest truncate">Head of Maison</p>
            </div>
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="p-2 text-[#6b5e51] hover:text-red-500 transition-colors"
              title="Logout"
            >
              <FiLogOut className="text-xl" />
            </button>
          </div>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-[#e5e0d8] p-8 max-w-sm w-full text-center">
            <div className="size-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
               <FiLogOut className="text-3xl ml-1" />
            </div>
            <h3 className="text-xl font-bold text-[#3E2723] font-serif mb-2">Sign Out</h3>
            <p className="text-[#6b5e51] mb-8">Are you sure you want to log out of the admin portal?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 border border-[#e5e0d8] rounded-xl font-bold text-[#6b5e51] hover:bg-[#f8f7f6] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;