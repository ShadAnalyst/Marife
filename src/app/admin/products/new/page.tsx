"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { makeVariants, type MockProduct } from "@/lib/mockData";
import { useMergedCategories, useMergedProducts } from "@/lib/useMergedCatalog";
import { useCatalogStore } from "@/store/useCatalogStore";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewProductPage() {
  const router = useRouter();
  const mergedCategories = useMergedCategories();
  const mergedProducts = useMergedProducts();
  const refresh = useCatalogStore((s) => s.refresh);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [manualSlug, setManualSlug] = useState(false);
  const [categorySlug, setCategorySlug] = useState("fashion");
  const [basePrice, setBasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [descriptionShort, setDescriptionShort] = useState("");
  const [sizes, setSizes] = useState("S, M, L, XL");

  useEffect(() => {
    if (!manualSlug) setSlug(slugify(name));
  }, [name, manualSlug]);

  useEffect(() => {
    if (mergedCategories.some((c) => c.slug === categorySlug)) return;
    const first = mergedCategories[0]?.slug;
    if (first) setCategorySlug(first);
  }, [mergedCategories, categorySlug]);

  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of mergedCategories) map.set(c.slug, c.name);
    return Array.from(map.entries());
  }, [mergedCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = slug.trim();
    if (!name.trim() || !s) {
      toast.error("Name and slug are required");
      return;
    }
    const price = parseFloat(basePrice.replace(",", "."));
    if (Number.isNaN(price) || price < 0) {
      toast.error("Enter a valid base price");
      return;
    }
    const sale = salePrice.trim() ? parseFloat(salePrice.replace(",", ".")) : undefined;
    if (sale !== undefined && (Number.isNaN(sale) || sale < 0)) {
      toast.error("Invalid sale price");
      return;
    }
    const taken = mergedProducts.some((p) => p.slug === s);
    if (taken) {
      toast.error("A product with this slug already exists");
      return;
    }

    const sizeList = sizes.split(",").map((x) => x.trim()).filter(Boolean);
    if (sizeList.length === 0) {
      toast.error("Add at least one size (comma-separated)");
      return;
    }

    const sku = `ADM-${Date.now().toString(36).toUpperCase()}`;
    const img =
      imageUrl.trim() ||
      "https://marife.ch/media/a8/24/5d/1730145129/o_n20097_44_44_1_141.jpg";
    const product: MockProduct = {
      id: `custom-${Date.now()}`,
      skuPrefix: sku,
      name: name.trim(),
      slug: s,
      descriptionShort: descriptionShort.trim() || name.trim(),
      descriptionLong: descriptionShort.trim() || name.trim(),
      basePrice: price,
      salePrice: sale !== undefined && sale < price ? sale : undefined,
      isActive: true,
      category: categorySlug,
      tags: ["custom"],
      images: [
        {
          id: `${sku}-img`,
          urlMain: img,
          urlThumbnail: img,
          urlZoom: null,
          sortOrder: 0,
        },
      ],
      variants: makeVariants(sku, sizeList),
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, categorySlug }),
      });
      if (!res.ok) throw new Error(await res.text());
      await refresh();
      toast.success("Product saved");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Add product</h2>
          <p className="text-sm text-gray-500 mt-1">Saved to the shared database (visible on all devices).</p>
        </div>
        <Link href="/admin/products" className="text-sm font-semibold text-[#007791] hover:underline">
          ← Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl bg-white shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="Product name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">URL slug</label>
          <input
            value={slug}
            onChange={(e) => {
              setManualSlug(true);
              setSlug(e.target.value);
            }}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
            placeholder="auto-from-name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Category</label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            {categoryOptions.map(([slugVal, label]) => (
              <option key={slugVal} value={slugVal}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Base price (CHF)</label>
            <input
              required
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="49.90"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Sale price (optional)</label>
            <input
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="39.90"
            />
          </div>
        </div>
        <ImageUploadField
          label="Product image"
          description="Upload a photo or paste an image URL."
          value={imageUrl}
          onChange={setImageUrl}
        />
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Short description</label>
          <textarea
            value={descriptionShort}
            onChange={(e) => setDescriptionShort(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Sizes (comma-separated)</label>
          <input
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-[#E01F54] py-2.5 text-sm font-semibold text-white hover:bg-[#c01843] transition-colors"
        >
          Save product
        </button>
      </form>
    </div>
  );
}
