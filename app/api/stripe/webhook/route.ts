export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const signature = request.headers.get("stripe-signature");
    const rawBody = await request.text();
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Missing Stripe webhook signature/secret");
    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      if (session.metadata?.type === "storefront_order" && session.metadata?.websiteId) {
        const websiteId = String(session.metadata.websiteId);
        const items = session.metadata.items ? JSON.parse(session.metadata.items) : [];
        await prisma.order.create({
          data: {
            websiteId,
            customerName: session.customer_details?.name || session.customer_email || "Storefront Customer",
            customerEmail: session.customer_details?.email || session.customer_email || undefined,
            total: Number(session.amount_total || 0),
            currency: session.currency || "usd",
            status: "Paid",
            stripePaymentId: String(session.payment_intent || session.id),
            items,
            metadata: { source: "stripe_checkout", checkoutSessionId: session.id }
          }
        });
        await prisma.analyticsEvent.create({ data: { websiteId, type: "checkout_completed", path: `/s/${session.metadata.slug || ""}`, metadata: { amount: session.amount_total, sessionId: session.id } } });
      } else {
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan || "Pro";
        if (userId) {
          await prisma.subscription.create({
            data: {
              userId,
              plan,
              stripeCustomerId: String(session.customer || ""),
              stripeSubscriptionId: String(session.subscription || ""),
              status: "active"
            }
          });
        }
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as any;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : undefined
        }
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook failed" }, { status: 400 });
  }
}
