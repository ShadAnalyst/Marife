import { prismaProductToMock } from "@/lib/catalog-db";
import { prisma } from "@/lib/prisma";
import type { MockProduct } from "@/lib/mockData";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export async function getProductBySlug(slug: string): Promise<MockProduct | null> {
  if (process.env.DATABASE_URL) {
    try {
      const row = await prisma.product.findFirst({
        where: { slug },
        include: {
          variants: true,
          images: { orderBy: { sortOrder: "asc" } },
          categories: { include: { category: true } },
        },
      });
      if (row) return prismaProductToMock(row);
    } catch (e) {
      console.error("getProductBySlug:", e);
    }
  }
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(product: MockProduct): Promise<MockProduct[]> {
  if (process.env.DATABASE_URL) {
    try {
      const rows = await prisma.product.findMany({
        where: {
          id: { not: product.id },
          isActive: true,
          categories: { some: { category: { slug: product.category } } },
        },
        take: 4,
        include: {
          variants: true,
          images: { orderBy: { sortOrder: "asc" } },
          categories: { include: { category: true } },
        },
      });
      if (rows.length) return rows.map(prismaProductToMock);
    } catch (e) {
      console.error("getRelatedProducts:", e);
    }
  }
  return MOCK_PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
}
