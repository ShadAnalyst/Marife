import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  total: string;
  status: string;
  date: string;
  items: number;
}

const DEFAULT_ORDERS: AdminOrder[] = [
  { id: "MRF-001A2B", customer: "Anna M.", email: "anna.m@example.com", total: "CHF 89.95", status: "Processing", date: "30.03.2026 14:22", items: 2 },
  { id: "MRF-002C3D", customer: "Maria K.", email: "maria.k@example.com", total: "CHF 134.90", status: "Shipped", date: "30.03.2026 11:05", items: 3 },
  { id: "MRF-003E4F", customer: "Guest User", email: "guest@example.com", total: "CHF 49.95", status: "Delivered", date: "29.03.2026 09:18", items: 1 },
  { id: "MRF-004G5H", customer: "Laura B.", email: "laura.b@example.com", total: "CHF 219.85", status: "Processing", date: "29.03.2026 17:44", items: 4 },
  { id: "MRF-005I6J", customer: "Sophie W.", email: "sophie.w@example.com", total: "CHF 74.90", status: "Pending", date: "28.03.2026 08:30", items: 1 },
  { id: "MRF-006K7L", customer: "Fatou D.", email: "fatou.d@example.com", total: "CHF 159.80", status: "Delivered", date: "27.03.2026 13:55", items: 3 },
  { id: "MRF-007M8N", customer: "Zara T.", email: "zara.t@example.com", total: "CHF 44.95", status: "Cancelled", date: "26.03.2026 10:10", items: 1 },
];

interface AdminOrdersState {
  orders: AdminOrder[];
  updateOrder: (id: string, patch: Partial<Omit<AdminOrder, "id">>) => void;
  deleteOrder: (id: string) => void;
}

export const useAdminOrdersStore = create<AdminOrdersState>()(
  persist(
    (set) => ({
      orders: DEFAULT_ORDERS,

      updateOrder: (id, patch) => {
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
        }));
      },

      deleteOrder: (id) => {
        set((s) => ({
          orders: s.orders.filter((o) => o.id !== id),
        }));
      },
    }),
    {
      name: "marife-admin-orders",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
