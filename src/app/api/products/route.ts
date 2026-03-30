import { NextRequest, NextResponse } from "next/server";

// GET /api/products — list products (filtered)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("q");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "24");

  // TODO: Replace with real DB query using prisma
  // const products = await prisma.product.findMany({
  //   where: {
  //     isActive: true,
  //     ...(search && { name: { contains: search, mode: "insensitive" } }),
  //     ...(category && { categories: { some: { category: { slug: category } } } }),
  //   },
  //   include: {
  //     images: { orderBy: { sortOrder: "asc" }, take: 2 },
  //     variants: true,
  //   },
  //   skip: (page - 1) * limit,
  //   take: limit,
  //   orderBy: { createdAt: "desc" },
  // });

  return NextResponse.json({
    products: [],
    total: 0,
    page,
    limit,
  });
}
