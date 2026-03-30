import { NextRequest, NextResponse } from "next/server";
import { deleteProductById, upsertProductFromMock } from "@/lib/catalog-db";
import type { MockProduct } from "@/lib/mockData";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  }
  try {
    const { id } = await ctx.params;
    const body = (await request.json()) as MockProduct & { categorySlug?: string };
    if (body.id !== id) {
      return NextResponse.json({ error: "id mismatch" }, { status: 400 });
    }
    const categorySlug = body.categorySlug ?? body.category;
    if (!categorySlug) {
      return NextResponse.json({ error: "category slug required" }, { status: 400 });
    }
    await upsertProductFromMock(body, categorySlug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "save_failed" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  }
  try {
    const { id } = await ctx.params;
    const decoded = decodeURIComponent(id);
    await deleteProductById(decoded);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "delete_failed" }, { status: 500 });
  }
}
