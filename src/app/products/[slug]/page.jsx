import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { products } from "@/data/products";

export async function generateStaticParams() {
  return Object.values(products).map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = Object.values(products).find((p) => p.slug === resolvedParams.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `Buy the ${product.name} at Art in the Ordinary.`,
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = Object.values(products).find((p) => p.slug === resolvedParams.slug);
  if (!product) return notFound();

  return <ProductDetail product={product} />;
}