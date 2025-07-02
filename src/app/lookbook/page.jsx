import LookBook from "@/components/LookBook";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Art In The Ordinary Gallery",
  description: "Explore our latest and previous collections",
  keywords: "lookbook, fashion, style, trends, collection, products, ecommerce",
};

const gallery = [
  {
    id: 1,
    title: 'Art In The Ordinary | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook1.png",
      alt: "Art In The Ordinary description TO ADD",
    },
  },
  {
    id: 2,
    title: 'Art In The Ordinary | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook2.png",
      alt: "Art In The Ordinary description TO ADD",
    },
  },
  {
    id: 3,
    title: 'Art In The Ordinary | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook3.png",
      alt: "Art In The Ordinary description TO ADD",
    },
  },
 {
    id: 4,
    title: 'Art In The Ordinary | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook4.png",
      alt: "Art In The Ordinary description TO ADD",
    },
  },
  {
    id: 5,
    title: 'Art In The Ordinary | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook5.png",
      alt: "Art In The Ordinary description TO ADD",
    },
  },
  {
    id: 6,
    title: 'Art In The Ordinary | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook6.png",
      alt: "Art In The Ordinary description TO ADD",
    },
  },
   {
    id: 7,
    title: 'Art In The Ordinary | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook7.png",
      alt: "Art In The Ordinary description TO ADD",
    },
  },
  {
    id: 8,
    title: 'Art In The Ordinary | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook8.png",
      alt: "Art In The Ordinary description TO ADD",
    },
  },
  {
    id: 9,
    title: 'Art In The Ordinary | Spring Drop',
    date: 'April 2023',
    image: {
      src: "/images/lookbook9.png",
      alt: "Art In The Ordinary description TO ADD",
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