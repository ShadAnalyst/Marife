import { create } from "zustand";
import type { FilterState } from "@/types";

interface FilterStore extends FilterState {
  setSizes: (sizes: string[]) => void;
  setColors: (colors: string[]) => void;
  setPriceRange: (min?: number, max?: number) => void;
  setThemes: (themes: string[]) => void;
  setSortBy: (sort: FilterState["sortBy"]) => void;
  toggleSize: (size: string) => void;
  toggleColor: (color: string) => void;
  toggleTheme: (theme: string) => void;
  clearFilters: () => void;
  activeFilterCount: () => number;
}

const defaultFilters: FilterState = {
  sizes: [],
  colors: [],
  priceMin: undefined,
  priceMax: undefined,
  themes: [],
  sortBy: "newest",
};

export const useFilterStore = create<FilterStore>()((set, get) => ({
  ...defaultFilters,

  setSizes: (sizes) => set({ sizes }),
  setColors: (colors) => set({ colors }),
  setPriceRange: (priceMin, priceMax) => set({ priceMin, priceMax }),
  setThemes: (themes) => set({ themes }),
  setSortBy: (sortBy) => set({ sortBy }),

  toggleSize: (size) =>
    set((s) => ({
      sizes: s.sizes.includes(size)
        ? s.sizes.filter((x) => x !== size)
        : [...s.sizes, size],
    })),

  toggleColor: (color) =>
    set((s) => ({
      colors: s.colors.includes(color)
        ? s.colors.filter((x) => x !== color)
        : [...s.colors, color],
    })),

  toggleTheme: (theme) =>
    set((s) => ({
      themes: s.themes.includes(theme)
        ? s.themes.filter((x) => x !== theme)
        : [...s.themes, theme],
    })),

  clearFilters: () => set(defaultFilters),

  activeFilterCount: () => {
    const s = get();
    let count = 0;
    count += s.sizes.length;
    count += s.colors.length;
    count += s.themes.length;
    if (s.priceMin !== undefined || s.priceMax !== undefined) count++;
    return count;
  },
}));
