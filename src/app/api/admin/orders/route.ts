import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { prismaOrderToAdmin } from "@/lib/admin-orders-map";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ orders: [] });
  }
  try {
    const rows = await prisma.order.findMany({
      include: {
        shippingAddress: true,
        customer: true,
        items: true,
      },
      orderBy: { orderDate: "desc" },
    });
    return NextResponse.json({ orders: rows.map(prismaOrderToAdmin) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ orders: [], error: "database_unavailable" });
  }
}
