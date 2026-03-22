
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

async function testConnection() {
  console.log('Testing Supabase connection...');
  try {
    const { data, error } = await supabaseAdmin.from('products').select('*').limit(1);
    if (error) {
      console.error('Error connecting to products table:', error.message);
      if (error.code === '42P01') {
          console.log('Table "products" does not exist.');
      }
    } else {
      console.log('Successfully connected to "products" table.');
      console.log(`Found ${data.length} products.`);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
