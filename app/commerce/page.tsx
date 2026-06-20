export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { StripeConnectButton } from "@/components/commerce/StripeConnectButton";
import { Card } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth";

export default async function CommercePage() {
  const user = await getCurrentUser();
  return <AppShell><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Commerce Payments</h1><p className="mt-2 text-charcoal/60">Stripe Connect foundation for user storefront payouts and premium checkout.</p></div><Card className="p-7"><h2 className="text-2xl font-black">Stripe Express</h2><p className="mt-3 max-w-2xl leading-7 text-charcoal/60">Connect a merchant account so published websites can accept payments. Checkout sessions use the connected account when available, with platform fee metadata ready.</p><div className="mt-6"><StripeConnectButton /></div><p className="mt-4 text-sm text-charcoal/45">Current account: {user.stripeConnectAccountId || "Not connected"}</p></Card></AppShell>;
}
