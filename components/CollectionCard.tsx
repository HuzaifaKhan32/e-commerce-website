
import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { Collection } from '../types.ts';

interface CollectionCardProps {
  collection: Collection;
  span?: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, span = "" }) => {
  return (
    <div className={`group relative h-96 rounded-xl overflow-hidden cursor-pointer ${span}`}>
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
        style={{ backgroundImage: `url("${collection.imageUrl}")` }}
      />
      <div className="absolute inset-0 bg-secondary/30 group-hover:bg-secondary/50 transition-colors duration-500" />
      <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-white font-serif text-2xl font-bold mb-2">{collection.title}</h3>
        <p className="text-white/90 text-sm mb-6 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {collection.description}
        </p>
        <button className="w-fit flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider transition-all">
          <span className="border-b border-transparent group-hover:border-white transition-all">Explore</span>
          <FiArrowRight className="text-2xl transform group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CollectionCard;
