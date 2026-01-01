// scripts/setup-sample-data.ts
// This script is for reference to help set up sample data in your Supabase database

/*
To set up sample data in your Supabase database:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to the SQL Editor (under Database section)
4. Run the following SQL commands to create the necessary tables:

-- Create products table
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  rating INTEGER DEFAULT 5,
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  category VARCHAR(50),
  stock INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create users table (if not already created by Supabase Auth)
-- This is handled by Supabase Auth, but you might need a profiles table:
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  updated_at TIMESTAMP,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  color VARCHAR(50) DEFAULT 'Espresso',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id, color)
);

-- Create wishlist_items table
CREATE TABLE wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

Then insert sample data:

INSERT INTO products (id, name, price, rating, review_count, image_url, category, stock, description) VALUES
('prod-1', 'The Oxford Satchel', 350.00, 5, 124, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800', 'Featured', 50, 'Handcrafted from premium Italian leather, this satchel combines timeless design with modern functionality.'),
('prod-2', 'Classic Tote', 295.00, 4, 45, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', 'Featured', 30, 'Spacious and elegant, perfect for daily use with premium leather construction.'),
('prod-3', 'Executive Wallet', 85.00, 5, 89, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800', 'Featured', 100, 'Slim profile wallet with multiple card slots and premium leather finish.'),
('prod-4', 'Weekender Duffle', 450.00, 5, 210, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', 'Featured', 25, 'Perfect for weekend getaways with spacious interior and durable construction.'),
('prod-5', 'Artisan Briefcase', 420.00, 5, 56, 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800', 'Best Seller', 40, 'Professional briefcase with laptop compartment and premium leather details.'),
('prod-6', 'Minimal Cardholder', 45.00, 4, 32, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800', 'Best Seller', 200, 'Ultra-slim cardholder for the minimalist lifestyle.'),
('prod-7', 'Urban Chelsea Boot', 195.00, 5, 98, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800', 'Best Seller', 60, 'Comfortable and stylish Chelsea boots with premium leather upper.'),
('prod-8', 'Traveler''s Journal', 55.00, 5, 245, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800', 'Best Seller', 80, 'Leather-bound journal perfect for capturing your travel memories.');

*/

export {};