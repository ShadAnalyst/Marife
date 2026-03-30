import type { Category, Product, ProductImage, ProductVariant } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { MockImage, MockProduct, MockVariant } from "@/lib/mockData";
import type { MergedCategory } from "@/lib/catalog-types";

type ProductWithRelations = Product & {
  variants: ProductVariant[];
  images: ProductImage[];
  categories: { category: Category }[];
};

export function mapVariant(v: ProductVariant): MockVariant {
  return {
    id: v.id,
    sku: v.sku,
    variantName: v.variantName,
    sizeValue: v.sizeValue,
    colorValue: v.colorValue,
    priceModifier: v.priceModifier != null ? Number(v.priceModifier) : null,
    currentStock: v.currentStock,
    lowStockThreshold: v.lowStockThreshold,
    isAvailable: v.isAvailable,
  };
}

export function mapImage(img: ProductImage): MockImage {
  return {
    id: img.id,
    urlMain: img.urlMain,
    urlThumbnail: img.urlThumbnail,
    urlZoom: img.urlZoom,
    sortOrder: img.sortOrder,
  };
}

export function prismaProductToMock(p: ProductWithRelations): MockProduct {
  const categorySlug = p.categories[0]?.category.slug ?? "fashion";
  const sale = p.salePrice != null ? Number(p.salePrice) : undefined;
  return {
    id: p.id,
    skuPrefix: p.skuPrefix,
    name: p.name,
    slug: p.slug,
    descriptionShort: p.descriptionShort ?? "",
    descriptionLong: p.descriptionLong ?? "",
    basePrice: Number(p.basePrice),
    salePrice: sale !== undefined && sale < Number(p.basePrice) ? sale : undefined,
    isActive: p.isActive,
    images: [...p.images].sort((a, b) => a.sortOrder - b.sortOrder).map(mapImage),
    variants: p.variants.map(mapVariant),
    category: categorySlug,
    tags: p.tags?.length ? p.tags : [],
  };
}

function withCounts(categories: MergedCategory[], products: MockProduct[]): MergedCategory[] {
  return categories.map((c) => ({
    ...c,
    count: products.filter((p) => p.category === c.slug && p.isActive).length,
  }));
}

export async function loadCatalogFromDb(): Promise<{ categories: MergedCategory[]; products: MockProduct[] }> {
  const [categoriesRaw, productsRaw] = await Promise.all([
    prisma.category.findMany({
      where: { hiddenFromNav: false },
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    }),
    prisma.product.findMany({
      include: {
        variants: true,
        images: { orderBy: { sortOrder: "asc" } },
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const products = productsRaw.map(prismaProductToMock);
  const categories: MergedCategory[] = categoriesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    imageUrl: c.imageUrl ?? "",
    count: 0,
  }));

  return {
    categories: withCounts(categories, products),
    products,
  };
}

export async function upsertProductFromMock(input: MockProduct, categorySlug: string) {
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) throw new Error(`Category not found: ${categorySlug}`);

  const base = {
    skuPrefix: input.skuPrefix,
    name: input.name,
    slug: input.slug,
    descriptionShort: input.descriptionShort,
    descriptionLong: input.descriptionLong,
    basePrice: new Prisma.Decimal(input.basePrice),
    salePrice: input.salePrice != null ? new Prisma.Decimal(input.salePrice) : null,
    isActive: input.isActive,
    tags: input.tags,
  };

  await prisma.product.upsert({
    where: { id: input.id },
    create: {
      id: input.id,
      ...base,
      categories: {
        create: [{ categoryId: category.id }],
      },
      images: {
        create: input.images.map((img, i) => ({
          id: img.id,
          urlMain: img.urlMain,
          urlThumbnail: img.urlThumbnail,
          urlZoom: img.urlZoom,
          sortOrder: img.sortOrder ?? i,
        })),
      },
      variants: {
        create: input.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          variantName: v.variantName,
          sizeValue: v.sizeValue,
          colorValue: v.colorValue,
          priceModifier: v.priceModifier != null ? new Prisma.Decimal(v.priceModifier) : null,
          currentStock: v.currentStock,
          lowStockThreshold: v.lowStockThreshold,
          isAvailable: v.isAvailable,
        })),
      },
    },
    update: {
      ...base,
      categories: {
        deleteMany: {},
        create: [{ categoryId: category.id }],
      },
      images: {
        deleteMany: {},
        create: input.images.map((img, i) => ({
          id: img.id,
          urlMain: img.urlMain,
          urlThumbnail: img.urlThumbnail,
          urlZoom: img.urlZoom,
          sortOrder: img.sortOrder ?? i,
        })),
      },
      variants: {
        deleteMany: {},
        create: input.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          variantName: v.variantName,
          sizeValue: v.sizeValue,
          colorValue: v.colorValue,
          priceModifier: v.priceModifier != null ? new Prisma.Decimal(v.priceModifier) : null,
          currentStock: v.currentStock,
          lowStockThreshold: v.lowStockThreshold,
          isAvailable: v.isAvailable,
        })),
      },
    },
  });
}

export async function deleteProductById(id: string) {
  await prisma.product.delete({ where: { id } });
}

export async function createCategoryRow(input: { name: string; slug: string; imageUrl: string }) {
  const max = await prisma.category.aggregate({ _max: { displayOrder: true } });
  const nextOrder = (max._max.displayOrder ?? 0) + 1;
  return prisma.category.create({
    data: {
      name: input.name.trim(),
      slug: input.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      imageUrl: input.imageUrl.trim(),
      displayOrder: nextOrder,
      hiddenFromNav: false,
    },
  });
}

export async function updateCategoryBySlug(
  slug: string,
  patch: { name?: string; slug?: string; imageUrl?: string; hiddenFromNav?: boolean }
) {
  const nextSlug = patch.slug?.trim().toLowerCase().replace(/\s+/g, "-");
  return prisma.category.update({
    where: { slug },
    data: {
      ...(patch.name != null ? { name: patch.name.trim() } : {}),
      ...(nextSlug ? { slug: nextSlug } : {}),
      ...(patch.imageUrl != null ? { imageUrl: patch.imageUrl.trim() } : {}),
      ...(patch.hiddenFromNav != null ? { hiddenFromNav: patch.hiddenFromNav } : {}),
    },
  });
}

export async function hideCategorySlug(slug: string) {
  await prisma.category.update({ where: { slug }, data: { hiddenFromNav: true } });
}

/** Deactivate products in this category and hide the category (avoids FK issues with orders). */
export async function softDeleteCategoryAndProducts(slug: string) {
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) return;
  await prisma.$transaction([
    prisma.product.updateMany({
      where: { categories: { some: { categoryId: cat.id } } },
      data: { isActive: false },
    }),
    prisma.category.update({ where: { id: cat.id }, data: { hiddenFromNav: true } }),
  ]);
}

