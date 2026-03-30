"use client";

import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useProductsByCategory } from "@/lib/useMergedCatalog";

export function CategoryProductSection({ slug }: { slug: string }) {
  const products = useProductsByCategory(slug);

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg font-medium">Keine Produkte gefunden</p>
        <p className="text-sm mt-2">In dieser Kategorie sind aktuell keine Produkte verfügbar.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="h-96 bg-[#F7F7F7] animate-pulse rounded-xl" />}>
      <ProductGrid products={products} columns={3} />
    </Suspense>
  );
}
