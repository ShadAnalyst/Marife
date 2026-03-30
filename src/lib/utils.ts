import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCHF(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `CHF ${num.toFixed(2)}`;
}

export function calculateVAT(subtotal: number, vatRate = 0.081): number {
  return subtotal * vatRate;
}

export function calculateShipping(subtotal: number): number {
  const freeThreshold = parseFloat(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "75");
  const flatRate = parseFloat(process.env.NEXT_PUBLIC_SHIPPING_FLAT_RATE || "5");
  return subtotal >= freeThreshold ? 0 : flatRate;
}

export function calculateTotal(subtotal: number): {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
} {
  const shipping = calculateShipping(subtotal);
  const taxableAmount = subtotal + shipping;
  const tax = calculateVAT(taxableAmount);
  return {
    subtotal,
    shipping,
    tax,
    total: taxableAmount + tax,
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}
