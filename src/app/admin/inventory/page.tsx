"use client";

import { useState } from "react";
import { useMergedProducts } from "@/lib/useMergedCatalog";
import { formatCHF } from "@/lib/utils";
import { ExclamationTriangleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const MOCK_PRODUCTS = useMergedProducts();

  const allVariants = MOCK_PRODUCTS.flatMap((p) =>
    p.variants.map((v) => ({
      productId: p.id,
      productName: p.name,
      sku: v.sku,
      variantName: v.variantName,
      size: v.sizeValue,
      stock: v.currentStock,
      isAvailable: v.isAvailable,
      price: formatCHF(p.basePrice + (v.priceModifier ?? 0)),
    }))
  ).filter(
    (v) =>
      !search ||
      v.productName.toLowerCase().includes(search.toLowerCase()) ||
      v.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Inventory</h2>
        <p className="text-sm text-gray-500 mt-1">Manage stock levels per variant SKU.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search products or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-[#007791] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-[#F7F7F7]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Size</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Price</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Stock</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {allVariants.map((v) => {
              const isLow = v.isAvailable && v.stock > 0 && v.stock <= 5;
              const isOut = !v.isAvailable || v.stock === 0;
              return (
                <tr key={v.sku} className="hover:bg-[#F7F7F7]/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#1A1A1A]">{v.productName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{v.sku}</td>
                  <td className="px-4 py-3 text-gray-600">{v.size ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{v.price}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {isLow && <ExclamationTriangleIcon className="h-3.5 w-3.5 text-amber-500" />}
                      <span className={isLow ? "font-bold text-amber-600" : isOut ? "text-red-500" : "text-gray-700"}>
                        {v.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isOut
                          ? "bg-red-100 text-red-700"
                          : isLow
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="border-t px-4 py-3 text-xs text-gray-400">
          {allVariants.length} variant SKUs
        </div>
      </div>
    </div>
  );
}
