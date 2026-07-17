import "dotenv/config";
import { prisma } from "../lib/prisma";
import * as bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);

  try {
    // Note: Prisma maps model names to lowerCamelCase on the client instance (e.g., users -> users or user)
    // If this throws an undefined error, change 'users' to 'user'
    const admin = await prisma.users.upsert({
      where: { email: 'admin@luxeleather.com' },
      update: {},
      create: {
        email: 'admin@luxeleather.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'admin',
        emailVerified: new Date(),
      },
    });

    console.log('✅ Admin user processed:', admin.email);
  } catch (error: unknown) {
    console.error('Error creating admin:', error);
  }

  // 2. Create sample products
  const products = [
    {
      name: 'Classic Bifold Wallet',
      price: 89.99,
      imag_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
      category: 'Featured, Best Seller, Wallets',
      description: 'Handcrafted from full-grain Italian leather. Features 6 card slots, 2 bill compartments, and a hidden pocket.',
      stock: 25,
      rating: 4.8,
      reviewCount: 142,
    },
    {
      name: 'Leather Messenger Bag',
      price: 249.99,
      imag_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
      category: 'Featured, Bags',
      description: 'Premium messenger bag with padded laptop compartment. Adjustable shoulder strap and brass hardware.',
      stock: 15,
      rating: 4.9,
      reviewCount: 89,
    },
    {
      name: 'Minimalist Card Holder',
      price: 45.00,
      imag_url: 'https://images.unsplash.com/photo-1591561954555-607968c989ab?auto=format&fit=crop&q=80&w=800',
      category: 'Best Seller, Accessories',
      description: 'Ultra-slim design holds 4-6 cards. Perfect for front-pocket carry.',
      stock: 50,
      rating: 4.7,
      reviewCount: 203,
    },
    {
      name: 'Vintage Leather Backpack',
      price: 299.99,
      imag_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      category: 'Featured, Bags',
      description: 'Spacious backpack with laptop sleeve and multiple compartments.',
      stock: 12,
      rating: 4.9,
      reviewCount: 67,
    },
    {
      name: 'Premium Leather Belt',
      price: 79.99,
      imag_url: 'https://images.unsplash.com/photo-1624222247344-2c2d9fbf396e?auto=format&fit=crop&q=80&w=800',
      category: 'Best Seller, Belts, Accessories',
      description: 'Full-grain leather belt with solid brass buckle.',
      stock: 40,
      rating: 4.6,
      reviewCount: 178,
    },
  ];

  console.log('📦 Creating products...');

  let createdCount = 0;
  for (const product of products) {
    try {
      // Note: If this throws an undefined error, change 'product' to 'products' depending on your schema
      await prisma.product.create({
        data: product,
      });
      console.log(`  ✅ Created: ${product.name}`);
      createdCount++;
    } catch (error: unknown) {
      console.error('Error creating product:', product.name, error);
    }
  }

  console.log(`✅ Created ${createdCount} products`);
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
