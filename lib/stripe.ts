import Stripe from "stripe";

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing. Add it in Vercel environment variables.");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" as any });
}

export const planPriceIds = {
  Pro: process.env.STRIPE_PRO_PRICE_ID,
  Business: process.env.STRIPE_BUSINESS_PRICE_ID
} as const;
