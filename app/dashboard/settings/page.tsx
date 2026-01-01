
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiUser, FiLock, FiBell, FiTrash2 } from 'react-icons/fi';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '+1 (555) 123-4567'
  });

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-1 pb-4 border-b border-taupe/20">
        <h1 className="text-3xl font-bold text-secondary font-serif tracking-tight">Account Settings</h1>
        <p className="text-grey">Manage your personal information, security, and preferences.</p>
      </div>

      {/* Profile Information */}
      <section className="bg-white border border-taupe/20 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-background-light rounded-xl text-primary">
            <FiUser className="text-xl" />
          </div>
          <h2 className="text-xl font-bold text-secondary">Profile Information</h2>
        </div>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest ml-1" htmlFor="fullName">Full Name</label>
              <input 
                className="w-full h-12 rounded-xl border-taupe/30 bg-background-light/30 text-secondary focus:border-primary focus:ring-primary/10 shadow-sm transition-all text-sm px-4 outline-none" 
                id="fullName" 
                type="text" 
                value={form.fullName}
                onChange={(e) => setForm({...form, fullName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest ml-1" htmlFor="phone">Phone Number</label>
              <input 
                className="w-full h-12 rounded-xl border-taupe/30 bg-background-light/30 text-secondary focus:border-primary focus:ring-primary/10 shadow-sm transition-all text-sm px-4 outline-none" 
                id="phone" 
                type="tel" 
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest ml-1" htmlFor="email">Email Address</label>
              <input 
                className="w-full h-12 rounded-xl border-taupe/30 bg-background-light/30 text-secondary focus:border-primary focus:ring-primary/10 shadow-sm transition-all text-sm px-4 outline-none" 
                id="email" 
                type="email" 
                value={form.email}
                disabled
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button className="bg-secondary text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-primary transition-all shadow-md shadow-secondary/10" type="button">
              Save Changes
            </button>
          </div>
        </form>
      </section>

      {/* Password Management */}
      <section className="bg-white border border-taupe/20 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-background-light rounded-xl text-primary">
            <FiLock className="text-xl" />
          </div>
          <h2 className="text-xl font-bold text-secondary">Password Management</h2>
        </div>
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest ml-1" htmlFor="currentPassword">Current Password</label>
            <input 
              className="w-full h-12 rounded-xl border-taupe/30 bg-background-light/30 text-secondary focus:border-primary focus:ring-primary/10 shadow-sm transition-all text-sm px-4 outline-none" 
              id="currentPassword" 
              placeholder="••••••••" 
              type="password"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest ml-1" htmlFor="newPassword">New Password</label>
              <input 
                className="w-full h-12 rounded-xl border-taupe/30 bg-background-light/30 text-secondary focus:border-primary focus:ring-primary/10 shadow-sm transition-all text-sm px-4 outline-none" 
                id="newPassword" 
                type="password"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-taupe uppercase tracking-widest ml-1" htmlFor="confirmPassword">Confirm New Password</label>
              <input 
                className="w-full h-12 rounded-xl border-taupe/30 bg-background-light/30 text-secondary focus:border-primary focus:ring-primary/10 shadow-sm transition-all text-sm px-4 outline-none" 
                id="confirmPassword" 
                type="password"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button className="bg-white border border-taupe/40 text-secondary px-8 py-3 rounded-xl text-sm font-bold hover:bg-background-light transition-all" type="button">
              Change Password
            </button>
          </div>
        </form>
      </section>

      {/* Notification Preferences */}
      <section className="bg-white border border-taupe/20 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-background-light rounded-xl text-primary">
            <FiBell className="text-xl" />
          </div>
          <h2 className="text-xl font-bold text-secondary">Notification Preferences</h2>
        </div>
        <div className="space-y-6 divide-y divide-taupe/10">
          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="font-bold text-secondary">Order Updates</h3>
              <p className="text-sm text-grey mt-0.5">Receive updates about your order status and delivery.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-taupe/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between pt-6">
            <div>
              <h3 className="font-bold text-secondary">Exclusive Offers</h3>
              <p className="text-sm text-grey mt-0.5">Be the first to know about new collections and sales.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-taupe/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Delete Account */}
      <section className="bg-red-50/50 border border-red-100 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
              <FiTrash2 /> Delete Account
            </h2>
            <p className="text-sm text-red-600/80 max-w-xl">
              Once you delete your account, there is no going back. All your data, including order history and saved items, will be permanently removed.
            </p>
          </div>
          <button className="shrink-0 bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm">
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
