import { NextResponse } from "next/server";
import { loadCatalogFromDb } from "@/lib/catalog-db";
import { getMockCatalogResponse } from "@/lib/catalog-fallback";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(getMockCatalogResponse());
  }
  try {
    const data = await loadCatalogFromDb();
    return NextResponse.json({ ...data, source: "database" as const });
  } catch (e) {
    console.error("catalog GET:", e);
    return NextResponse.json({ ...getMockCatalogResponse(), source: "mock", warning: "database_unavailable" });
  }
}
