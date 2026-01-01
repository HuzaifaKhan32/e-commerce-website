# Luxe Leather E-commerce Platform

A premium leather goods e-commerce platform built with Next.js 15, React 19, and TypeScript.

## Features

- **Product Management**: Full CRUD operations for products with admin panel
- **Shopping Cart**: Persistent cart with quantity management
- **Wishlist**: Product wishlisting functionality
- **User Authentication**: NextAuth.js with Google OAuth and credentials provider
- **Search & Filter**: Comprehensive product search with filtering capabilities
- **Reviews System**: Product reviews and ratings with moderation
- **Order Management**: Complete order processing system
- **Inventory Management**: Real-time stock tracking and validation
- **Responsive Design**: Mobile-first responsive UI
- **Security**: Rate limiting, input validation, and authentication
- **Notifications**: User feedback notifications and error handling

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **State Management**: React Context API
- **Icons**: React Icons
- **AI Integration**: Google Gemini for email content generation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd luxe-leather-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
API_KEY="your_google_gemini_api_key"
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/              # API routes
│   ├── admin/            # Admin panel pages
│   └── ...               # Other pages
├── components/            # Reusable UI components
├── context/               # React Context providers
├── lib/                   # Utility functions and libraries
├── services/              # Business logic services
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── ...
```

## API Routes

- `GET /api/products` - Get all products with optional filtering
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products` - Update a product (admin only)
- `DELETE /api/products` - Delete a product (admin only)
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart` - Remove item from cart
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist` - Remove item from wishlist
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create a new order
- `GET /api/reviews` - Get product reviews
- `POST /api/reviews` - Create a product review
- `PUT /api/reviews` - Update a review (admin only)
- `DELETE /api/reviews` - Delete a review (admin only)
- `GET /api/search` - Search products

## Security Features

- Rate limiting middleware
- Input validation and sanitization
- Authentication and authorization
- SQL injection prevention
- XSS protection
- Secure session management

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `NEXTAUTH_URL` - The URL of your NextAuth instance
- `NEXTAUTH_SECRET` - Secret for NextAuth
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `API_KEY` - Google Gemini API key

## Database Schema

The application uses Supabase PostgreSQL database with the following main tables:

- `products` - Product information (name, price, description, stock, etc.)
- `users` - User accounts
- `cart_items` - User shopping cart items
- `wishlist_items` - User wishlist items
- `orders` - Order information
- `order_items` - Items in each order
- `reviews` - Product reviews and ratings

## Deployment

The application is ready for deployment on Vercel or any other platform that supports Next.js 15.

### Vercel

1. Push your code to a Git repository
2. Import your project to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Admin Access

To access the admin panel:

1. Sign in with admin credentials:
   - Email: admin@luxeleather.com
   - Password: Admin@123
   - Or use Google OAuth if configured

2. Navigate to `/admin` to access the admin dashboard

The admin panel includes:
- Product management (CRUD operations)
- Order management
- User management
- Review moderation
- Site settings

## Database Setup

To set up the database with sample data:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to the SQL Editor (under Database section)
4. Run the SQL commands from `scripts/setup-sample-data.ts` to create the necessary tables and insert sample data

## Support

If you encounter any issues or have questions, please open an issue in the repository.