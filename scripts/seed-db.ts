import fs from 'fs';
import path from 'path';

// Load .env file
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

import { supabaseAdmin } from '../lib/supabase-admin';

const sampleProducts = [
  {
    name: 'The Oxford Satchel',
    price: 350.00,
    rating: 5,
    review_count: 124,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    category: 'Featured',
    stock: 50,
    description: 'Handcrafted from premium Italian leather, this satchel combines timeless design with modern functionality.'
  },
  {
    name: 'Classic Tote',
    price: 295.00,
    rating: 4,
    review_count: 45,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    category: 'Featured',
    stock: 30,
    description: 'Spacious and elegant, perfect for daily use with premium leather construction.'
  },
  {
    name: 'Executive Wallet',
    price: 85.00,
    rating: 5,
    review_count: 89,
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    category: 'Featured',
    stock: 100,
    description: 'Slim profile wallet with multiple card slots and premium leather finish.'
  },
  {
    name: 'Weekender Duffle',
    price: 450.00,
    rating: 5,
    review_count: 210,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    category: 'Featured',
    stock: 25,
    description: 'Perfect for weekend getaways with spacious interior and durable construction.'
  },
  {
    name: 'Artisan Briefcase',
    price: 420.00,
    rating: 5,
    review_count: 56,
    image_url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    category: 'Best Seller',
    stock: 40,
    description: 'Professional briefcase with laptop compartment and premium leather details.'
  },
  {
    name: 'Minimal Cardholder',
    price: 45.00,
    rating: 4,
    review_count: 32,
    image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800',
    category: 'Best Seller',
    stock: 200,
    description: 'Ultra-slim cardholder for the minimalist lifestyle.'
  },
  {
    name: 'Urban Chelsea Boot',
    price: 195.00,
    rating: 5,
    review_count: 98,
    image_url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800',
    category: 'Best Seller',
    stock: 60,
    description: 'Comfortable and stylish Chelsea boots with premium leather upper.'
  },
  {
    name: "Traveler's Journal",
    price: 55.00,
    rating: 5,
    review_count: 245,
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    category: 'Best Seller',
    stock: 80,
    description: 'Leather-bound journal perfect for capturing your travel memories.'
  }
];

async function seedProducts() {
  console.log('Seeding products...');
  
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(sampleProducts)
    .select();

  if (error) {
    console.error('Error seeding products:', error);
  } else {
    console.log(`Successfully seeded ${data.length} products.`);
  }
}

seedProducts();
