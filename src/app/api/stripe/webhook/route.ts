import { NextRequest, NextResponse } from "next/server";

// POST /api/stripe/webhook — handle Stripe webhook events
export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  // TODO: Implement Stripe webhook handling
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  //
  // switch (event.type) {
  //   case "payment_intent.succeeded":
  //     await handlePaymentSuccess(event.data.object);
  //     break;
  //   case "payment_intent.payment_failed":
  //     await handlePaymentFailure(event.data.object);
  //     break;
  // }

  return NextResponse.json({ received: true });
}
