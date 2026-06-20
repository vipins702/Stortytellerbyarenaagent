export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const subscription = await prisma.subscription.findFirst({ where: { userId: user.id, stripeCustomerId: { not: null } }, orderBy: { createdAt: "desc" } });
    if (!subscription?.stripeCustomerId) throw new Error("No Stripe customer found for this workspace.");
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await getStripe().billingPortal.sessions.create({ customer: subscription.stripeCustomerId, return_url: `${origin}/billing` });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to open billing portal" }, { status: 400 });
  }
}
