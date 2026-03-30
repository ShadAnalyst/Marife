import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminStatusToPrisma } from "@/lib/admin-orders-map";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured" }, { status: 503 });
  }
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    if (body.status != null && typeof body.status === "string") {
      await prisma.order.update({
        where: { id },
        data: { status: adminStatusToPrisma(body.status) },
      });
    }
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
    const { id } = await ctx.params;
    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "delete_failed" }, { status: 500 });
  }
}
