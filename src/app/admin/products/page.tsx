"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useMergedProducts } from "@/lib/useMergedCatalog";
import { useCatalogExtensionsStore } from "@/store/useCatalogExtensionsStore";

const categoryLabel: Record<string, string> = {
  fashion: "Fashion",
  dessous: "Dessous",
  korsetts: "Korsetts & Corsagen",
  africanstyle: "Africanstyle",
  lifestyle: "Lifestyle",
  "gothic-costumes": "Gothic / Costumes",
  sale: "Sale / Outlet",
  auslaufmodelle: "Auslaufmodelle",
  isabelle: "Isabelle",
};

export default function ProductsPage() {
  const products = useMergedProducts();
  const deleteProduct = useCatalogExtensionsStore((s) => s.deleteProduct);

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete “${name}” from the catalog? This browser only.`)) return;
    deleteProduct(id);
    toast.success("Product removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Products</h2>
          <p className="text-sm text-gray-500 mt-1">{products.length} products in catalog</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/import"
            className="rounded-full border-2 border-[#007791] px-5 py-2 text-sm font-semibold text-[#007791] hover:bg-[#007791] hover:text-white transition-colors"
          >
            Bulk Import
          </Link>
          <Link
            href="/admin/products/new"
            className="rounded-full bg-[#E01F54] px-5 py-2 text-sm font-semibold text-white hover:bg-[#c01843] transition-colors"
          >
            + Add Product
          </Link>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F7F7] text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Product</th>
                <th className="px-5 py-3 text-left font-semibold">Category</th>
                <th className="px-5 py-3 text-left font-semibold">Price</th>
                <th className="px-5 py-3 text-left font-semibold">Variants</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => {
                const isLowStock = product.variants.some(
                  (v) => v.isAvailable && v.currentStock <= 5 && v.currentStock > 0
                );
                const isCustom = product.id.startsWith("custom-");
                return (
                  <tr key={product.id} className="hover:bg-[#F7F7F7] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0].urlThumbnail}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-[#1A1A1A] line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.skuPrefix}</p>
                          {isCustom && (
                            <span className="text-[10px] font-bold text-[#007791] uppercase">Added locally</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {categoryLabel[product.category] ?? product.category}
                    </td>
                    <td className="px-5 py-4">
                      {product.salePrice ? (
                        <div>
                          <p className="font-bold text-[#E01F54]">CHF {product.salePrice.toFixed(2)}</p>
                          <p className="text-xs line-through text-gray-400">CHF {product.basePrice.toFixed(2)}</p>
                        </div>
                      ) : (
                        <p className="font-semibold text-[#1A1A1A]">CHF {product.basePrice.toFixed(2)}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{product.variants.length} sizes</td>
                    <td className="px-5 py-4">
                      {product.isActive ? (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            isLowStock ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isLowStock ? "Low Stock" : "Active"}
                        </span>
                      ) : (
                        <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-gray-100 text-gray-500">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/products/${encodeURIComponent(product.id)}/edit`}
                          className="text-[#007791] text-xs font-semibold hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-[#E01F54] text-xs font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
