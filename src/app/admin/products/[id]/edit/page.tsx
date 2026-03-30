"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { makeVariants, type MockProduct } from "@/lib/mockData";
import {
  useCatalogExtensionsStore,
  resolveProductFromStore,
} from "@/store/useCatalogExtensionsStore";
import { useMergedProducts } from "@/lib/useMergedCatalog";
import { useMergedCategories } from "@/lib/useMergedCatalog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function EditProductPage() {
  const params = useParams();
  const rawId = params.id as string;
  const id = decodeURIComponent(rawId);
  const router = useRouter();

  const customProducts = useCatalogExtensionsStore((s) => s.customProducts);
  const overrides = useCatalogExtensionsStore((s) => s.productOverrides);
  const upsertProduct = useCatalogExtensionsStore((s) => s.upsertProduct);
  const mergedCategories = useMergedCategories();
  const mergedProducts = useMergedProducts();

  const resolved = useMemo(
    () => resolveProductFromStore(id, customProducts, overrides),
    [id, customProducts, overrides]
  );

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
    if (!resolved) return;
    setName(resolved.name);
    setSlug(resolved.slug);
    setManualSlug(true);
    setCategorySlug(resolved.category);
    setBasePrice(String(resolved.basePrice));
    setSalePrice(resolved.salePrice != null ? String(resolved.salePrice) : "");
    setImageUrl(resolved.images[0]?.urlMain ?? "");
    setDescriptionShort(resolved.descriptionShort);
    setSizes(resolved.variants.map((v) => v.sizeValue).filter(Boolean).join(", "));
  }, [resolved]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolved) return;
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

    const slugTaken = mergedProducts.some((p) => p.slug === s && p.id !== resolved.id);
    if (slugTaken) {
      toast.error("Another product already uses this slug");
      return;
    }

    const sizeList = sizes.split(",").map((x) => x.trim()).filter(Boolean);
    if (sizeList.length === 0) {
      toast.error("Add at least one size (comma-separated)");
      return;
    }

    const sku = resolved.skuPrefix;
    const img = imageUrl.trim() || resolved.images[0]?.urlMain || "";
    const updated: MockProduct = {
      ...resolved,
      name: name.trim(),
      slug: s,
      descriptionShort: descriptionShort.trim() || name.trim(),
      descriptionLong: descriptionShort.trim() || name.trim(),
      basePrice: price,
      salePrice: sale !== undefined && sale < price ? sale : undefined,
      category: categorySlug,
      images: [
        {
          id: resolved.images[0]?.id ?? `${sku}-img`,
          urlMain: img,
          urlThumbnail: img,
          urlZoom: null,
          sortOrder: 0,
        },
      ],
      variants: makeVariants(sku, sizeList),
    };

    upsertProduct(updated);
    toast.success("Product updated");
    router.push("/admin/products");
  };

  if (!resolved) {
    return (
      <div className="space-y-4">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/admin/products" className="text-[#007791] font-semibold text-sm hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Edit product</h2>
          <p className="text-sm text-gray-500 mt-1 font-mono">{resolved.id}</p>
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
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Sale price (optional)</label>
            <input
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <ImageUploadField
          label="Product image"
          description="Upload a new photo or paste an image URL."
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
          Save changes
        </button>
      </form>
    </div>
  );
}
