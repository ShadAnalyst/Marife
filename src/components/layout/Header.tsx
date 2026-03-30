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
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";
import { useMergedCategories } from "@/lib/useMergedCatalog";
import { MarifeLogo } from "@/components/layout/MarifeLogo";

function CategoriesDropdown({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const categories = useMergedCategories();

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 py-1 text-sm font-medium transition-colors",
          isOpen ? "text-[#E01F54]" : "text-[#1A1A1A] hover:text-[#E01F54]"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Categories
        <ChevronDownIcon className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1 max-h-[min(70vh,420px)] w-[min(92vw,280px)] overflow-y-auto rounded-lg border border-gray-100 bg-white py-2 shadow-lg"
          >
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="block px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F7F7F7] hover:text-[#E01F54] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const categories = useMergedCategories();
  const [catOpen, setCatOpen] = useState(true);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm overflow-y-auto bg-white"
          >
            <div className="flex items-center justify-between border-b p-4">
              <MarifeLogo variant="mobile" href="/" onClick={onClose} className="min-w-0" />
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              <button
                type="button"
                onClick={() => setCatOpen(!catOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 font-semibold text-[#1A1A1A] hover:bg-[#F7F7F7]"
              >
                Categories
                <ChevronDownIcon className={cn("h-4 w-4 transition-transform", catOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-2 space-y-0.5 pb-2 border-l-2 border-[#F7F7F7] pl-3">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          onClick={onClose}
                          className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-[#F7F7F7] hover:text-[#E01F54]"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>
            <div className="border-t p-4 space-y-3">
              <Link
                href="/account"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 font-medium text-[#1A1A1A] hover:bg-[#F7F7F7]"
              >
                <UserIcon className="h-5 w-5" />
                My Account
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.openCart);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const openCat = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(true);
  };
  const closeCat = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(false), 120);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 w-full bg-white transition-shadow duration-300",
          isScrolled ? "shadow-md" : "border-b border-gray-200"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <MarifeLogo variant="header" href="/" priority className="min-w-0" />

            <nav className="hidden lg:flex items-center flex-1 ml-8">
              <CategoriesDropdown
                isOpen={openDropdown}
                onOpen={openCat}
                onClose={closeCat}
              />
            </nav>

            <div className="hidden md:flex flex-shrink-0 w-52">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Suchen…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-[#F7F7F7] py-2 pl-9 pr-4 text-sm outline-none focus:border-[#007791] focus:ring-1 focus:ring-[#007791] transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="md:hidden rounded-full p-2 hover:bg-[#F7F7F7] transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              <Link
                href="/account"
                className="hidden sm:flex rounded-full p-2 hover:bg-[#F7F7F7] transition-colors"
                aria-label="My Account"
              >
                <UserIcon className="h-5 w-5" />
              </Link>

              <button
                onClick={openCart}
                className="relative rounded-full p-2 hover:bg-[#F7F7F7] transition-colors"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBagIcon className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E01F54] text-[10px] font-bold text-white"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </button>

              <button
                className="lg:hidden rounded-full p-2 hover:bg-[#F7F7F7] transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden md:hidden pb-3"
              >
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Suchen…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full rounded-full border border-gray-200 bg-[#F7F7F7] py-2 pl-9 pr-4 text-sm outline-none focus:border-[#007791]"
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
