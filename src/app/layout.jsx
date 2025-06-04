import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactUs from "@/components/ContactUs";
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from '../context/CartContext';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-jakarta',
  display: 'swap',
});


export const metadata = {
  title: "Your Site Title",
  description: "Your site description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${plusJakartaSans.variable} ${playfairDisplay.variable} font-body antialiased`}>
        <CartProvider>   
        <Navbar />
        {/* analytics only */}
        <Analytics />
        <main>{children}</main>
        <Footer />  
        </CartProvider>
      </body>
    </html>
  );
}
