import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice?: number;
    images: Array<{ urlThumbnail: string; urlMain: string }>;
    variants: any[];
  }>;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-gray-400">No products found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-4 md:gap-6`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
