import { NextRequest, NextResponse } from "next/server";
import { softDeleteCategoryAndProducts, updateCategoryBySlug } from "@/lib/catalog-db";

type Ctx = { params: Promise<{ slug: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  }
  try {
    const { slug } = await ctx.params;
    const decoded = decodeURIComponent(slug);
    const body = await request.json();
    await updateCategoryBySlug(decoded, {
      name: body.name,
      slug: body.slug,
      imageUrl: body.imageUrl,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "update_failed" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  }
  try {
    const { slug } = await ctx.params;
    const decoded = decodeURIComponent(slug);
    await softDeleteCategoryAndProducts(decoded);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "delete_failed" }, { status: 500 });
  }
}
