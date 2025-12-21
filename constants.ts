
import { Product, Collection } from './types.ts';

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Oxford Satchel',
    price: 350.00,
    rating: 5,
    reviewCount: 124,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    category: 'Featured'
  },
  {
    id: '2',
    name: 'Classic Tote',
    price: 295.00,
    rating: 4,
    reviewCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    category: 'Featured'
  },
  {
    id: '3',
    name: 'Executive Wallet',
    price: 85.00,
    rating: 5,
    reviewCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    category: 'Featured'
  },
  {
    id: '4',
    name: 'Weekender Duffle',
    price: 450.00,
    rating: 5,
    reviewCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    category: 'Featured'
  }
];

export const BEST_SELLERS: Product[] = [
  {
    id: '5',
    name: 'Artisan Briefcase',
    price: 420.00,
    rating: 5,
    reviewCount: 56,
    imageUrl: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    category: 'Best Seller'
  },
  {
    id: '6',
    name: 'Minimal Cardholder',
    price: 45.00,
    rating: 4,
    reviewCount: 32,
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800',
    category: 'Best Seller'
  },
  {
    id: '7',
    name: 'Urban Chelsea Boot',
    price: 195.00,
    rating: 5,
    reviewCount: 98,
    imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800',
    category: 'Best Seller'
  },
  {
    id: '8',
    name: "Traveler's Journal",
    price: 55.00,
    rating: 5,
    reviewCount: 245,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    category: 'Best Seller'
  }
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'm1',
    title: "Men's Collection",
    description: "Rugged durability meets refined style for the modern gentleman.",
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'w1',
    title: "Women's Collection",
    description: "Elegant designs crafted to elevate your everyday essentials.",
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p1',
    title: "Premium Line",
    description: "Exquisite materials and limited edition craftsmanship.",
    imageUrl: 'https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=800'
  }
];

export const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvRmn63FwZyzLpnY5dp6vNRFaSaWp00gmuyXooBPKOEAB4gwhSjC0cj5iODGgUu474LXu0wB4eoirZ9_pukyq4V6JjdYyC5mc1F3KRIKGk5mVzTsDMeGzhra_QYmwwrubkZ5BolnJBmlY1sUUhcao-sANTXyBIhQ9zVedt7tVe20HAOM2kuomPWMB0v1B0uR64u7bMhV-WVRqJGeo_jLvgii-UBkgqazwKLMp5LBB3KeRoqX2eKbCTVwwmxks4LlaagdsirI3FPncO';
