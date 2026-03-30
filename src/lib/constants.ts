export const VAT_RATE = 0.081;
export const FLAT_SHIPPING_RATE = 5.0;
export const FREE_SHIPPING_THRESHOLD = 75.0;
export const LOW_STOCK_THRESHOLD = 5;

export const CATEGORIES = [
  { name: "Fashion", slug: "fashion", href: "/category/fashion" },
  { name: "Dessous", slug: "dessous", href: "/category/dessous" },
  { name: "Korsetts & Corsagen", slug: "korsetts", href: "/category/korsetts" },
  { name: "Africanstyle", slug: "africanstyle", href: "/category/africanstyle" },
  { name: "Lifestyle", slug: "lifestyle", href: "/category/lifestyle" },
  { name: "Gothic / Costumes", slug: "gothic-costumes", href: "/category/gothic-costumes" },
  { name: "Sale / Outlet", slug: "sale", href: "/category/sale" },
  { name: "Auslaufmodelle", slug: "auslaufmodelle", href: "/category/auslaufmodelle" },
  { name: "Isabelle", slug: "isabelle", href: "/category/isabelle" },
] as const;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"] as const;

export const ORDER_STATUSES = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
} as const;

export const PAYMENT_METHODS = [
  { id: "twint", name: "TWINT", icon: "/icons/twint.svg" },
  { id: "paypal", name: "PayPal", icon: "/icons/paypal.svg" },
  { id: "card", name: "Credit / Debit Card", icon: "/icons/card.svg" },
] as const;
