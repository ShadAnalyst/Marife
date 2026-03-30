"use client";

import { useEffect, useMemo } from "react";
import type { MockProduct } from "@/lib/mockData";
import { useCatalogStore } from "@/store/useCatalogStore";

export type { MergedCategory } from "@/lib/catalog-types";

export function useMergedCategories() {
  const categories = useCatalogStore((s) => s.categories);
  const load = useCatalogStore((s) => s.load);
  const loaded = useCatalogStore((s) => s.loaded);
  useEffect(() => {
    if (!loaded) void load();
  }, [loaded, load]);
  return categories;
}

export function useMergedProducts(): MockProduct[] {
  const products = useCatalogStore((s) => s.products);
  const load = useCatalogStore((s) => s.load);
  const loaded = useCatalogStore((s) => s.loaded);
  useEffect(() => {
    if (!loaded) void load();
  }, [loaded, load]);
  return products;
}

export function useProductsByCategory(slug: string): MockProduct[] {
  const all = useMergedProducts();
  return useMemo(
    () => all.filter((p) => p.category === slug && p.isActive),
    [all, slug]
  );
}
