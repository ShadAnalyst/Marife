"use client";

import { useProductsByCategory } from "@/lib/useMergedCatalog";

export function CategoryProductCount({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const products = useProductsByCategory(slug);
  return <p className={className}>{products.length} Produkte</p>;
}
