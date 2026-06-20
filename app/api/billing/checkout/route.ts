export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, planPriceIds } from "@/lib/stripe";

const schema = z.object({ plan: z.enum(["Pro", "Business"]) });

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const { plan } = schema.parse(await request.json());
    const price = planPriceIds[plan];
    if (!price) throw new Error(`Missing Stripe price id for ${plan}. Add STRIPE_${plan.toUpperCase()}_PRICE_ID.`);
    const stripe = getStripe();
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const existing = await prisma.subscription.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: existing?.stripeCustomerId || undefined,
      customer_email: existing?.stripeCustomerId ? undefined : user.email,
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/billing?success=1`,
      cancel_url: `${origin}/billing?cancelled=1`,
      metadata: { userId: user.id, plan }
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start checkout" }, { status: 400 });
  }
}
