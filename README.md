# Maison Metapack - Fashion E-commerce Platform

A modern, responsive e-commerce website built with Next.js for the contemporary fashion brand maison-metapack. Features a clean design, shopping cart functionality, and seamless user experience with integrated delivery management via Metapack.

## 🚀 Features

- **Modern UI/UX**: Clean, contemporary design with responsive layout
- **Shopping Cart**: Full cart functionality with persistent storage
- **Product Catalog**: Dynamic product pages with detailed views
- **Checkout Flow**: Complete checkout process with multiple delivery options
- **Delivery Integration**: Metapack-powered delivery options and PUDO collection points
- **Interactive Maps**: MapLibre GL integration for collection point selection
- **Contact System**: Integrated contact form with email notifications
- **SEO Optimized**: Meta tags, sitemap, and robots.txt included
- **Performance**: Optimized images and fonts with Next.js

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Headless UI](https://headlessui.com/)
- **Icons**: [Heroicons](https://heroicons.com/)
- **Maps**: [MapLibre GL](https://maplibre.org/)
- **Database**: [Supabase](https://supabase.com/)
- **Email**: [Resend](https://resend.com/)
- **Delivery**: [Metapack API](https://metapack.com/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Fonts**: Playfair Display & Plus Jakarta Sans

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.jsx           # Homepage
│   ├── layout.jsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── about/             # About page
│   ├── basket/            # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── confirmation/      # Order confirmation
│   ├── products/          # Product pages
│   └── api/               # API routes
│       ├── contact/       # Contact form API
│       └── metapack/      # Metapack integration APIs
├── components/            # React components
│   ├── Navbar.jsx         # Navigation component
│   ├── Hero.jsx           # Hero section
│   ├── ProductDetail.jsx  # Product detail view
│   ├── Basket.jsx         # Shopping cart
│   ├── CheckOut.jsx       # Checkout form
│   ├── MapComponent.jsx   # Interactive maps
│   └── Footer.jsx         # Footer component
└── context/
    └── CartContext.jsx    # Shopping cart state management
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- Metapack API access
- Resend API key
- MapTiler API key

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd maison-metapack
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Metapack API Configuration
METAPACK_DDO_KEY=your_metapack_ddo_api_key
METAPACK_SAPI_BASIC_AUTH=your_metapack_sapi_basic_auth

# Email Configuration
RESEND_API_KEY=your_resend_api_key

# Maps Configuration
NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_api_key

# Optional: Development flags
NODE_ENV=development
```

### 4. Set up Supabase
1. Create a new Supabase project
2. Set up your database tables (see Database Schema section)
3. Configure authentication settings
4. Update environment variables with your project credentials

### 5. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 6. Open your browser
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🗃️ Database Schema

### Products Table (Supabase)
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  sizes JSONB,
  colors JSONB,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Orders Table (Supabase)
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  delivery_address JSONB NOT NULL,
  order_items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_method VARCHAR(100),
  order_status VARCHAR(50) DEFAULT 'pending',
  metapack_reference VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🛒 Key Components

### Shopping Cart System
The application uses React Context ([`CartContext.jsx`](src/context/CartContext.jsx)) for state management:
- Add/remove items from cart
- Update quantities
- Persistent cart storage using localStorage
- Real-time cart count updates

### Delivery Management
Powered by Metapack API integration:
- **Standard Delivery**: Next working day delivery
- **Nominated Day**: Calendar-based date selection with available slots
- **Collection Points (PUDO)**: Local pickup locations with interactive map
- **Click & Collect**: Office collection (coming soon)

### Interactive Maps
- MapLibre GL for collection point visualization
- Geocoding for postcode-based search
- Custom markers and popup information
- Responsive design for mobile/desktop

## 📦 Delivery & Collection Options

### Standard Delivery
- Fixed next-day delivery options
- Multiple carrier support
- Dynamic pricing based on location

### Nominated Day Delivery
- Calendar interface for date selection
- Real-time availability checking
- Booking code generation for confirmed slots

### Collection Points (PUDO)
- Postcode-based search
- Interactive map with store locations
- Opening hours and contact information
- Distance-based sorting

### Click & Collect
- Office location selection
- Coming soon feature with placeholder

## 🗺️ Maps Integration

The checkout process includes interactive maps for collection point selection:
- **MapLibre GL**: Open-source mapping solution
- **Custom Markers**: Visual indicators for collection points
- **Interactive Selection**: Click-to-select functionality
- **Responsive Map Views**: Adapts to viewport size
- **Geocoding API**: Location search functionality

## 🌐 API Integration

### Internal API Routes
- `/api/contact` - Contact form submission
- `/api/metapack/delivery-options` - Fetch delivery options
- `/api/metapack/pudo-options` - Collection point search
- `/api/orders` - Order management

### External APIs
- **Metapack DDO API**: Delivery option discovery
- **Metapack SAPI**: Shipping API for bookings
- **MapTiler**: Geocoding and mapping services
- **Resend**: Email delivery service

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 📱 Pages & Routes

- `/` - Homepage with hero section and featured products
- `/about` - About page with brand story
- `/products/[slug]` - Individual product pages
- `/basket` - Shopping cart overview
- `/checkout` - Checkout process with delivery options
- `/confirmation` - Order confirmation page
- `/contact` - Contact form page

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Import your project
   - Configure environment variables (see below)

3. **Environment Variables Setup**
   In your Vercel dashboard, add these environment variables:
   
   **Production Environment:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
   METAPACK_DDO_KEY=your_production_metapack_ddo_key
   METAPACK_SAPI_BASIC_AUTH=your_production_metapack_sapi_auth
   RESEND_API_KEY=your_production_resend_key
   NEXT_PUBLIC_MAPTILER_API_KEY=your_production_maptiler_key
   NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   # Trigger deployment
   git push origin main
   # or use Vercel CLI
   vercel --prod
   ```

### Manual Environment Variable Refresh

If environment variables are lost, redeploy with:
```bash
# Using Vercel CLI
vercel --prod --force

# Or trigger via GitHub
git commit --allow-empty -m "Redeploy to refresh environment variables"
git push origin main
```

## 🔧 Troubleshooting

### Common Issues

**Environment Variables Missing in Production:**
1. Check Vercel dashboard → Settings → Environment Variables
2. Ensure variables are set for "Production" environment
3. Redeploy after adding variables

**Metapack API Not Working:**
1. Verify API keys in environment variables
2. Check API endpoint accessibility
3. Review console logs for specific error messages

**Map Not Loading:**
1. Confirm MapTiler API key is valid
2. Check browser console for CORS errors
3. Verify API key has necessary permissions

**Supabase Connection Issues:**
1. Verify project URL and keys
2. Check RLS (Row Level Security) policies
3. Confirm network connectivity

## 📊 Analytics & SEO

- **Vercel Analytics**: Integrated for performance monitoring
- **SEO Optimization**: Meta tags, Open Graph, and structured data
- **Sitemap**: Auto-generated sitemap at `/sitemap.xml`
- **Robots.txt**: Search engine crawling instructions

## 🔒 Security

- Environment variables for sensitive data
- Supabase RLS for database security
- API rate limiting
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to maison-metapack Fashion, a subsidiary of Metapack/Auctane.

## 📞 Support

For technical support and inquiries:
- **Email**: [support@maison-metapack.com](mailto:support@maison-metapack.com)
- **Phone**: +44 203 9688 022
- **Developer**: [MarcosoTech](https://marcosotech.com)

---

Built with ❤️ by [MarcosoTech](https://marcosotech.com)