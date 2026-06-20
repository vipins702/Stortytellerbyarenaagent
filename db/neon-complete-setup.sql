-- CreateEnum
CREATE TYPE "WebsiteStatus" AS ENUM ('Draft', 'Published', 'Archived');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('Active', 'Draft', 'Archived');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Paid', 'Packing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('New', 'Contacted', 'Converted', 'Archived');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('Free', 'Pro', 'Business');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Owner', 'Admin', 'Designer', 'Editor', 'Viewer', 'Billing');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "stripeConnectAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Editor',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "organizationId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "WebsiteStatus" NOT NULL DEFAULT 'Draft',
    "industry" TEXT,
    "theme" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "sections" JSONB NOT NULL DEFAULT '[]',
    "seo" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "theme" JSONB NOT NULL DEFAULT '{}',
    "sections" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentDefinition" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "defaults" JSONB NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComponentDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'Draft',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "source" TEXT,
    "message" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'New',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" "OrderStatus" NOT NULL DEFAULT 'Paid',
    "items" JSONB NOT NULL DEFAULT '[]',
    "stripePaymentId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishVersion" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'Free',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT,
    "referrer" TEXT,
    "visitorId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "verifiedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ABTest" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "targetPath" TEXT NOT NULL DEFAULT '/',
    "goal" TEXT NOT NULL DEFAULT 'lead_submit',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ABTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ABVariant" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 50,
    "sections" JSONB NOT NULL DEFAULT '[]',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ABVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "checklist" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "price" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "websiteId" TEXT,
    "type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Queued',
    "currentStep" TEXT,
    "result" JSONB NOT NULL DEFAULT '{}',
    "error" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenerationJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationStep" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB NOT NULL DEFAULT '{}',
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenerationStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationAsset" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'generated',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenerationAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_organizationId_key" ON "Membership"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Website_slug_key" ON "Website"("slug");

-- CreateIndex
CREATE INDEX "Website_ownerId_idx" ON "Website"("ownerId");

-- CreateIndex
CREATE INDEX "Website_organizationId_idx" ON "Website"("organizationId");

