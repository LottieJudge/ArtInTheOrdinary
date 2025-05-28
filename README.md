# Maison Metapack - Fashion E-commerce Platform

A modern, responsive e-commerce website built with Next.js for the contemporary fashion brand maison-metapack. Features a clean design, shopping cart functionality, and seamless user experience.

## 🚀 Features

- **Modern UI/UX**: Clean, contemporary design with responsive layout
- **Shopping Cart**: Full cart functionality with persistent storage
- **Product Catalog**: Dynamic product pages with detailed views
- **Checkout Flow**: Complete checkout process with order confirmation
- **Contact System**: Integrated contact form with email notifications
- **SEO Optimized**: Meta tags, sitemap, and robots.txt included
- **Performance**: Optimized images and fonts with Next.js

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Headless UI](https://headlessui.com/)
- **Icons**: [Heroicons](https://heroicons.com/)
- **Fonts**: Playfair Display & Plus Jakarta Sans
- **Email**: [Resend](https://resend.com/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

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
├── components/            # React components
│   ├── Navbar.jsx         # Navigation component
│   ├── Hero.jsx           # Hero section
│   ├── ProductDetail.jsx  # Product detail view
│   ├── Basket.jsx         # Shopping cart
│   ├── CheckOut.jsx       # Checkout form
│   └── Footer.jsx         # Footer component
└── context/
    └── CartContext.jsx    # Shopping cart state management
```

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd maison-metapack
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛒 Key Components

### Shopping Cart System
The application uses React Context ([`CartContext.jsx`](src/context/CartContext.jsx)) for state management:
- Add/remove items from cart
- Update quantities
- Persistent cart storage using localStorage
- Real-time cart count updates

### Product Management
- Dynamic product pages with detailed views
- Color and size selection
- Product image galleries
- Inventory management

### Checkout Process
- Multi-step checkout form
- Shipping and billing information
- Payment method selection
- Order confirmation with tracking

## 🎨 Styling & Design

- **Tailwind CSS 4**: Utility-first CSS framework
- **Custom Fonts**: Playfair Display for headings, Plus Jakarta Sans for body text
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Component Library**: Headless UI for accessible, unstyled components

## 📧 Contact & Email Integration

The contact form ([`ContactUs.jsx`](src/components/ContactUs.jsx)) integrates with Resend for email notifications:
- Form validation
- Email delivery to specified recipients
- Success/error status handling

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
- `/checkout` - Checkout process
- `/confirmation` - Order confirmation page

📦 Delivery & Collection Options
The application implements a sophisticated delivery system powered by Metapack:

Standard Delivery: Fixed-date delivery with carrier options
Nominated Day: Calendar-based delivery date selection
Collection Points (PUDO): Integration with local pickup locations
Geocoding: Postcode-based search for nearby collection points
Dynamic Pricing: Variable pricing based on delivery method


🗺️ Maps Integration
The checkout process includes interactive maps for collection point selection:

MapLibre GL: Open-source mapping solution
Custom Markers: Visual indicators for collection points
Interactive Selection: Click-to-select functionality
Responsive Map Views: Adapts to viewport size
Geocoding API: Location search functionality

🌐 API Integration
The application connects to several backend services:

Metapack API: For delivery options and PUDO locations (/api/metapack/pudo-options)
Contact Form API: For customer inquiries
Email Notification API: For order confirmations
Geocoding API: For location-based services


## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically with each push

## 📊 Analytics & SEO

- **Vercel Analytics**: Integrated for performance monitoring
- **SEO Optimization**: Meta tags, Open Graph, and structured data
- **Sitemap**: Auto-generated sitemap at `/sitemap.xml`
- **Robots.txt**: Search engine crawling instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to maison-metapack Fashion a subsidary of Metapack/Auctane. 

## 📞 Support

For support and inquiries, please contact:
- Phone: +44 203 9688 022

---

Built with ❤️ by [MarcosoTech](https://marcosotech.com)
