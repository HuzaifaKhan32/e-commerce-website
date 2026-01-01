// components/ProductSkeleton.tsx
import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-secondary/10 animate-pulse">
      <div className="relative aspect-[4/5] bg-gray-200"></div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="mt-auto pt-6 border-t border-secondary/5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-12 ml-1"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-6"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;