export interface ProductImage {
  id: string;
  urlMain: string;
  urlThumbnail: string;
  urlZoom?: string | null;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  variantName: string;
  sizeValue?: string | null;
  colorValue?: string | null;
  priceModifier?: number | null;
  currentStock: number;
  lowStockThreshold: number;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  skuPrefix: string;
  name: string;
  slug: string;
  descriptionShort?: string | null;
  descriptionLong?: string | null;
  basePrice: number;
  isActive: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  defaultImageId?: string | null;
}

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  sizeValue?: string | null;
  colorValue?: string | null;
  maxStock: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  street2?: string;
  zipCode: string;
  city: string;
  countryCode: string;
}

export interface CheckoutState {
  step: 1 | 2 | 3;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  orderId?: string;
}

export interface FilterState {
  sizes: string[];
  colors: string[];
  priceMin?: number;
  priceMax?: number;
  themes: string[];
  sortBy: "newest" | "price_asc" | "price_desc" | "popularity";
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  imageUrl?: string | null;
}
