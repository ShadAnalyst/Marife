import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types";
import { calculateTotal } from "@/lib/utils";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  itemCount: () => number;
  subtotal: () => number;
  totals: () => { subtotal: number; shipping: number; tax: number; total: number };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.variantId === newItem.variantId
          );
          if (existingIndex >= 0) {
            const items = [...state.items];
            const existing = items[existingIndex];
            items[existingIndex] = {
              ...existing,
              quantity: Math.min(existing.quantity + newItem.quantity, existing.maxStock),
            };
            return { items, isOpen: true };
          }
          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.maxStock) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      totals: () => calculateTotal(get().subtotal()),
    }),
    {
      name: "marife-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
