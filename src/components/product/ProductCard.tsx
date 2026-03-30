"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBagIcon, FireIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/useCartStore";
import { formatCHF } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { isDataImageUrl } from "@/lib/imageUpload";
import toast from "react-hot-toast";
import type { Product, ProductVariant } from "@/types";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice?: number;
    images: Array<{ urlThumbnail: string; urlMain: string }>;
    variants: ProductVariant[];
  };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const thumbnail = product.images[0]?.urlThumbnail || product.images[0]?.urlMain;
  const isOnSale = product.salePrice && product.salePrice < product.basePrice;
  const displayPrice = product.salePrice ?? product.basePrice;

  const uniqueSizes = Array.from(
    new Map(
      product.variants
        .filter((v) => v.sizeValue)
        .map((v) => [v.sizeValue, v])
    ).values()
  );

  const hasLowStock = product.variants.some(
    (v) => v.isAvailable && v.currentStock > 0 && v.currentStock <= 5
  );

  const handleAddToCart = () => {
    if (!selectedVariantId) return;
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
        quantity: 1,
        image: thumbnail || "",
        slug: product.slug,
        sizeValue: variant.sizeValue,
        colorValue: variant.colorValue,
        maxStock: variant.currentStock,
      });
      setIsAdding(false);
      setShowQuickAdd(false);
      setSelectedVariantId(null);
      toast.success("Added to bag!");
    }, 400);
  };

  return (
    <div
      className="group relative flex flex-col bg-white"
      onMouseEnter={() => setShowQuickAdd(true)}
      onMouseLeave={() => {
        setShowQuickAdd(false);
        setSelectedVariantId(null);
      }}
    >
      {/* Image wrapper */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden aspect-[3/4] bg-[#F7F7F7]">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={isDataImageUrl(thumbnail)}
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOnSale && (
            <span className="rounded bg-[#E01F54] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
              Sale
            </span>
          )}
          {hasLowStock && (
            <span className="flex items-center gap-0.5 rounded bg-[#FFC107] px-2 py-0.5 text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wide">
              <FireIcon className="h-2.5 w-2.5" />
              Low Stock
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-3 px-1">
        <Link
          href={`/products/${product.slug}`}
          className="block text-sm font-medium text-[#1A1A1A] hover:text-[#E01F54] transition-colors line-clamp-2 leading-snug"
        >
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-base font-bold text-[#1A1A1A]">
            {formatCHF(displayPrice)}
          </span>
          {isOnSale && (
            <span className="text-sm text-gray-400 line-through">
              {formatCHF(product.basePrice)}
            </span>
          )}
        </div>
      </div>

      {/* Quick Add Overlay */}
      <AnimatePresence>
        {showQuickAdd && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-3 border-t border-gray-100 shadow-lg"
          >
            {uniqueSizes.length > 0 && (
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  {uniqueSizes.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      disabled={!variant.isAvailable || variant.currentStock === 0}
                      className={cn(
                        "rounded px-2.5 py-1 text-xs font-medium border transition-all",
                        selectedVariantId === variant.id
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                          : "border-gray-200 bg-white text-[#1A1A1A] hover:border-[#1A1A1A]",
                        (!variant.isAvailable || variant.currentStock === 0) &&
                          "opacity-30 cursor-not-allowed"
                      )}
                    >
                      {variant.sizeValue}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={uniqueSizes.length > 0 ? handleAddToCart : undefined}
              disabled={uniqueSizes.length > 0 ? (!selectedVariantId || isAdding) : false}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold text-white transition-all",
                !selectedVariantId && uniqueSizes.length > 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#E01F54] hover:bg-[#c01a48]"
              )}
            >
              {isAdding ? (
                "Adding…"
              ) : (
                <>
                  <ShoppingBagIcon className="h-3.5 w-3.5" />
                  {uniqueSizes.length > 0 && !selectedVariantId
                    ? "Select Size"
                    : "Add to Bag"}
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

