import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { products } from "@/data/products";


export async function generateMetadata({ params }) {
  const product = Object.values(products).find((p) => p.slug === params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `Buy the ${product.name} at Maison Metapack.`,
    keywords: `${product.name}, fashion, Maison Metapack, clothing, accessories`,
  };
}


export default function ProductPage({ params }) {
  const product = Object.values(products).find((p) => p.slug === params.slug);
  if (!product) return notFound();

  return <ProductDetail product={product} />;
}