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
      name: 'Maison Metapack Black Cap',
      href: "/products/black-cap",
      price: '£24.99',
      imageSrc: '/images/blackcap1.png',
      imageAlt: 'Maison Metapack Black Cap',
    },
    {
      id: 2,
      name: 'Maison Metapack Black Tee',
      href: '/products/black-tee',
      price: '£24.99',
      imageSrc: '/images/blacktee1.png',
      imageAlt: 'Maison Metapack Black Tee',
    },
    {
      id: 3,
      name: 'Maison Metapack Black Hoodie',
      href: '/products/black-hoodie',
      price: '£59.99',
      imageSrc: '/images/blackhoodie1.png',
      imageAlt: 'Maison Metapack Black Hoodie',
    },
    {
      id: 4,
      name: 'Maison Metapack Grey Tee',
      href: "/products/grey-tee",
      price: '£24.99',
      imageSrc: '/images/greytee1.png',
      imageAlt: 'Maison Metapack Grey Tee',
    },
    {
      id: 5,
      name: 'Maison Metapack Grey Hoodie',
      href: '/products/grey-hoodie',
      price: '£59.99',
      imageSrc: '/images/greyhoodie1.png',
      imageAlt: 'Maison Metapack Grey Hoodie',
    },
    {
      id: 6,
      name: 'Coming soon',
      href: '#',
      price: '',
      imageSrc: '/images/coming.png',
      imageAlt: 'Coming soon Maison Metapack "Pack Club Crew jumper"',
    },
  ];
  return (
    <>
    <Hero
      title=""
      description=""
      alt="Maison Metapack hero image"
      image="/images/hero.png"
    />
    <HeroExplainer
      products={products}
    />
    </>
  );
}