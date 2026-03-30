"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBagIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/useCartStore";
import { formatCHF } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { isDataImageUrl } from "@/lib/imageUpload";
import { ProductGrid } from "./ProductGrid";
import toast from "react-hot-toast";
import type { ProductVariant } from "@/types";

interface PDPProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  descriptionShort: string;
  images: Array<{ urlMain: string; urlThumbnail: string; urlZoom?: string | null }>;
  variants: ProductVariant[];
}

interface PDPClientProps {
  product: PDPProduct;
  relatedProducts: any[];
  /** Category slug for shop breadcrumb */
  categorySlug?: string;
}

function StockIndicator({ variant }: { variant: ProductVariant | null }) {
  if (!variant) return null;
  if (!variant.isAvailable || variant.currentStock === 0) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-red-500">
        <XCircleIcon className="h-4 w-4" />
        Out of stock
      </div>
    );
  }
  if (variant.currentStock <= 5) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-amber-500 font-medium">
        <ExclamationTriangleIcon className="h-4 w-4" />
        Only {variant.currentStock} left!
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-sm text-green-600">
      <CheckCircleIcon className="h-4 w-4" />
      In stock
    </div>
  );
}

export function PDPClient({ product, relatedProducts, categorySlug }: PDPClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const isOnSale = product.salePrice && product.salePrice < product.basePrice;
  const displayPrice = product.salePrice ?? product.basePrice;

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) ?? null;
  const uniqueSizes = Array.from(
    new Map(product.variants.filter((v) => v.sizeValue).map((v) => [v.sizeValue, v])).values()
  );

  const handleAddToCart = () => {
    if (!selectedVariantId) {
      toast.error("Please select a size first");
      return;
    }
    const variant = product.variants.find((v) => v.id === selectedVariantId);
    if (!variant) return;
    setIsAdding(true);
    setTimeout(() => {
      addItem({
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        variantName: variant.variantName,
        price: displayPrice + (variant.priceModifier ?? 0),
        quantity,
        image: product.images[0]?.urlThumbnail || product.images[0]?.urlMain || "",
        slug: product.slug,
        sizeValue: variant.sizeValue,
        colorValue: variant.colorValue,
        maxStock: variant.currentStock,
      });
      setIsAdding(false);
      toast.success(`${product.name} added to bag!`);
    }, 500);
  };

  const prevImage = () =>
    setSelectedImageIndex((i) => (i - 1 + product.images.length) % product.images.length);
  const nextImage = () =>
    setSelectedImageIndex((i) => (i + 1) % product.images.length);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-gray-400 flex items-center gap-1">
          <Link href="/" className="hover:text-[#E01F54]">Home</Link>
          <span>/</span>
          <Link
            href={categorySlug ? `/category/${categorySlug}` : "/"}
            className="hover:text-[#E01F54]"
          >
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Main PDP layout */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* --- Left: Image Gallery --- */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#F7F7F7] group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[selectedImageIndex]?.urlMain || "/placeholder-product.jpg"}
                    alt={`${product.name} - image ${selectedImageIndex + 1}`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized={isDataImageUrl(product.images[selectedImageIndex]?.urlMain)}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Sale badge */}
              {isOnSale && (
                <span className="absolute top-3 left-3 rounded bg-[#E01F54] px-2.5 py-1 text-xs font-bold text-white uppercase">
                  Sale
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={cn(
                      "relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      i === selectedImageIndex
                        ? "border-[#E01F54]"
                        : "border-transparent hover:border-gray-300"
                    )}
                  >
                    <Image
                      src={img.urlThumbnail || img.urlMain}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized={isDataImageUrl(img.urlThumbnail || img.urlMain)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- Right: Product Info --- */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-[#1A1A1A] leading-tight sm:text-3xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#1A1A1A]">
                {formatCHF(displayPrice)}
              </span>
              {isOnSale && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatCHF(product.basePrice)}
                  </span>
                  <span className="rounded bg-[#E01F54]/10 px-2 py-0.5 text-sm font-bold text-[#E01F54]">
                    Save {formatCHF(product.basePrice - displayPrice)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-400">incl. 8.1% VAT</p>

            {/* Short description */}
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              {product.descriptionShort}
            </p>

            {/* Size selector */}
            {uniqueSizes.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-[#1A1A1A]">Size</h3>
                  <Link href="/size-guide" className="text-xs text-[#007791] hover:underline">
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueSizes.map((variant) => {
                    const outOfStock = !variant.isAvailable || variant.currentStock === 0;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => !outOfStock && setSelectedVariantId(variant.id)}
                        disabled={outOfStock}
                        className={cn(
                          "relative min-w-[3rem] rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all",
                          selectedVariantId === variant.id
                            ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                            : outOfStock
                            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "border-gray-200 text-[#1A1A1A] hover:border-[#1A1A1A]"
                        )}
                      >
                        {variant.sizeValue}
                        {outOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="absolute w-full h-px bg-gray-300 rotate-45" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2">
                  <StockIndicator variant={selectedVariant} />
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">Quantity</h3>
              <div className="inline-flex items-center rounded-lg border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 flex items-center justify-center hover:bg-[#F7F7F7] rounded-l-lg transition-colors text-lg"
                >
                  −
                </button>
                <span className="h-10 w-12 flex items-center justify-center border-x border-gray-200 text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(quantity + 1, selectedVariant?.currentStock ?? 10))
                  }
                  className="h-10 w-10 flex items-center justify-center hover:bg-[#F7F7F7] rounded-r-lg transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons — sticky on mobile */}
            <div className="mt-6 space-y-3 sticky bottom-0 bg-white pb-4 pt-2 md:static md:bg-transparent md:pb-0 md:pt-0 border-t md:border-0 -mx-4 px-4 md:mx-0 md:px-0">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E01F54] py-4 text-sm font-bold text-white hover:bg-[#c01a48] active:scale-[0.98] transition-all disabled:opacity-70"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                {isAdding ? "Adding to Bag…" : "Add to Bag"}
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 py-3.5 text-sm font-bold text-[#1A1A1A] hover:border-[#1A1A1A] transition-all">
                <HeartIcon className="h-4 w-4" />
                Save to Wishlist
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-gray-500">
              {[
                ["🚀", "Fast Swiss delivery"],
                ["🔒", "Secure checkout"],
                ["↩️", "30-day returns"],
                ["💳", "TWINT & PayPal"],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-1.5">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Description accordion */}
            <div className="mt-6 border-t pt-4 space-y-3">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-[#1A1A1A] py-1 select-none">
                  Product Details
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed pb-2">
                  {product.descriptionShort}
                </p>
              </details>
              <details className="group border-t pt-3">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-[#1A1A1A] py-1 select-none">
                  Shipping & Returns
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="mt-2 text-sm text-gray-600 space-y-1 pb-2">
                  <p>✓ Free shipping on orders over CHF 75</p>
                  <p>✓ Standard delivery: CHF 5 (2–4 business days)</p>
                  <p>✓ Free returns within 30 days</p>
                  <p>✓ Delivered in discreet packaging</p>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">You Might Also Like</h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </section>
        )}
      </div>
    </div>
  );
}