-- CreateIndex
CREATE INDEX "Page_websiteId_idx" ON "Page"("websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_websiteId_path_key" ON "Page"("websiteId", "path");

-- CreateIndex
CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentDefinition_type_key" ON "ComponentDefinition"("type");

-- CreateIndex
CREATE INDEX "Asset_websiteId_idx" ON "Asset"("websiteId");

-- CreateIndex
CREATE INDEX "Product_websiteId_idx" ON "Product"("websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_websiteId_slug_key" ON "Product"("websiteId", "slug");

-- CreateIndex
CREATE INDEX "Lead_websiteId_idx" ON "Lead"("websiteId");

-- CreateIndex
CREATE INDEX "Order_websiteId_idx" ON "Order"("websiteId");

-- CreateIndex
CREATE INDEX "PublishVersion_websiteId_idx" ON "PublishVersion"("websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "PublishVersion_websiteId_version_key" ON "PublishVersion"("websiteId", "version");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_websiteId_idx" ON "AnalyticsEvent"("websiteId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_idx" ON "AnalyticsEvent"("type");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_hostname_key" ON "Domain"("hostname");

-- CreateIndex
CREATE INDEX "Domain_websiteId_idx" ON "Domain"("websiteId");

-- CreateIndex
CREATE INDEX "ABTest_websiteId_idx" ON "ABTest"("websiteId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog"("resource");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_idx" ON "WebhookEvent"("provider");

-- CreateIndex
CREATE INDEX "WebhookEvent_type_idx" ON "WebhookEvent"("type");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingState_userId_key" ON "OnboardingState"("userId");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "GenerationJob_userId_idx" ON "GenerationJob"("userId");

-- CreateIndex
CREATE INDEX "GenerationJob_websiteId_idx" ON "GenerationJob"("websiteId");

-- CreateIndex
CREATE INDEX "GenerationJob_status_idx" ON "GenerationJob"("status");

-- CreateIndex
CREATE INDEX "GenerationJob_type_idx" ON "GenerationJob"("type");

-- CreateIndex
CREATE INDEX "GenerationStep_jobId_idx" ON "GenerationStep"("jobId");

-- CreateIndex
CREATE INDEX "GenerationStep_status_idx" ON "GenerationStep"("status");

-- CreateIndex
CREATE UNIQUE INDEX "GenerationStep_jobId_name_key" ON "GenerationStep"("jobId", "name");

-- CreateIndex
CREATE INDEX "GenerationAsset_jobId_idx" ON "GenerationAsset"("jobId");

-- CreateIndex
CREATE INDEX "GenerationAsset_assetId_idx" ON "GenerationAsset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "GenerationAsset_jobId_assetId_key" ON "GenerationAsset"("jobId", "assetId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishVersion" ADD CONSTRAINT "PublishVersion_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABTest" ADD CONSTRAINT "ABTest_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ABVariant" ADD CONSTRAINT "ABVariant_testId_fkey" FOREIGN KEY ("testId") REFERENCES "ABTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingState" ADD CONSTRAINT "OnboardingState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationStep" ADD CONSTRAINT "GenerationStep_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GenerationJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationAsset" ADD CONSTRAINT "GenerationAsset_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GenerationJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationAsset" ADD CONSTRAINT "GenerationAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Aurelia / Storyteller SaaS starter seed for Neon PostgreSQL
-- Run this after db/neon-schema.sql.
-- Change the email/name below if needed.

BEGIN;

-- Development / first owner user
INSERT INTO "User" ("id", "email", "name", "createdAt", "updatedAt")
VALUES ('user_founder', 'founder@aurelia.ai', 'Aurelia Founder', NOW(), NOW())
ON CONFLICT ("email") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = NOW();

-- Component definitions
INSERT INTO "ComponentDefinition" ("id", "type", "label", "description", "category", "schema", "defaults", "metadata", "isActive", "createdAt", "updatedAt") VALUES
('cmp_hero', 'hero', 'Hero', 'Premium conversion hero with headline, copy, CTA and media.', 'Sections',
 '{"title":{"type":"string"},"eyebrow":{"type":"string"},"body":{"type":"string"},"cta":{"type":"string"},"imageUrl":{"type":"asset"}}'::jsonb,
 '{"eyebrow":"Launch page","title":"Maison Aurelia","body":"A premium storefront crafted for thoughtful customers.","cta":"Shop collection","imageUrl":""}'::jsonb,
 '{"supports":["seo","motion","assetPicker"]}'::jsonb, true, NOW(), NOW()),
('cmp_features', 'features', 'Features', 'Three glass feature cards with premium motion metadata.', 'Sections',
 '{"title":{"type":"string"},"items":{"type":"array"}}'::jsonb,
 '{"title":"Everything your customers need","items":[{"title":"Polished layouts","body":"Clear sections with refined visual rhythm."},{"title":"Luxury motion","body":"Shimmers, reveals and smooth storytelling."},{"title":"Commerce ready","body":"Products, cart, leads and checkout."}]}'::jsonb,
 '{"supports":["reorder","iconPicker"]}'::jsonb, true, NOW(), NOW()),
('cmp_gallery', 'gallery', 'Gallery', 'Editorial image gallery with asset picker.', 'Media',
 '{"title":{"type":"string"},"images":{"type":"asset[]"}}'::jsonb,
 '{"title":"Editorial gallery","images":[]}'::jsonb,
 '{"supports":["assetLibrary","parallax"]}'::jsonb, true, NOW(), NOW()),
('cmp_products', 'products', 'Product cards', 'DB-driven product showcase connected to CMS products.', 'Commerce',
 '{"title":{"type":"string"},"limit":{"type":"number"}}'::jsonb,
 '{"title":"Featured products","limit":3}'::jsonb,
 '{"supports":["productSource","abTesting","checkout"]}'::jsonb, true, NOW(), NOW()),
('cmp_scroll_story', 'scrollStory', 'Scroll Storytelling', 'Premium scroll-driven story section with image or video panels.', 'Story',
 '{"eyebrow":{"type":"string"},"title":{"type":"string"},"body":{"type":"string"},"mediaUrl":{"type":"asset"},"mediaType":{"type":"string"},"chapters":{"type":"array"}}'::jsonb,
 '{"eyebrow":"Story","title":"A journey told in motion","body":"Guide visitors through a polished sequence of visuals and narrative details.","mediaUrl":"","mediaType":"video","chapters":[{"title":"Opening moment","body":"Introduce the world, mood and promise."},{"title":"Craft and detail","body":"Show what makes the offer valuable."},{"title":"Invitation","body":"End with a clear next step."}]}'::jsonb,
 '{"supports":["video","image","stickyScroll","storytelling"]}'::jsonb, true, NOW(), NOW()),
('cmp_model3d', 'model3d', '3D Model Showcase', 'Premium GLB/GLTF product model section backed by Vercel Blob assets.', 'Commerce',
 '{"title":{"type":"string"},"body":{"type":"string"},"assetUrl":{"type":"asset"},"scale":{"type":"number"},"autoRotate":{"type":"boolean"},"environment":{"type":"string"}}'::jsonb,
 '{"title":"Explore every detail","body":"A closer look at the craftsmanship, materials and form.","assetUrl":"","scale":1.6,"autoRotate":true,"environment":"city"}'::jsonb,
 '{"supports":["modelViewer","lighting","commerce"]}'::jsonb, true, NOW(), NOW()),
('cmp_lead', 'lead', 'Lead capture', 'Contact capture block connected to Lead API.', 'Forms',
 '{"title":{"type":"string"},"placeholder":{"type":"string"}}'::jsonb,
 '{"title":"Join the private list","placeholder":"email@brand.com"}'::jsonb,
 '{"supports":["notifications","analytics"]}'::jsonb, true, NOW(), NOW())
ON CONFLICT ("type") DO UPDATE SET
  "label" = EXCLUDED."label",
  "description" = EXCLUDED."description",
  "category" = EXCLUDED."category",
  "schema" = EXCLUDED."schema",
  "defaults" = EXCLUDED."defaults",
  "metadata" = EXCLUDED."metadata",
  "isActive" = true,
  "updatedAt" = NOW();

-- Templates
INSERT INTO "Template" ("id", "name", "slug", "industry", "description", "isPremium", "metadata", "theme", "sections", "createdAt", "updatedAt") VALUES
('tpl_maison_retail', 'Maison Retail', 'maison-retail', 'Luxury retail', 'Premium storefront with products, story and search-ready sections.', false,
 '{"style":"premium","seed":true}'::jsonb,
 '{"background":"#F8F6F0","accent":"#D4AF37","text":"#1a1a1a","fonts":{"heading":"Playfair Display","body":"Inter"}}'::jsonb,
 '[{"id":"tpl-hero","type":"hero","props":{"eyebrow":"Luxury retail","title":"Maison Retail","body":"A polished storefront for premium products.","cta":"Shop collection"},"animation":{"preset":"luxury-reveal"},"metadata":{"source":"seed"}},{"id":"tpl-story","type":"scrollStory","props":{"eyebrow":"Story","title":"A launch told beautifully","body":"Use motion, media and chapters to guide customers through the product story.","chapters":[{"title":"The first impression","body":"Set the tone with a refined visual."},{"title":"The product detail","body":"Explain craft, quality and value."},{"title":"The invitation","body":"Lead visitors to purchase or enquire."}]},"animation":{"preset":"sticky-story"},"metadata":{"source":"seed"}},{"id":"tpl-products","type":"products","props":{"title":"Featured collection","limit":3},"animation":{"preset":"stagger"},"metadata":{"source":"seed"}}]'::jsonb,
 NOW(), NOW()),
('tpl_saas', 'Linear SaaS', 'linear-saas', 'SaaS', 'Minimal conversion site with features and lead capture.', false,
 '{"style":"minimal","seed":true}'::jsonb,
 '{"background":"#F8F6F0","accent":"#D4AF37","text":"#1a1a1a","fonts":{"heading":"Playfair Display","body":"Inter"}}'::jsonb,
 '[{"id":"saas-hero","type":"hero","props":{"eyebrow":"Software","title":"Launch with clarity","body":"A clean product page for modern teams.","cta":"Start free"},"animation":{"preset":"luxury-reveal"},"metadata":{"source":"seed"}},{"id":"saas-features","type":"features","props":{"title":"Built for teams","items":[{"title":"Fast setup","body":"Get started quickly."},{"title":"Clear workflows","body":"Keep your team aligned."},{"title":"Useful reporting","body":"Measure what matters."}]},"animation":{"preset":"stagger"},"metadata":{"source":"seed"}}]'::jsonb,
 NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "sections" = EXCLUDED."sections",
  "theme" = EXCLUDED."theme",
  "metadata" = EXCLUDED."metadata",
  "updatedAt" = NOW();

-- Starter website
INSERT INTO "Website" ("id", "ownerId", "name", "slug", "status", "industry", "theme", "metadata", "createdAt", "updatedAt")
VALUES (
  'web_maison_aurelia',
  'user_founder',
  'Maison Aurelia',
  'maison-aurelia',
  'Draft',
  'Luxury retail',
  '{"background":"#F8F6F0","accent":"#D4AF37","text":"#1a1a1a","fonts":{"heading":"Playfair Display","body":"Inter"}}'::jsonb,
  '{"seed":true}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO UPDATE SET "updatedAt" = NOW();

-- Home page with metadata-driven sections
INSERT INTO "Page" ("id", "websiteId", "title", "path", "sections", "seo", "createdAt", "updatedAt")
VALUES (
  'page_home_maison',
  'web_maison_aurelia',
  'Home',
  '/',
  '[{"id":"home-hero","type":"hero","props":{"eyebrow":"Seeded workspace","title":"Maison Aurelia","body":"A premium storefront with story, products and polished search settings.","cta":"Shop collection"},"animation":{"preset":"luxury-reveal"},"metadata":{"source":"seed"}},{"id":"home-story","type":"scrollStory","props":{"eyebrow":"Story","title":"A journey told in motion","body":"Use image or video chapters to guide visitors through your brand story.","mediaUrl":"","mediaType":"video","chapters":[{"title":"Opening moment","body":"Introduce the mood and promise."},{"title":"Craft and detail","body":"Show materials, process and value."},{"title":"Invitation","body":"Guide visitors to the next step."}]},"animation":{"preset":"sticky-story"},"metadata":{"source":"seed"}},{"id":"home-products","type":"products","props":{"title":"Featured products","limit":3},"animation":{"preset":"stagger"},"metadata":{"source":"seed"}},{"id":"home-lead","type":"lead","props":{"title":"Join the private list","placeholder":"email@brand.com"},"animation":{"preset":"reveal"},"metadata":{"source":"seed"}}]'::jsonb,
  '{"title":"Maison Aurelia | Premium Storefront","description":"A refined storefront for premium products, storytelling and customer conversion.","keywords":["luxury retail","premium storefront","Maison Aurelia"],"structuredDataType":"Store"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT ("websiteId", "path") DO UPDATE SET "sections" = EXCLUDED."sections", "seo" = EXCLUDED."seo", "updatedAt" = NOW();

-- Products
INSERT INTO "Product" ("id", "websiteId", "name", "slug", "description", "price", "currency", "stock", "sku", "status", "metadata", "createdAt", "updatedAt") VALUES
('prod_noir_lamp', 'web_maison_aurelia', 'Noir Lamp', 'noir-lamp', 'A sculptural lamp with a soft architectural glow.', 24000, 'usd', 14, 'NOIR-LAMP', 'Active', '{"imageUrl":"","seed":true}'::jsonb, NOW(), NOW()),
('prod_champagne_chair', 'web_maison_aurelia', 'Champagne Chair', 'champagne-chair', 'A refined chair with champagne-toned detailing.', 89000, 'usd', 6, 'CHAMP-CHAIR', 'Active', '{"imageUrl":"","seed":true}'::jsonb, NOW(), NOW()),
('prod_silk_serum', 'web_maison_aurelia', 'Silk Serum', 'silk-serum', 'A botanical serum with a smooth, luminous finish.', 7600, 'usd', 33, 'SILK-SERUM', 'Active', '{"imageUrl":"","seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("websiteId", "slug") DO UPDATE SET "stock" = EXCLUDED."stock", "status" = EXCLUDED."status", "updatedAt" = NOW();

-- Product variants
INSERT INTO "ProductVariant" ("id", "productId", "name", "sku", "price", "stock", "metadata", "createdAt", "updatedAt") VALUES
('var_lamp_noir', 'prod_noir_lamp', 'Noir', 'NOIR-LAMP-BLACK', 24000, 8, '{"color":"black"}'::jsonb, NOW(), NOW()),
('var_lamp_champagne', 'prod_noir_lamp', 'Champagne', 'NOIR-LAMP-CHAMP', 26000, 6, '{"color":"champagne"}'::jsonb, NOW(), NOW()),
('var_serum_30ml', 'prod_silk_serum', '30ml', 'SILK-SERUM-30', 7600, 20, '{"size":"30ml"}'::jsonb, NOW(), NOW()),
('var_serum_50ml', 'prod_silk_serum', '50ml', 'SILK-SERUM-50', 11600, 13, '{"size":"50ml"}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "stock" = EXCLUDED."stock", "price" = EXCLUDED."price", "updatedAt" = NOW();

-- Lead and order examples
INSERT INTO "Lead" ("id", "websiteId", "name", "email", "source", "status", "metadata", "createdAt", "updatedAt")
VALUES ('lead_sophia', 'web_maison_aurelia', 'Sophia Chen', 'sophia@example.com', 'Homepage form', 'New', '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Order" ("id", "websiteId", "customerName", "customerEmail", "total", "currency", "status", "items", "metadata", "createdAt", "updatedAt")
VALUES ('order_seed_1001', 'web_maison_aurelia', 'Olivia Hart', 'olivia@example.com', 31600, 'usd', 'Paid', '[{"productId":"prod_noir_lamp","quantity":1},{"productId":"prod_silk_serum","quantity":1}]'::jsonb, '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

COMMIT;
