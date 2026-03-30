import type { Customer, Order, OrderItem, OrderStatus, ShippingAddress } from "@prisma/client";

export type AdminOrderRow = {
  id: string;
  customer: string;
  email: string;
  total: string;
  status: string;
  date: string;
  items: number;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const LABEL_STATUS: Record<string, OrderStatus> = {
  Pending: "PENDING",
  Processing: "PROCESSING",
  Shipped: "SHIPPED",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED",
};

export function adminStatusToPrisma(label: string): OrderStatus {
  return LABEL_STATUS[label] ?? "PENDING";
}

export function prismaOrderToAdmin(
  order: Order & {
    shippingAddress: ShippingAddress;
    customer: Customer | null;
    items: OrderItem[];
  }
): AdminOrderRow {
  const d = order.orderDate;
  const dateStr = `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return {
    id: order.id,
    customer: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim(),
    email: order.customer?.email ?? "guest@example.com",
    total: `CHF ${Number(order.totalGrandChf).toFixed(2)}`,
    status: STATUS_LABEL[order.status],
    date: dateStr,
    items: order.items.reduce((n, i) => n + i.quantity, 0),
  };
}
