"use client";

import { useFilterStore } from "@/store/useFilterStore";
import { cn } from "@/lib/utils";
import { SIZES } from "@/lib/constants";

const COLORS = [
  { name: "Black", hex: "#1A1A1A" },
  { name: "Red", hex: "#E01F54" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Blue", hex: "#007791" },
  { name: "Pink", hex: "#FFB6C1" },
  { name: "Purple", hex: "#8B5CF6" },
];

const THEMES = ["Halloween", "Carnival", "Oktoberfest", "Roleplay", "Burlesque", "Sexy", "Gothic"];

const PRICE_RANGES = [
  { label: "Under CHF 30", min: 0, max: 30 },
  { label: "CHF 30–60", min: 30, max: 60 },
  { label: "CHF 60–100", min: 60, max: 100 },
  { label: "Over CHF 100", min: 100, max: undefined },
];

export function FilterSidebar() {
  const {
    sizes, colors, themes, priceMin, priceMax, sortBy,
    toggleSize, toggleColor, toggleTheme, setPriceRange, setSortBy,
    clearFilters, activeFilterCount,
  } = useFilterStore();

  const count = activeFilterCount();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#1A1A1A]">
          Filters {count > 0 && <span className="ml-1 text-[#E01F54]">({count})</span>}
        </h3>
        {count > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-[#E01F54] transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Sort By</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#007791] focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popularity">Most Popular</option>
        </select>
      </div>

      {/* Size */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Size</h4>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "rounded border px-2.5 py-1 text-xs font-medium transition-all",
                sizes.includes(size)
                  ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                  : "border-gray-200 text-[#1A1A1A] hover:border-[#1A1A1A]"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Color</h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              title={color.name}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition-all",
                colors.includes(color.name)
                  ? "border-[#E01F54] scale-110"
                  : "border-gray-200 hover:border-gray-400"
              )}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Price</h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const isActive = priceMin === range.min && priceMax === range.max;
            return (
              <button
                key={range.label}
                onClick={() =>
                  isActive ? setPriceRange(undefined, undefined) : setPriceRange(range.min, range.max)
                }
                className={cn(
                  "flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors",
                  isActive ? "bg-[#F7F7F7] text-[#1A1A1A] font-medium" : "text-gray-600 hover:bg-[#F7F7F7]"
                )}
              >
                <span
                  className={cn(
                    "h-3.5 w-3.5 rounded-full border flex-shrink-0",
                    isActive ? "border-[#E01F54] bg-[#E01F54]" : "border-gray-300"
                  )}
                />
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Themes */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Theme / Occasion</h4>
        <div className="flex flex-wrap gap-1.5">
          {THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => toggleTheme(theme)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                themes.includes(theme)
                  ? "border-[#007791] bg-[#007791] text-white"
                  : "border-gray-200 text-gray-600 hover:border-[#007791]"
              )}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
