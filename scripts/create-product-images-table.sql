-- Create product_images table (Industry Best Practice for E-commerce)
-- This uses a one-to-many relationship, same as Amazon, Shopify, etc.

CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, image_url)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON product_images(product_id, sort_order);

-- Add RLS (Row Level Security) policies
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access (images are public)
CREATE POLICY "Allow public read access" ON product_images
  FOR SELECT USING (true);

-- Allow authenticated users with admin role to insert/update/delete
CREATE POLICY "Allow admin insert" ON product_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update" ON product_images
  FOR UPDATE USING (true);

CREATE POLICY "Allow admin delete" ON product_images
  FOR DELETE USING (true);
