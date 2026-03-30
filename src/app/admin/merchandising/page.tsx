"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { useMergedCategories } from "@/lib/useMergedCatalog";
import { useCatalogStore } from "@/store/useCatalogStore";
import { CategoryProductsAdmin } from "@/components/admin/CategoryProductsAdmin";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const homepageSlots = [
  { slot: "Hero Banner", type: "Image + CTA", status: "Active", description: "Full-screen hero with category highlight" },
  { slot: "Featured Section", type: "Product Grid", status: "Active", description: "4 hand-picked featured products" },
  { slot: "Category Highlights", type: "Category Grid", status: "Active", description: "Scroll-expand sections per category" },
  { slot: "Promotional Banner", type: "Text Banner", status: "Inactive", description: "Seasonal promo strip" },
];

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isBuiltInCategory(slug: string) {
  return MOCK_CATEGORIES.some((c) => c.slug === slug);
}

export default function MerchandisingPage() {
  const merged = useMergedCategories();
  const refresh = useCatalogStore((s) => s.refresh);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState<{
    slug: string;
    builtIn: boolean;
    name: string;
    catSlug: string;
    imageUrl: string;
  } | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [manualSlug, setManualSlug] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!manualSlug) setSlug(slugify(name));
  }, [name, manualSlug]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const s = slug.trim();
    if (!n || !s) {
      toast.error("Name and slug are required");
      return;
    }
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: n,
          slug: s,
          imageUrl:
            imageUrl.trim() ||
            "https://marife.ch/media/a8/24/5d/1730145129/o_n20097_44_44_1_141.jpg",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      await refresh();
      toast.success("Category added");
      setName("");
      setSlug("");
      setManualSlug(false);
      setImageUrl("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const openEdit = (cat: { slug: string; name: string; imageUrl: string }) => {
    const builtIn = isBuiltInCategory(cat.slug);
    setEditOpen({
      slug: cat.slug,
      builtIn,
      name: cat.name,
      catSlug: cat.slug,
      imageUrl: cat.imageUrl,
    });
  };

  const saveEdit = async () => {
    if (!editOpen) return;
    const n = editOpen.name.trim();
    const s = editOpen.catSlug.trim().toLowerCase().replace(/\s+/g, "-");
    const img = editOpen.imageUrl.trim();
    if (!n || !img) {
      toast.error("Name and image are required");
      return;
    }
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(editOpen.slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editOpen.builtIn
            ? { name: n, imageUrl: img }
            : { name: n, slug: s, imageUrl: img }
        ),
      });
      if (!res.ok) throw new Error(await res.text());
      await refresh();
      toast.success("Category saved");
      setEditOpen(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const removeCategory = async (cat: { slug: string; name: string; imageUrl: string }) => {
    const builtIn = isBuiltInCategory(cat.slug);
    const msg = builtIn
      ? `Hide category “${cat.name}” and deactivate all its products?`
      : `Delete category “${cat.name}” and its products?`;
    if (!window.confirm(msg)) return;
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(cat.slug)}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      await refresh();
      toast.success(builtIn ? "Category hidden and products deactivated" : "Category removed");
      if (expanded === cat.slug) setExpanded(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Merchandising</h2>
        <p className="text-sm text-gray-500 mt-1">Categories, homepage slots, and product merchandising.</p>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-[#1A1A1A] mb-4">Add category</h3>
        <form onSubmit={handleAddCategory} className="grid gap-4 max-w-2xl">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Slug (URL)</label>
            <input
              value={slug}
              onChange={(e) => {
                setManualSlug(true);
                setSlug(e.target.value);
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
            />
          </div>
          <ImageUploadField
            label="Category image"
            description="Upload a banner image or paste a URL."
            value={imageUrl}
            onChange={setImageUrl}
          />
          <button
            type="submit"
            className="rounded-full bg-[#E01F54] px-6 py-2 text-sm font-semibold text-white hover:bg-[#c01843] w-fit"
          >
            Add category
          </button>
        </form>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-bold text-[#1A1A1A]">Homepage Slots</h3>
          <button
            type="button"
            className="rounded-full bg-[#E01F54] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#c01843] transition-colors"
          >
            Save Changes
          </button>
        </div>
        <div className="divide-y">
          {homepageSlots.map((slot) => (
            <div key={slot.slot} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-semibold text-[#1A1A1A]">{slot.slot}</p>
                <p className="text-xs text-gray-400 mt-0.5">{slot.description}</p>
                <p className="text-xs text-gray-400">Type: {slot.type}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    slot.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {slot.status}
                </span>
                <button type="button" className="text-[#007791] text-xs font-semibold hover:underline">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-bold text-[#1A1A1A]">Categories &amp; products</h3>
          <Link
            href="/admin/products/new"
            className="rounded-full border-2 border-[#007791] px-4 py-1.5 text-xs font-semibold text-[#007791] hover:bg-[#007791] hover:text-white transition-colors"
          >
            Add product
          </Link>
        </div>
        <div className="divide-y">
          {merged.map((cat, i) => (
            <div key={cat.slug} className="bg-white">
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => (e === cat.slug ? null : cat.slug))}
                    className="text-gray-400 hover:text-[#1A1A1A] w-6"
                    aria-expanded={expanded === cat.slug}
                  >
                    {expanded === cat.slug ? "▼" : "▶"}
                  </button>
                  <span className="text-gray-300 font-mono text-sm w-6">{String(i + 1).padStart(2, "0")}</span>
                  <div
                    className="h-8 w-8 rounded-lg bg-cover bg-center bg-gray-100 flex-shrink-0"
                    style={{ backgroundImage: `url(${cat.imageUrl})` }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-[#1A1A1A] truncate">{cat.name}</p>
                    <p className="text-xs text-gray-400 font-mono truncate">/{cat.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-400">{cat.count} products</span>
                  <button
                    type="button"
                    onClick={() => openEdit(cat)}
                    className="text-[#007791] text-xs font-semibold hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="text-[#E01F54] text-xs font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {expanded === cat.slug && <CategoryProductsAdmin categorySlug={cat.slug} />}
            </div>
          ))}
        </div>
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1A1A1A]">
                {editOpen.builtIn ? "Edit category" : "Edit custom category"}
              </h3>
              <button type="button" onClick={() => setEditOpen(null)} className="text-gray-400 hover:text-[#1A1A1A] text-xl leading-none">
                ×
              </button>
            </div>
            {editOpen.builtIn && (
              <p className="text-xs text-gray-500">
                Slug is fixed for built-in categories. You can change the display name and image only.
              </p>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Display name</label>
                <input
                  value={editOpen.name}
                  onChange={(e) => setEditOpen((o) => (o ? { ...o, name: e.target.value } : o))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              {!editOpen.builtIn && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Slug</label>
                  <input
                    value={editOpen.catSlug}
                    onChange={(e) => setEditOpen((o) => (o ? { ...o, catSlug: e.target.value } : o))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
                  />
                </div>
              )}
              <ImageUploadField
                label="Category image"
                description="Upload or paste a URL."
                value={editOpen.imageUrl}
                onChange={(v) => setEditOpen((o) => (o ? { ...o, imageUrl: v } : o))}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => void saveEdit()}
                className="flex-1 rounded-full bg-[#E01F54] py-2.5 text-sm font-semibold text-white hover:bg-[#c01843]"
              >
                Save
              </button>
              <button type="button" onClick={() => setEditOpen(null)} className="rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
