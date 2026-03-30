"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useMemo } from "react";
import { useMergedProducts } from "@/lib/useMergedCatalog";
import { useCatalogStore } from "@/store/useCatalogStore";

export function CategoryProductsAdmin({ categorySlug }: { categorySlug: string }) {
  const all = useMergedProducts();
  const products = useMemo(() => all.filter((p) => p.category === categorySlug), [all, categorySlug]);
  const refresh = useCatalogStore((s) => s.refresh);

  if (products.length === 0) {
    return <p className="text-xs text-gray-400 py-2">No products in this category.</p>;
  }

  return (
    <div className="border-t border-gray-100 bg-[#FAFAFA] px-5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Products</p>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate text-[#1A1A1A]">{p.name}</span>
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={`/admin/products/${encodeURIComponent(p.id)}/edit`}
                className="text-[#007791] text-xs font-semibold hover:underline"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm(`Delete “${p.name}”?`)) return;
                  try {
                    const res = await fetch(`/api/admin/products/${encodeURIComponent(p.id)}`, { method: "DELETE" });
                    if (!res.ok) throw new Error(await res.text());
                    await refresh();
                    toast.success("Product removed");
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Delete failed");
                  }
                }}
                className="text-[#E01F54] text-xs font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
