import Hero from "@/components/Hero";
import HeroExplainer from "@/components/HeroExplainer";

export const metadata = {
  title: 'Metapack Maison | Whisper fashion',
  description: 'own the moment',
}

export default function HomePage() {
  const products = [
    {
      id: 1,
      name: 'Orange Bomber Jacket',
      href: "/products/orange-bomber",
      price: '£39.99',
      imageSrc: '/images/jacket.jpg',
      imageAlt: 'Orangge bomber jacket',
    },
    {
      id: 2,
      name: 'knitted poncho',
      href: '#',
      price: '£59.99',
      imageSrc: '/images/poncho.jpg',
      imageAlt: 'knitted poncho',
    },
    {
      id: 3,
      name: 'three pack of t-shirts',
      href: '#',
      price: '£24.99',
      imageSrc: '/images/tshirts.jpg',
      imageAlt: 'three pack of t-shirts',
    },
  ];
  return (
    <>
    <Hero
      title=""
      description=""
      image="/images/hero.jpg"
    />
    <HeroExplainer
      products={products}
    />
    </>
  );
}