export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const schema = z.object({ items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(99) })).min(1) });

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const input = schema.parse(await request.json());
    const website = await prisma.website.findUnique({ where: { slug: params.slug }, include: { owner: true } });
    if (!website || website.status !== "Published") return NextResponse.json({ error: "Storefront not available" }, { status: 404 });
    const products = await prisma.product.findMany({ where: { websiteId: website.id, id: { in: input.items.map((i) => i.productId) }, status: "Active" } });
    const line_items = input.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error("Invalid product");
      return { quantity: item.quantity, price_data: { currency: product.currency, unit_amount: product.price, product_data: { name: product.name, description: product.description || undefined } } };
    });
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const stripe = getStripe();
    const connected = website.owner.stripeConnectAccountId;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/s/${website.slug}?checkout=success`,
      cancel_url: `${origin}/s/${website.slug}?checkout=cancelled`,
      metadata: { websiteId: website.id, slug: website.slug, type: "storefront_order", items: JSON.stringify(input.items).slice(0, 450) },
      payment_intent_data: connected ? { application_fee_amount: Math.round(line_items.reduce((sum, li: any) => sum + li.price_data.unit_amount * li.quantity, 0) * 0.03) } : undefined
    }, connected ? { stripeAccount: connected } : undefined);
    await prisma.analyticsEvent.create({ data: { websiteId: website.id, type: "checkout_started", path: `/s/${website.slug}`, metadata: { itemCount: input.items.length } } });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create checkout" }, { status: 400 });
  }
}
