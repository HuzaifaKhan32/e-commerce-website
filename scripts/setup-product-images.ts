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

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Product images data - front and back images for each jacket
const productImages = [
  {
    product_id: 'a1b2c3d4-e001-4000-8000-000000000001',
    images: [
      { url: '/product_1/black_american (1).png', alt: 'Black American Jacket - Front View', sort_order: 1 },
      { url: '/product_1/back_black_american (1).png', alt: 'Black American Jacket - Back View', sort_order: 2 }
    ]
  },
  {
    product_id: 'a1b2c3d4-e002-4000-8000-000000000002',
    images: [
      { url: '/product_2/perl_black.jpg', alt: 'Perl Black Leather Jacket - Front View', sort_order: 1 },
      { url: '/product_2/back_perl.jpg', alt: 'Perl Black Leather Jacket - Back View', sort_order: 2 }
    ]
  },
  {
    product_id: 'a1b2c3d4-e003-4000-8000-000000000003',
    images: [
      { url: '/product_3/ferrari_front (1).png', alt: 'Ferrari Racing Jacket - Front View', sort_order: 1 },
      { url: '/product_3/ferrari_back (1).png', alt: 'Ferrari Racing Jacket - Back View', sort_order: 2 }
    ]
  },
  {
    product_id: 'a1b2c3d4-e004-4000-8000-000000000004',
    images: [
      { url: '/product_4/blue_jacket.jpg', alt: 'Blue Classic Jacket - Front View', sort_order: 1 },
      { url: '/product_4/blue_jacket_back.jpg', alt: 'Blue Classic Jacket - Back View', sort_order: 2 }
    ]
  },
  {
    product_id: 'a1b2c3d4-e005-4000-8000-000000000005',
    images: [
      { url: '/product_5/sonamclub_blue.jpg', alt: 'Sonam Club Blue Jacket - Front View', sort_order: 1 },
      { url: '/product_5/blue_perl.jpg', alt: 'Sonam Club Blue Jacket - Back View', sort_order: 2 }
    ]
  },
  {
    product_id: 'a1b2c3d4-e006-4000-8000-000000000006',
    images: [
      { url: '/product_6/perl_golden_red.jpg', alt: 'Perl Golden Red Jacket - Front View', sort_order: 1 },
      { url: '/product_6/perl_golden.jpg', alt: 'Perl Golden Red Jacket - Back View', sort_order: 2 }
    ]
  },
  {
    product_id: 'a1b2c3d4-e007-4000-8000-000000000007',
    images: [
      { url: '/product_7/green_jacket.jpg', alt: 'Green Urban Jacket - Front View', sort_order: 1 },
      { url: '/product_7/green_jacket_back.jpg', alt: 'Green Urban Jacket - Back View', sort_order: 2 }
    ]
  },
  {
    product_id: 'a1b2c3d4-e008-4000-8000-000000000008',
    images: [
      { url: '/product_8/red_jacket.jpg', alt: 'Red Perle Jacket - Front View', sort_order: 1 },
      { url: '/product_8/perle_jackets.jpg', alt: 'Red Perle Jacket - Back View', sort_order: 2 }
    ]
  },
  {
    product_id: 'a1b2c3d4-e009-4000-8000-000000000009',
    images: [
      { url: '/product_9/Whisk_yewmwimy3uzm2ytntqzn4iwlkbjy00sy0ytytcd.jpg', alt: 'Classic Black Bomber - Front View', sort_order: 1 },
      { url: '/product_9/jacket_back.jpg', alt: 'Classic Black Bomber - Back View', sort_order: 2 }
    ]
  },
  {
    product_id: 'a1b2c3d4-e010-4000-8000-000000000010',
    images: [
      { url: '/product_10/perle_black_red.jpeg', alt: 'Perle Red & Black Jacket - Front View', sort_order: 1 },
      { url: '/product_10/perle_red_jacket_back.jpeg', alt: 'Perle Red & Black Jacket - Back View', sort_order: 2 }
    ]
  }
];

async function setupProductImages() {
  console.log('Setting up product_images table...');

  // Step 1: Create the product_images table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS product_images (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
      image_url TEXT NOT NULL,
      alt_text TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(product_id, image_url)
    );
    
    CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
    CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON product_images(product_id, sort_order);
  `;

  console.log('Creating product_images table...');
  
  // Execute the SQL via Supabase RPC or direct query
  // Since we can't execute raw SQL easily, let's use the table creation approach
  
  // First, let's check if the table exists by trying to query it
  const { error: checkError } = await supabaseAdmin
    .from('product_images')
    .select('id')
    .limit(1);

  if (checkError && checkError.message.includes('relation "product_images" does not exist')) {
    console.log('Table does not exist. Please create it first using the SQL below:');
    console.log('\n--- SQL to run in Supabase Dashboard ---');
    console.log(createTableSQL);
    console.log('--- End SQL ---\n');
    console.log('After creating the table, run this script again to insert the images.');
    return;
  }

  // Step 2: Delete existing images for these products
  console.log('Clearing existing product images...');
  const productIds = productImages.map(p => p.product_id);
  const { error: deleteError } = await supabaseAdmin
    .from('product_images')
    .delete()
    .in('product_id', productIds);

  if (deleteError) {
    console.error('Error deleting existing images:', deleteError);
  }

  // Step 3: Insert new images
  console.log('Inserting product images...');
  let totalInserted = 0;

  for (const product of productImages) {
    const imagesToInsert = product.images.map(img => ({
      product_id: product.product_id,
      image_url: img.url,
      alt_text: img.alt,
      sort_order: img.sort_order
    }));

    const { data, error } = await supabaseAdmin
      .from('product_images')
      .insert(imagesToInsert)
      .select();

    if (error) {
      console.error(`Error inserting images for product ${product.product_id}:`, error);
    } else {
      totalInserted += data.length;
      console.log(`  ✓ Added ${data.length} images for product ${product.product_id}`);
    }
  }

  console.log(`\n✅ Successfully inserted ${totalInserted} product images!`);
}

setupProductImages();
