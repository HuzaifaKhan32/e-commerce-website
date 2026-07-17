'use client';

import React from 'react';
import { FiShoppingBag, FiPackage, FiDollarSign, FiUsers } from 'react-icons/fi';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary font-serif mb-2">Dashboard</h1>
        <p className="text-grey">Welcome to the admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-soft border border-taupe/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FiShoppingBag className="text-2xl text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-secondary font-serif mb-1">0</h3>
          <p className="text-sm text-grey">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-taupe/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <FiPackage className="text-2xl text-secondary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-secondary font-serif mb-1">0</h3>
          <p className="text-sm text-grey">Total Products</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-taupe/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiDollarSign className="text-2xl text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-secondary font-serif mb-1">$0</h3>
          <p className="text-sm text-grey">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-taupe/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiUsers className="text-2xl text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-secondary font-serif mb-1">0</h3>
          <p className="text-sm text-grey">Total Users</p>
        </div>
      </div>
    </div>
  );
}
