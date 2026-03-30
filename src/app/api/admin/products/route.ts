import { NextRequest, NextResponse } from "next/server";
import { upsertProductFromMock } from "@/lib/catalog-db";
import type { MockProduct } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  }
  try {
    const body = (await request.json()) as MockProduct & { categorySlug?: string };
    const categorySlug = body.categorySlug ?? body.category;
    if (!categorySlug || typeof categorySlug !== "string") {
      return NextResponse.json({ error: "category slug required" }, { status: 400 });
    }
    await upsertProductFromMock(body, categorySlug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "save_failed" }, { status: 500 });
  }
}
