import { z } from "zod";
import { pageSectionsSchema } from "@/lib/component-registry";

export const createWebsiteSchema = z.object({
  name: z.string().min(2).max(80),
  industry: z.string().max(80).optional(),
  templateId: z.string().optional()
});

export const updatePageSectionsSchema = z.object({
  sections: pageSectionsSchema
});

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().optional(),
  price: z.number().int().min(0),
  stock: z.number().int().min(0).default(0),
  sku: z.string().optional(),
  status: z.enum(["Active", "Draft", "Archived"]).default("Draft"),
  metadata: z.record(z.any()).default({})
});

export const leadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string().optional(),
  message: z.string().optional(),
  metadata: z.record(z.any()).default({})
});

export const orderSchema = z.object({
  customerName: z.string().min(1).max(120),
  customerEmail: z.string().email().optional(),
  total: z.number().int().min(0),
  currency: z.string().default("usd"),
  status: z.enum(["Paid", "Packing", "Shipped", "Delivered", "Cancelled", "Refunded"]).default("Paid"),
  items: z.array(z.record(z.any())).default([]),
  metadata: z.record(z.any()).default({})
});
