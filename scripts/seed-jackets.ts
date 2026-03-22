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

const jacketProducts = [
  {
    id: 'a1b2c3d4-e001-4000-8000-000000000001',
    name: 'Black American Jacket',
    price: 189.00,
    rating: 5,
    review_count: 87,
    image_url: '/product_1/black_american (1).png',
    category: 'Jackets',
    stock: 45,
    description: 'Color: Black. Classic black American-style jacket with premium finish. Features a sleek front design and comfortable back fit, perfect for urban adventures. Back view: /product_1/back_black_american (1).png'
  },
  {
    id: 'a1b2c3d4-e002-4000-8000-000000000002',
    name: 'Perl Black Leather Jacket',
    price: 249.00,
    rating: 5,
    review_count: 124,
    image_url: '/product_2/perl_black.jpg',
    category: 'Jackets',
    stock: 30,
    description: 'Color: Black. Sophisticated perl black leather jacket with exceptional craftsmanship. Combines elegance with durability for the modern fashionista. Back view: /product_2/back_perl.jpg'
  },
  {
    id: 'a1b2c3d4-e003-4000-8000-000000000003',
    name: 'Ferrari Racing Jacket',
    price: 299.00,
    rating: 5,
    review_count: 156,
    image_url: '/product_3/ferrari_front (1).png',
    category: 'Jackets',
    stock: 25,
    description: 'Color: Red. High-performance racing-inspired jacket with Ferrari styling. Bold red design with sporty aesthetics for those who love speed and style. Back view: /product_3/ferrari_back (1).png'
  },
  {
    id: 'a1b2c3d4-e004-4000-8000-000000000004',
    name: 'Blue Classic Jacket',
    price: 179.00,
    rating: 4,
    review_count: 92,
    image_url: '/product_4/blue_jacket.jpg',
    category: 'Jackets',
    stock: 50,
    description: 'Color: Blue. Timeless blue jacket with versatile styling. Perfect for both casual and semi-formal occasions with its refined design. Back view: /product_4/blue_jacket_back.jpg'
  },
  {
    id: 'a1b2c3d4-e005-4000-8000-000000000005',
    name: 'Sonam Club Blue Jacket',
    price: 219.00,
    rating: 5,
    review_count: 78,
    image_url: '/product_5/sonamclub_blue.jpg',
    category: 'Jackets',
    stock: 35,
    description: 'Color: Blue. Exclusive Sonam Club edition in stunning blue. Features unique perl accents and premium construction for nightclub elegance. Back view: /product_5/blue_perl.jpg'
  },
  {
    id: 'a1b2c3d4-e006-4000-8000-000000000006',
    name: 'Perl Golden Red Jacket',
    price: 279.00,
    rating: 5,
    review_count: 103,
    image_url: '/product_6/perl_golden_red.jpg',
    category: 'Jackets',
    stock: 28,
    description: 'Color: Red/Gold. Luxurious perl jacket with golden and red accents. Eye-catching design that exudes opulence and sophistication. Back view: /product_6/perl_golden.jpg'
  },
  {
    id: 'a1b2c3d4-e007-4000-8000-000000000007',
    name: 'Green Urban Jacket',
    price: 169.00,
    rating: 4,
    review_count: 65,
    image_url: '/product_7/green_jacket.jpg',
    category: 'Jackets',
    stock: 55,
    description: 'Color: Green. Fresh green urban jacket for the eco-conscious fashionista. Modern cut with comfortable fit for everyday wear. Back view: /product_7/green_jacket_back.jpg'
  },
  {
    id: 'a1b2c3d4-e008-4000-8000-000000000008',
    name: 'Red Perle Jacket',
    price: 239.00,
    rating: 5,
    review_count: 112,
    image_url: '/product_8/red_jacket.jpg',
    category: 'Jackets',
    stock: 40,
    description: 'Color: Red. Bold red perle jacket with stunning visual appeal. Premium materials and expert tailoring for a perfect fit. Back view: /product_8/perle_jackets.jpg'
  },
  {
    id: 'a1b2c3d4-e009-4000-8000-000000000009',
    name: 'Classic Black Bomber',
    price: 199.00,
    rating: 5,
    review_count: 145,
    image_url: '/product_9/Whisk_yewmwimy3uzm2ytntqzn4iwlkbjy00sy0ytytcd.jpg',
    category: 'Jackets',
    stock: 42,
    description: 'Color: Black. Essential black bomber jacket with timeless appeal. Versatile piece that complements any wardrobe with its classic design. Back view: /product_9/jacket_back.jpg'
  },
  {
    id: 'a1b2c3d4-e010-4000-8000-000000000010',
    name: 'Perle Red & Black Jacket',
    price: 259.00,
    rating: 5,
    review_count: 98,
    image_url: '/product_10/perle_black_red.jpeg',
    category: 'Jackets',
    stock: 32,
    description: 'Color: Red/Black. Striking perle jacket combining red and black elements. Dynamic design with premium finish for statement-making style. Back view: /product_10/perle_red_jacket_back.jpeg'
  }
];

async function seedJackets() {
  console.log('Seeding jacket products...');

  // First, check if products table exists and clear existing jacket products
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('products')
    .select('id')
    .in('id', jacketProducts.map(p => p.id));

  if (existing && existing.length > 0) {
    console.log(`Found ${existing.length} existing jacket products. Deleting them first...`);
    const { error: deleteError } = await supabaseAdmin
      .from('products')
      .delete()
      .in('id', jacketProducts.map(p => p.id));

    if (deleteError) {
      console.error('Error deleting existing products:', deleteError);
    }
  }

  // Insert new jacket products
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(jacketProducts)
    .select();

  if (error) {
    console.error('Error seeding jacket products:', error);
    process.exit(1);
  } else {
    console.log(`✅ Successfully seeded ${data.length} jacket products.`);
    console.log('\nInserted products:');
    data.forEach((product) => {
      console.log(`  - ${product.name} ($${product.price})`);
    });
  }
}

seedJackets();
