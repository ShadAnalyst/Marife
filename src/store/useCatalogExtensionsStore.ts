import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MockProduct } from "@/lib/mockData";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export interface CustomCategoryRow {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  count: number;
}

export interface CategoryDisplayPatch {
  name?: string;
  imageUrl?: string;
}

interface CatalogExtensionsState {
  customProducts: MockProduct[];
  customCategories: CustomCategoryRow[];
  /** Built-in or overridden products removed from the storefront */
  deletedProductIds: string[];
  /** Full product snapshots when editing catalog products (by product id) */
  productOverrides: Record<string, MockProduct>;
  /** Built-in category slugs hidden from nav / homepage */
  hiddenCategorySlugs: string[];
  /** Display overrides for built-in categories (name / image) */
  categoryDisplayOverrides: Record<string, CategoryDisplayPatch>;

  addProduct: (product: MockProduct) => void;
  upsertProduct: (product: MockProduct) => void;
  deleteProduct: (id: string) => void;
  addCategory: (input: { name: string; slug: string; imageUrl: string; count?: number }) => void;
  updateCustomCategory: (slug: string, input: { name: string; slug: string; imageUrl: string }) => void;
  removeCustomCategory: (slug: string) => void;
  setCategoryDisplayOverride: (slug: string, patch: CategoryDisplayPatch) => void;
  hideCategory: (slug: string) => void;
  unhideCategory: (slug: string) => void;
  deleteProductsInCategory: (categorySlug: string) => void;
  /** Remove category from nav and delete / hide all its products */
  deleteCategoryWithProducts: (slug: string) => void;
}

