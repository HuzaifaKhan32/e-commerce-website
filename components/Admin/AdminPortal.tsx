
import React, { useState } from 'react';
import AdminAuth from './AdminAuth.tsx';
import AdminDashboard from './AdminDashboard.tsx';
import AdminProducts from './AdminProducts.tsx';
import AdminOrders from './AdminOrders.tsx';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';

interface AdminPortalProps {
  onExit: () => void;
  onSendShippingEmail: (data: { customerName: string }) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onExit, onSendShippingEmail }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'customers' | 'analytics' | 'settings'>('dashboard');

  if (!isAuthenticated) {
    return <AdminAuth onLogin={() => setIsAuthenticated(true)} onExit={onExit} />;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f7f6] text-[#3E2723] font-sans">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={() => setIsAuthenticated(false)} />
      
      <div className="flex-1 flex flex-col lg:pl-72">
        <Header activeTab={activeTab} />
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders onShipOrder={onSendShippingEmail} />}
          {(activeTab === 'customers' || activeTab === 'analytics' || activeTab === 'settings') && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <span className="text-4xl">🏗️</span>
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-widest text-secondary">View Under Construction</h2>
              <p className="text-grey font-light mt-2 max-w-sm">This module is currently being crafted by our artisan developers.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;
