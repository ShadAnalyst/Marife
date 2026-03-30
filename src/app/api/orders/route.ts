import { NextRequest, NextResponse } from "next/server";

// POST /api/orders — create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod } = body;

    if (!items?.length || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // TODO: implement with real Prisma + Stripe
    // 1. Validate all variant stock levels
    // 2. Create customer/guest record
    // 3. Create shipping address
    // 4. Calculate totals (subtotal, VAT 8.1%, flat-rate shipping)
    // 5. Create order + order items in DB
    // 6. Initiate Stripe payment intent
    // 7. Decrement variant stock
    // 8. Send confirmation email via Resend

    const orderId = `MRF-${Date.now().toString(36).toUpperCase()}`;
    return NextResponse.json({ orderId, status: "PENDING" }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
