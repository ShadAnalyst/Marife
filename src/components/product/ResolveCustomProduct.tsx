"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { useCatalogExtensionsStore } from "@/store/useCatalogExtensionsStore";
import { PDPClient } from "./PDPClient";

export function ResolveCustomProduct({ slug }: { slug: string }) {
  const customProducts = useCatalogExtensionsStore((s) => s.customProducts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useCatalogExtensionsStore.persist.onFinishHydration(() => setHydrated(true));
    if (useCatalogExtensionsStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  const product = customProducts.find((p) => p.slug === slug);
  const merged = [...MOCK_PRODUCTS, ...customProducts];
  const related =
    product
      ? merged.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
      : [];

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-gray-500 text-sm">
        Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Product not found</h1>
        <p className="mt-2 text-gray-500 text-sm">This product may have been removed.</p>
        <Link href="/" className="mt-6 inline-block text-[#E01F54] font-semibold text-sm hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return <PDPClient product={product} relatedProducts={related} categorySlug={product.category} />;
}
