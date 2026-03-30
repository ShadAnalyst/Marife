import { Metadata } from "next";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { PDPClient } from "@/components/product/PDPClient";
import { ResolveCustomProduct } from "@/components/product/ResolveCustomProduct";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return { title: "Product — Marife" };
  }
  return {
    title: product.name,
    description: product.descriptionShort ?? undefined,
    openGraph: {
      images: [{ url: product.images[0]?.urlMain }],
    },
  };
}

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return <ResolveCustomProduct slug={slug} />;
  }

  const related = MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  return (
    <PDPClient product={product} relatedProducts={related} categorySlug={product.category} />
  );
}
