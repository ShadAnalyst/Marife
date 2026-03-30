"use client";

import { useMemo } from "react";
import { MOCK_CATEGORIES, MOCK_PRODUCTS, type MockProduct } from "@/lib/mockData";
import { useCatalogExtensionsStore, type CustomCategoryRow } from "@/store/useCatalogExtensionsStore";

export type MergedCategory = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  count: number;
};

function mergeCategories(
  base: typeof MOCK_CATEGORIES,
  custom: CustomCategoryRow[],
  hidden: string[],
  displayOverrides: Record<string, { name?: string; imageUrl?: string }>
): MergedCategory[] {
  const bySlug = new Map<string, MergedCategory>();
  for (const c of base) {
    if (hidden.includes(c.slug)) continue;
    const o = displayOverrides[c.slug];
    bySlug.set(c.slug, {
      ...c,
      name: o?.name ?? c.name,
      imageUrl: o?.imageUrl ?? c.imageUrl,
    });
  }
  for (const c of custom) {
    if (hidden.includes(c.slug)) continue;
    bySlug.set(c.slug, { ...c });
  }
  return Array.from(bySlug.values());
}

function withCounts(categories: MergedCategory[], products: MockProduct[]): MergedCategory[] {
  return categories.map((c) => ({
    ...c,
    count: products.filter((p) => p.category === c.slug && p.isActive).length,
  }));
}

function buildMergedProducts(
  custom: MockProduct[],
  deletedIds: string[],
  overrides: Record<string, MockProduct>
): MockProduct[] {
  const bySlug = new Map<string, MockProduct>();

  const apply = (p: MockProduct) => {
    if (deletedIds.includes(p.id)) return;
    const merged = { ...p, ...overrides[p.id] };
    bySlug.set(merged.slug, merged);
  };

  for (const p of MOCK_PRODUCTS) apply(p);
  for (const p of custom) apply(p);

  return Array.from(bySlug.values());
}

export function useMergedCategories(): MergedCategory[] {
  const custom = useCatalogExtensionsStore((s) => s.customCategories);
  const customProducts = useCatalogExtensionsStore((s) => s.customProducts);
  const hidden = useCatalogExtensionsStore((s) => s.hiddenCategorySlugs);
  const displayOverrides = useCatalogExtensionsStore((s) => s.categoryDisplayOverrides);
  const deletedIds = useCatalogExtensionsStore((s) => s.deletedProductIds);
  const overrides = useCatalogExtensionsStore((s) => s.productOverrides);

  return useMemo(() => {
    const merged = mergeCategories(MOCK_CATEGORIES, custom, hidden, displayOverrides);
    const products = buildMergedProducts(customProducts, deletedIds, overrides);
    return withCounts(merged, products);
  }, [custom, customProducts, hidden, displayOverrides, deletedIds, overrides]);
}

export function useMergedProducts(): MockProduct[] {
  const custom = useCatalogExtensionsStore((s) => s.customProducts);
  const deletedIds = useCatalogExtensionsStore((s) => s.deletedProductIds);
  const overrides = useCatalogExtensionsStore((s) => s.productOverrides);

  return useMemo(
    () => buildMergedProducts(custom, deletedIds, overrides),
    [custom, deletedIds, overrides]
  );
}

export function useProductsByCategory(slug: string): MockProduct[] {
  const all = useMergedProducts();
  return useMemo(
    () => all.filter((p) => p.category === slug && p.isActive),
    [all, slug]
  );
}
