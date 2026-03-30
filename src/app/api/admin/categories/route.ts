import { NextRequest, NextResponse } from "next/server";
import { createCategoryRow } from "@/lib/catalog-db";

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  }
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const slug = String(body.slug ?? "").trim().toLowerCase().replace(/\s+/g, "-");
    const imageUrl = String(body.imageUrl ?? "").trim();
    if (!name || !slug || !imageUrl) {
      return NextResponse.json({ error: "name, slug, imageUrl required" }, { status: 400 });
    }
    const row = await createCategoryRow({ name, slug, imageUrl });
    return NextResponse.json({ category: row });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "create_failed" }, { status: 500 });
  }
}
