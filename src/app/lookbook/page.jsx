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
    date: 'April 2023',
    image: {
      src: "/images/lookbook1.png",
      alt: "Hipster delivery driver wearing a Metapack t-shirt and cap, holding a Metapack package.",
    },
  },
  {
    id: 2,
    title: 'Maison Metapack | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook2.png",
      alt: "Hipster delivery driver wearing a Metapack t-shirt and cap, holding a Metapack package.",
    },
  },
  {
    id: 3,
    title: 'Maison Metapack | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook3.png",
      alt: "Hipster delivery driver wearing a Metapack t-shirt and cap, holding a Metapack package.",
    },
  },
 {
    id: 4,
    title: 'Maison Metapack | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook4.png",
      alt: "Hipster delivery driver wearing a Metapack t-shirt and cap, holding a Metapack package.",
    },
  },
  {
    id: 5,
    title: 'Maison Metapack | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook5.png",
      alt: "Hipster delivery driver wearing a Metapack t-shirt and cap, holding a Metapack package.",
    },
  },
  {
    id: 6,
    title: 'Maison Metapack | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook6.png",
      alt: "Hipster delivery driver wearing a Metapack t-shirt and cap, holding a Metapack package.",
    },
  },
   {
    id: 7,
    title: 'Maison Metapack | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook7.png",
      alt: "Hipster delivery driver wearing a Metapack t-shirt and cap, holding a Metapack package.",
    },
  },
  {
    id: 8,
    title: 'Maison Metapack | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook8.png",
      alt: "Hipster delivery driver wearing a Metapack t-shirt and cap, holding a Metapack package.",
    },
  },
  {
    id: 9,
    title: 'Maison Metapack | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook9.png",
      alt: "Hipster delivery driver wearing a Metapack t-shirt and cap, holding a Metapack package.",
    },
  },
];

export default function LookBookPage() {
  return (
    <>
      <LookBook items={gallery} />
    </>
  );
}