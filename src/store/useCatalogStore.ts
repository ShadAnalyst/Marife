import { create } from "zustand";
import { getMockCatalogResponse } from "@/lib/catalog-fallback";
import type { MockProduct } from "@/lib/mockData";
import type { MergedCategory } from "@/lib/catalog-types";

type CatalogSource = "database" | "mock" | "idle";

interface CatalogState {
  categories: MergedCategory[];
  products: MockProduct[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  source: CatalogSource;
  load: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  categories: [],
  products: [],
  loading: false,
  loaded: false,
  error: null,
  source: "idle",

  load: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const r = await fetch("/api/catalog", { cache: "no-store" });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      set({
        categories: data.categories ?? [],
        products: data.products ?? [],
        loaded: true,
        loading: false,
        source: data.source === "database" ? "database" : "mock",
      });
    } catch (e) {
      const fb = getMockCatalogResponse();
      set({
        categories: fb.categories,
        products: fb.products,
        error: e instanceof Error ? e.message : "Failed to load catalog",
        loaded: true,
        loading: false,
        source: "mock",
      });
    }
  },

  refresh: async () => {
    set({ loaded: false });
    await get().load();
  },
}));