export const useCatalogExtensionsStore = create<CatalogExtensionsState>()(
  persist(
    (set, get) => ({
      customProducts: [],
      customCategories: [],
      deletedProductIds: [],
      productOverrides: {},
      hiddenCategorySlugs: [],
      categoryDisplayOverrides: {},

      addProduct: (product) => {
        set((s) => ({
          customProducts: [...s.customProducts.filter((p) => p.slug !== product.slug), product],
        }));
      },

      upsertProduct: (product) => {
        set((s) => {
          const isCustom = s.customProducts.some((p) => p.id === product.id);
          if (isCustom) {
            return {
              customProducts: s.customProducts.map((p) => (p.id === product.id ? product : p)),
            };
          }
          return {
            productOverrides: { ...s.productOverrides, [product.id]: product },
          };
        });
      },

      deleteProduct: (id) => {
        set((s) => {
          const next: Partial<CatalogExtensionsState> = {
            deletedProductIds: s.deletedProductIds.includes(id)
              ? s.deletedProductIds
              : [...s.deletedProductIds, id],
          };
          const { [id]: _, ...restOverrides } = s.productOverrides;
          next.productOverrides = restOverrides;
          if (s.customProducts.some((p) => p.id === id)) {
            next.customProducts = s.customProducts.filter((p) => p.id !== id);
          }
          return next as CatalogExtensionsState;
        });
      },

      addCategory: ({ name, slug, imageUrl, count = 0 }) => {
        const normalized = slug.trim().toLowerCase().replace(/\s+/g, "-");
        set((s) => {
          const withoutDup = s.customCategories.filter((c) => c.slug !== normalized);
          return {
            customCategories: [
              ...withoutDup,
              {
                id: Date.now(),
                name: name.trim(),
                slug: normalized,
                imageUrl: imageUrl.trim() || "https://marife.ch/media/a8/24/5d/1730145129/o_n20097_44_44_1_141.jpg",
                count,
              },
            ],
          };
        });
      },

      updateCustomCategory: (slug, input) => {
        const nextSlug = input.slug.trim().toLowerCase().replace(/\s+/g, "-");
        set((s) => {
          const cat = s.customCategories.find((c) => c.slug === slug);
          if (!cat) return s;
          const others = s.customCategories.filter((c) => c.slug !== slug);
          const updated: CustomCategoryRow = {
            ...cat,
            name: input.name.trim(),
            slug: nextSlug,
            imageUrl: input.imageUrl.trim() || cat.imageUrl,
          };
          let customProducts = s.customProducts;
          if (nextSlug !== slug) {
            customProducts = customProducts.map((p) =>
              p.category === slug ? { ...p, category: nextSlug } : p
            );
          }
          return {
            customCategories: [...others.filter((c) => c.slug !== nextSlug), updated].sort((a, b) =>
              a.name.localeCompare(b.name)
            ),
            customProducts,
          };
        });
      },

      removeCustomCategory: (slug) => {
        set((s) => ({
          customCategories: s.customCategories.filter((c) => c.slug !== slug),
        }));
      },

      setCategoryDisplayOverride: (slug, patch) => {
        set((s) => ({
          categoryDisplayOverrides: {
            ...s.categoryDisplayOverrides,
            [slug]: { ...s.categoryDisplayOverrides[slug], ...patch },
          },
        }));
      },

      hideCategory: (slug) => {
        set((s) => ({
          hiddenCategorySlugs: s.hiddenCategorySlugs.includes(slug)
            ? s.hiddenCategorySlugs
            : [...s.hiddenCategorySlugs, slug],
        }));
      },

      unhideCategory: (slug) => {
        set((s) => ({
          hiddenCategorySlugs: s.hiddenCategorySlugs.filter((x) => x !== slug),
        }));
      },

      deleteProductsInCategory: (categorySlug) => {
        const ids = new Set<string>();
        for (const p of MOCK_PRODUCTS) {
          if (p.category === categorySlug) ids.add(p.id);
        }
        for (const p of get().customProducts) {
          if (p.category === categorySlug) ids.add(p.id);
        }
        set((s) => ({
          deletedProductIds: [...new Set([...s.deletedProductIds, ...ids])],
          customProducts: s.customProducts.filter((p) => p.category !== categorySlug),
        }));
      },

      deleteCategoryWithProducts: (slug) => {
        set((s) => {
          const isCustom = s.customCategories.some((c) => c.slug === slug);
          const ids = new Set<string>();
          for (const p of MOCK_PRODUCTS) {
            if (p.category === slug) ids.add(p.id);
          }
          for (const p of s.customProducts) {
            if (p.category === slug) ids.add(p.id);
          }
          const restCatO = Object.fromEntries(
            Object.entries(s.categoryDisplayOverrides).filter(([k]) => k !== slug)
          );
          return {
            deletedProductIds: [...new Set([...s.deletedProductIds, ...ids])],
            customProducts: s.customProducts.filter((p) => p.category !== slug),
            customCategories: isCustom ? s.customCategories.filter((c) => c.slug !== slug) : s.customCategories,
            hiddenCategorySlugs: isCustom
              ? s.hiddenCategorySlugs
              : [...new Set([...s.hiddenCategorySlugs, slug])],
            categoryDisplayOverrides: isCustom ? s.categoryDisplayOverrides : restCatO,
          };
        });
      },
    }),
    {
      name: "marife-catalog-extensions",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        customProducts: s.customProducts,
        customCategories: s.customCategories,
        deletedProductIds: s.deletedProductIds,
        productOverrides: s.productOverrides,
        hiddenCategorySlugs: s.hiddenCategorySlugs,
        categoryDisplayOverrides: s.categoryDisplayOverrides,
      }),
    }
  )
);

export function resolveProductFromStore(
  id: string,
  customProducts: MockProduct[],
  overrides: Record<string, MockProduct>
): MockProduct | undefined {
  const fromCustom = customProducts.find((p) => p.id === id);
  if (fromCustom) return { ...fromCustom, ...overrides[id], id: fromCustom.id };
  const base = MOCK_PRODUCTS.find((p) => p.id === id);
  if (base) return { ...base, ...overrides[id] };
  return overrides[id];
}
