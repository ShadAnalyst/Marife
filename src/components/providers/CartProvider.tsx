"use client";

import { useEffect } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}
