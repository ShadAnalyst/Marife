"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBagIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";

// ─── 8 real Marife categories ───────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Fashion",             href: "/category/fashion" },
  { label: "Dessous",             href: "/category/dessous" },
  { label: "Korsetts & Corsagen", href: "/category/korsetts" },
  { label: "Africanstyle",        href: "/category/africanstyle" },
  { label: "Lifestyle",           href: "/category/lifestyle" },
  { label: "Gothic & Costumes",   href: "/category/gothic-costumes" },
  { label: "Sale",                href: "/category/sale", highlight: true },
  { label: "Isabelle",            href: "/category/isabelle" },
] as const;

// ─── Mobile menu ─────────────────────────────────────────────────────────────

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xs bg-white flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <Link
                href="/"
                onClick={onClose}
                className="text-xl font-black tracking-[0.18em] text-[#1A1A1A]"
                style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}
              >
                MARIFE
              </Link>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-50 rounded-full transition-colors">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-0">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between py-3.5 border-b border-gray-50 text-[11px] tracking-[0.22em] uppercase font-medium transition-colors",
                    "highlight" in item && item.highlight
                      ? "text-[#E01F54]"
                      : "text-[#1A1A1A] hover:text-[#E01F54]"
                  )}
                >
                  {item.label}
                  <span className="text-gray-200 text-xs">→</span>
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100">
              <Link
                href="/account"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-[11px] font-medium text-[#1A1A1A] hover:bg-gray-50 tracking-[0.1em] uppercase transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                My Account
              </Link>
              <p className="text-center text-[9px] text-gray-300 tracking-[0.22em] uppercase mt-4">
                Zürich · Switzerland
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function Header() {
  const [isScrolled,       setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen,     setIsSearchOpen]     = useState(false);
  const [searchQuery,      setSearchQuery]      = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const itemCount = useCartStore((s) => s.itemCount());
  const openCart  = useCartStore((s) => s.openCart);
  const pathname  = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.07)]"
            : "bg-white border-b border-gray-100"
        )}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-[62px] items-center justify-between gap-6">

            {/* ── Logo ──────────────────────────────────────────────────────── */}
            <Link
              href="/"
              className="flex-shrink-0 text-[1.3rem] font-black tracking-[0.2em] text-[#1A1A1A] hover:text-[#E01F54] transition-colors"
              style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}
            >
              MARIFE
            </Link>

            {/* ── Desktop nav ───────────────────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-[10.5px] font-medium tracking-[0.22em] uppercase transition-colors py-1 group",
                    "highlight" in item && item.highlight
                      ? "text-[#E01F54]"
                      : "text-[#1A1A1A] hover:text-[#E01F54]",
                    pathname?.startsWith(item.href) && "text-[#E01F54]"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-[#E01F54] transition-all duration-300",
                      pathname?.startsWith(item.href) ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              ))}
            </nav>

            {/* ── Right icons ───────────────────────────────────────────────── */}
            <div className="flex items-center gap-0.5">

              {/* Search toggle */}
              <button
                className="rounded-full p-2.5 hover:bg-gray-50 transition-colors"
                onClick={() => setIsSearchOpen((v) => !v)}
                aria-label="Suchen"
              >
                {isSearchOpen
                  ? <XMarkIcon        className="h-[17px] w-[17px] text-[#1A1A1A]" />
                  : <MagnifyingGlassIcon className="h-[17px] w-[17px] text-[#1A1A1A]" />
                }
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex rounded-full p-2.5 hover:bg-gray-50 transition-colors"
                aria-label="Mein Konto"
              >
                <UserIcon className="h-[17px] w-[17px] text-[#1A1A1A]" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative rounded-full p-2.5 hover:bg-gray-50 transition-colors"
                aria-label={`Warenkorb (${itemCount})`}
              >
                <ShoppingBagIcon className="h-[17px] w-[17px] text-[#1A1A1A]" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-0.5 -top-0.5 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#E01F54] text-[9px] font-bold text-white"
                    >
                      {itemCount > 99 ? "99+" : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Hamburger */}
              <button
                className="lg:hidden rounded-full p-2.5 hover:bg-gray-50 transition-colors ml-1"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Menü öffnen"
              >
                <Bars3Icon className="h-[17px] w-[17px] text-[#1A1A1A]" />
              </button>
            </div>
          </div>

          {/* ── Expanding search bar ──────────────────────────────────────── */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="relative pb-3.5">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    ref={searchRef}
                    type="search"
                    placeholder="Suchen nach Dessous, Korsetts…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setIsSearchOpen(false)}
                    className="w-full rounded-full border border-gray-200 bg-[#F5F4F2] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#007791] focus:ring-1 focus:ring-[#007791] transition placeholder:text-gray-400"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
