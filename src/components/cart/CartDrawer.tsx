"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { isDataImageUrl } from "@/lib/imageUpload";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ShoppingBagIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/useCartStore";
import { formatCHF } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_RATE } from "@/lib/constants";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totals } = useCartStore();
  const t = totals();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-bold text-[#1A1A1A]">
                Shopping Bag{" "}
                {items.length > 0 && (
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && t.subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="bg-[#F7F7F7] px-5 py-3">
                <p className="text-xs text-gray-600">
                  Add{" "}
                  <span className="font-semibold text-[#E01F54]">
                    {formatCHF(FREE_SHIPPING_THRESHOLD - t.subtotal)}
                  </span>{" "}
                  more for free shipping!
                </p>
                <div className="mt-1.5 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#E01F54] transition-all duration-500"
                    style={{
                      width: `${Math.min((t.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
                  <ShoppingBagIcon className="h-16 w-16 text-gray-200" />
                  <div>
                    <p className="text-lg font-semibold text-[#1A1A1A]">Your bag is empty</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Discover our bold collection and add some magic!
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-2 rounded-full bg-[#E01F54] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c01a48] transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.variantId}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3"
                      >
                        {/* Image */}
                        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F7F7F7]">
                          <Image
                            src={item.image || "/placeholder-product.jpg"}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="80px"
                            unoptimized={isDataImageUrl(item.image)}
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={closeCart}
                              className="text-sm font-semibold text-[#1A1A1A] hover:text-[#E01F54] line-clamp-2 leading-tight"
                            >
                              {item.productName}
                            </Link>
                            {item.variantName && (
                              <p className="mt-0.5 text-xs text-gray-500">{item.variantName}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity stepper */}
                            <div className="flex items-center gap-2 rounded-lg border border-gray-200">
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center hover:bg-gray-50 rounded-l-lg transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-[1.5rem] text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                disabled={item.quantity >= item.maxStock}
                                className="flex h-7 w-7 items-center justify-center hover:bg-gray-50 rounded-r-lg transition-colors disabled:opacity-40"
                                aria-label="Increase quantity"
                              >
                                <PlusIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-[#1A1A1A]">
                                {formatCHF(item.price * item.quantity)}
                              </span>
                              <button
                                onClick={() => removeItem(item.variantId)}
                                className="text-gray-400 hover:text-[#E01F54] transition-colors"
                                aria-label="Remove item"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t bg-white px-5 py-4 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCHF(t.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {t.shipping === 0 ? (
                        <span className="text-[#28A745] font-medium">FREE</span>
                      ) : (
                        formatCHF(t.shipping)
                      )}
                    </span>
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
                  onClick={closeCart}
                  className="block w-full rounded-full bg-[#E01F54] py-3.5 text-center text-sm font-bold text-white hover:bg-[#c01a48] transition-colors"
                >
                  Checkout Now
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full rounded-full border border-gray-200 py-3 text-center text-sm font-medium text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors"
                >
                  Continue Shopping
                </button>

                <p className="text-center text-xs text-gray-400">
                  Secure checkout · CHF pricing incl. VAT
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
