"use client";

import Link from "next/link";
import { useMergedCategories } from "@/lib/useMergedCatalog";

export function FooterShopLinks() {
  const categories = useMergedCategories();

  return (
    <ul className="mt-4 space-y-2">
      {categories.map((link) => (
        <li key={link.slug}>
          <Link
            href={`/category/${link.slug}`}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
