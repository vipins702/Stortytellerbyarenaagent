export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { audit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const stripe = getStripe();
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    let accountId = user.stripeConnectAccountId;
    if (!accountId) {
      const account = await stripe.accounts.create({ type: "express", email: user.email, metadata: { userId: user.id } });
      accountId = account.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeConnectAccountId: accountId } });
    }
    const link = await stripe.accountLinks.create({ account: accountId, refresh_url: `${origin}/commerce?refresh=1`, return_url: `${origin}/commerce?connected=1`, type: "account_onboarding" });
    await audit({ userId: user.id, action: "stripe_connect.start", resource: "User", resourceId: user.id, request, metadata: { accountId } });
    return NextResponse.json({ url: link.url, accountId });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start Stripe Connect" }, { status: 400 });
  }
}
