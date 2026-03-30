import type { MergedCategory } from "@/lib/catalog-types";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mockData";

export function getMockCatalogResponse() {
  const products = MOCK_PRODUCTS;
  const categories: MergedCategory[] = MOCK_CATEGORIES.map((c) => ({
    ...c,
    count: products.filter((p) => p.category === c.slug && p.isActive).length,
  }));
  return { categories, products, source: "mock" as const };
}
