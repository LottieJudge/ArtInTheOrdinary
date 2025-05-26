import LookBook from "@/components/LookBook";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Metapack Maison Lookbook",
  description: "Explore our latest products and collections",
  keywords: "lookbook, fashion, style, trends, collection, products, ecommerce",
};

const gallery = [
  {
    id: 1,
    title: 'Maison Metapack | Spring Drop',
    href: '#',
    date: 'April 2023',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-01.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 2,
    title: 'Maison Metapack | Spring Drop',
    href: '#',
    date: 'May 2023',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-02.jpg',
    imageAlt: 'Paper card sitting upright in walnut card holder on desk.',
  },
  {
    id: 3,
    title: 'Maison Metapack | Christmas drop',
    href: '#',
    date: 'December 2023',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-03.jpg',
    imageAlt: 'Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop.',
  },
 {
    id: 4,
    title: 'Maison Metapack | Spring Drop',
    href: '#',
    date: 'April 2023',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-01.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 5,
    title: 'Maison Metapack | Spring Drop',
    href: '#',
    date: 'May 2023',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-02.jpg',
    imageAlt: 'Paper card sitting upright in walnut card holder on desk.',
  },
  {
    id: 6,
    title: 'Maison Metapack | Christmas drop',
    href: '#',
    date: 'December 2023',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-03.jpg',
    imageAlt: 'Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop.',
  },
   {
    id: 7,
    title: 'Maison Metapack | Spring Drop',
    href: '#',
    date: 'April 2023',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-01.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 8,
    title: 'Maison Metapack | Spring Drop',
    href: '#',
    date: 'May 2023',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-02.jpg',
    imageAlt: 'Paper card sitting upright in walnut card holder on desk.',
  },
  {
    id: 9,
    title: 'Maison Metapack | Christmas drop',
    href: '#',
    date: 'December 2023',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-03.jpg',
    imageAlt: 'Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop.',
  },
  {
    id: 10,
    title: 'Maison Metapack | Christmas drop',
    href: '#',
    date: 'December 2023',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-01-image-card-03.jpg',
    imageAlt: 'Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop.',
  },
];

export default function LookBookPage() {
  return (
    <>
      <LookBook gallery={gallery} />
    </>
  );
}