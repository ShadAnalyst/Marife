import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PDPClient } from "@/components/product/PDPClient";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog-server";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
/** Avoid Prisma at build time when DATABASE_URL is set but the DB is not reachable (e.g. local CI). */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
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

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);

  return <PDPClient product={product} relatedProducts={related} categorySlug={product.category} />;
}
