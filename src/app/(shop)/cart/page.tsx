"use client";

import Link from "next/link";
import Image from "next/image";
import { isDataImageUrl } from "@/lib/imageUpload";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBagIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/useCartStore";
import { formatCHF } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totals } = useCartStore();
  const t = totals();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-[#1A1A1A] mb-8">Shopping Bag</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
          <ShoppingBagIcon className="h-20 w-20 text-gray-200" />
          <div>
            <p className="text-xl font-bold text-[#1A1A1A]">Your bag is empty</p>
            <p className="text-gray-500 mt-1">Add some bold pieces to get started.</p>
          </div>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#E01F54] px-8 py-3 text-sm font-bold text-white hover:bg-[#c01a48] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.variantId}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  {/* Image */}
                  <Link href={`/products/${item.slug}`} className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#F7F7F7]">
                    <Image
                      src={item.image || "/placeholder-product.jpg"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized={isDataImageUrl(item.image)}
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-bold text-[#1A1A1A] hover:text-[#E01F54] transition-colors line-clamp-2"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-0.5 text-xs text-gray-400">{item.variantName}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      {/* Qty stepper */}
                      <div className="flex items-center gap-1 rounded-lg border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-[#F7F7F7] rounded-l-lg text-sm"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="h-8 w-8 flex items-center justify-center hover:bg-[#F7F7F7] rounded-r-lg text-sm disabled:opacity-30"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-[#1A1A1A]">
                          {formatCHF(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-gray-300 hover:text-[#E01F54] transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#007791] font-medium hover:gap-3 transition-all mt-4"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-gray-100 bg-[#F7F7F7] p-6">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Order Summary</h2>

              {/* Free shipping progress */}
              {t.subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="mb-4 rounded-lg bg-white p-3">
                  <p className="text-xs text-gray-600 mb-1.5">
                    Add <span className="font-bold text-[#E01F54]">{formatCHF(FREE_SHIPPING_THRESHOLD - t.subtotal)}</span> for free shipping!
                  </p>
                  <div className="h-1.5 rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-[#E01F54] transition-all duration-500"
                      style={{ width: `${Math.min((t.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCHF(t.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{t.shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatCHF(t.shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VAT (8.1%)</span>
                  <span>{formatCHF(t.tax)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold text-base text-[#1A1A1A]">
                  <span>Total</span>
                  <span>{formatCHF(t.total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#E01F54] py-4 text-sm font-bold text-white hover:bg-[#c01a48] transition-colors"
              >
                Checkout Now
                <ArrowRightIcon className="h-4 w-4" />
              </Link>

              <div className="mt-4 space-y-1.5 text-xs text-center text-gray-400">
                <p>🔒 Secure checkout</p>
                <p>💳 TWINT · PayPal · Credit Card</p>
                <p>All prices in CHF incl. 8.1% VAT</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
