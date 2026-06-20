/*
  Tenant-aware starter seed for Neon PostgreSQL
  Run after db/neon-schema.sql.
*/

BEGIN;

-- Root user and tenant
INSERT INTO "User" ("id", "email", "name", "primaryTenantId", "createdAt", "updatedAt")
VALUES ('user_founder', 'founder@aurelia.ai', 'Aurelia Founder', 'tenant_main', NOW(), NOW())
ON CONFLICT ("email") DO UPDATE SET "name" = EXCLUDED."name", "primaryTenantId" = EXCLUDED."primaryTenantId", "updatedAt" = NOW();

INSERT INTO "Tenant" ("id", "name", "slug", "ownerUserId", "plan", "status", "metadata", "createdAt", "updatedAt")
VALUES ('tenant_main', 'Aurelia Founder Workspace', 'aurelia-founder', 'user_founder', 'Business', 'Active', '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "ownerUserId" = EXCLUDED."ownerUserId", "plan" = EXCLUDED."plan", "updatedAt" = NOW();

INSERT INTO "TenantMember" ("id", "tenantId", "userId", "role", "status", "metadata", "createdAt", "updatedAt")
VALUES ('tenant_member_owner', 'tenant_main', 'user_founder', 'Owner', 'Active', '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("tenantId", "userId") DO UPDATE SET "role" = EXCLUDED."role", "status" = EXCLUDED."status", "updatedAt" = NOW();

INSERT INTO "TenantSettings" ("id", "tenantId", "userId", "branding", "domains", "billing", "security", "metadata", "createdAt", "updatedAt")
VALUES ('tenant_settings_main', 'tenant_main', 'user_founder', '{"accent":"#D4AF37","background":"#F8F6F0"}'::jsonb, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("tenantId") DO UPDATE SET "branding" = EXCLUDED."branding", "updatedAt" = NOW();

-- Onboarding
INSERT INTO "OnboardingState" ("id", "tenantId", "userId", "completed", "currentStep", "checklist", "createdAt", "updatedAt")
VALUES ('onboarding_main', 'tenant_main', 'user_founder', false, 1, '{"siteCreated":true,"productsAdded":true,"seoReviewed":false,"published":false}'::jsonb, NOW(), NOW())
ON CONFLICT ("userId") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "checklist" = EXCLUDED."checklist", "updatedAt" = NOW();

INSERT INTO "OnboardingStep" ("id", "tenantId", "userId", "onboardingId", "key", "title", "status", "metadata", "createdAt", "updatedAt") VALUES
('onboarding_step_site', 'tenant_main', 'user_founder', 'onboarding_main', 'site', 'Create first website', 'Completed', '{"order":1}'::jsonb, NOW(), NOW()),
('onboarding_step_products', 'tenant_main', 'user_founder', 'onboarding_main', 'products', 'Add products', 'Completed', '{"order":2}'::jsonb, NOW(), NOW()),
('onboarding_step_seo', 'tenant_main', 'user_founder', 'onboarding_main', 'seo', 'Review search presence', 'Pending', '{"order":3}'::jsonb, NOW(), NOW()),
('onboarding_step_publish', 'tenant_main', 'user_founder', 'onboarding_main', 'publish', 'Publish website', 'Pending', '{"order":4}'::jsonb, NOW(), NOW())
ON CONFLICT ("onboardingId", "key") DO UPDATE SET "status" = EXCLUDED."status", "updatedAt" = NOW();

-- AI provider config and usage example
INSERT INTO "AIProviderConfig" ("id", "tenantId", "userId", "provider", "label", "encryptedApiKey", "keyLast4", "defaultTextModel", "defaultImageModel", "defaultCodeModel", "isActive", "metadata", "createdAt", "updatedAt")
VALUES ('ai_config_gemini_main', 'tenant_main', 'user_founder', 'gemini', 'Primary Gemini', NULL, NULL, 'gemini-2.5-flash', 'gemini-2.5-flash-image-preview', 'gemini-2.5-pro', true, '{"managedBy":"env-or-tenant-config","seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("tenantId", "provider", "label") DO UPDATE SET "defaultTextModel" = EXCLUDED."defaultTextModel", "defaultImageModel" = EXCLUDED."defaultImageModel", "defaultCodeModel" = EXCLUDED."defaultCodeModel", "updatedAt" = NOW();

INSERT INTO "AIUsageEvent" ("id", "tenantId", "userId", "provider", "model", "operation", "promptTokens", "completionTokens", "totalTokens", "imageCount", "estimatedCostCents", "latencyMs", "status", "metadata", "createdAt")
VALUES ('ai_usage_seed', 'tenant_main', 'user_founder', 'gemini', 'gemini-2.5-flash', 'seed-example', 0, 0, 0, 0, 0, 0, 'Completed', '{"seed":true,"note":"example usage row"}'::jsonb, NOW())
ON CONFLICT ("id") DO NOTHING;

-- Component definitions
INSERT INTO "ComponentDefinition" ("id", "tenantId", "userId", "type", "label", "description", "category", "schema", "defaults", "metadata", "isActive", "createdAt", "updatedAt") VALUES
('cmp_hero', 'tenant_main', 'user_founder', 'hero', 'Hero', 'Premium conversion hero with headline, copy, CTA and media.', 'Sections', '{"title":{"type":"string"},"eyebrow":{"type":"string"},"body":{"type":"string"},"cta":{"type":"string"},"imageUrl":{"type":"asset"}}'::jsonb, '{"eyebrow":"Launch page","title":"Maison Aurelia","body":"A premium storefront crafted for thoughtful customers.","cta":"Shop collection","imageUrl":""}'::jsonb, '{"scope":"tenant","supports":["seo","motion","assetPicker"]}'::jsonb, true, NOW(), NOW()),
('cmp_features', 'tenant_main', 'user_founder', 'features', 'Features', 'Three glass feature cards with premium motion metadata.', 'Sections', '{"title":{"type":"string"},"items":{"type":"array"}}'::jsonb, '{"title":"Everything your customers need","items":[{"title":"Polished layouts","body":"Clear sections with refined visual rhythm."},{"title":"Luxury motion","body":"Shimmers, reveals and smooth storytelling."},{"title":"Commerce ready","body":"Products, cart, leads and checkout."}]}'::jsonb, '{"scope":"tenant","supports":["reorder","iconPicker"]}'::jsonb, true, NOW(), NOW()),
('cmp_gallery', 'tenant_main', 'user_founder', 'gallery', 'Gallery', 'Editorial image gallery with asset picker.', 'Media', '{"title":{"type":"string"},"images":{"type":"asset[]"}}'::jsonb, '{"title":"Editorial gallery","images":[]}'::jsonb, '{"scope":"tenant","supports":["assetLibrary","parallax"]}'::jsonb, true, NOW(), NOW()),
('cmp_products', 'tenant_main', 'user_founder', 'products', 'Product cards', 'DB-driven product showcase connected to CMS products.', 'Commerce', '{"title":{"type":"string"},"limit":{"type":"number"}}'::jsonb, '{"title":"Featured products","limit":3}'::jsonb, '{"scope":"tenant","supports":["productSource","abTesting","checkout"]}'::jsonb, true, NOW(), NOW()),
('cmp_scroll_story', 'tenant_main', 'user_founder', 'scrollStory', 'Scroll Storytelling', 'Premium scroll-driven story section with image or video panels.', 'Story', '{"eyebrow":{"type":"string"},"title":{"type":"string"},"body":{"type":"string"},"mediaUrl":{"type":"asset"},"mediaType":{"type":"string"},"chapters":{"type":"array"}}'::jsonb, '{"eyebrow":"Story","title":"A journey told in motion","body":"Guide visitors through a polished sequence of visuals and narrative details.","mediaUrl":"","mediaType":"video","chapters":[{"title":"Opening moment","body":"Introduce the world, mood and promise."},{"title":"Craft and detail","body":"Show what makes the offer valuable."},{"title":"Invitation","body":"End with a clear next step."}]}'::jsonb, '{"scope":"tenant","supports":["video","image","stickyScroll","storytelling"]}'::jsonb, true, NOW(), NOW()),
('cmp_model3d', 'tenant_main', 'user_founder', 'model3d', '3D Model Showcase', 'Premium GLB/GLTF product model section backed by Vercel Blob assets.', 'Commerce', '{"title":{"type":"string"},"body":{"type":"string"},"assetUrl":{"type":"asset"},"scale":{"type":"number"},"autoRotate":{"type":"boolean"},"environment":{"type":"string"}}'::jsonb, '{"title":"Explore every detail","body":"A closer look at the craftsmanship, materials and form.","assetUrl":"","scale":1.6,"autoRotate":true,"environment":"city"}'::jsonb, '{"scope":"tenant","supports":["modelViewer","lighting","commerce"]}'::jsonb, true, NOW(), NOW()),
('cmp_lead', 'tenant_main', 'user_founder', 'lead', 'Lead capture', 'Contact capture block connected to Lead API.', 'Forms', '{"title":{"type":"string"},"placeholder":{"type":"string"}}'::jsonb, '{"title":"Join the private list","placeholder":"email@brand.com"}'::jsonb, '{"scope":"tenant","supports":["notifications","analytics"]}'::jsonb, true, NOW(), NOW())
ON CONFLICT ("type") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "label" = EXCLUDED."label", "description" = EXCLUDED."description", "category" = EXCLUDED."category", "schema" = EXCLUDED."schema", "defaults" = EXCLUDED."defaults", "metadata" = EXCLUDED."metadata", "isActive" = true, "updatedAt" = NOW();

-- Template
INSERT INTO "Template" ("id", "tenantId", "userId", "name", "slug", "industry", "description", "isPremium", "metadata", "theme", "sections", "createdAt", "updatedAt")
VALUES ('tpl_maison_retail', 'tenant_main', 'user_founder', 'Maison Retail', 'maison-retail', 'Luxury retail', 'Premium storefront with products, story and search-ready sections.', false, '{"scope":"tenant","seed":true}'::jsonb, '{"background":"#F8F6F0","accent":"#D4AF37","text":"#1a1a1a","fonts":{"heading":"Playfair Display","body":"Inter"}}'::jsonb, '[{"id":"tpl-hero","type":"hero","props":{"eyebrow":"Luxury retail","title":"Maison Retail","body":"A polished storefront for premium products.","cta":"Shop collection"}},{"id":"tpl-story","type":"scrollStory","props":{"eyebrow":"Story","title":"A launch told beautifully","body":"Use motion, media and chapters to guide customers through the product story."}},{"id":"tpl-products","type":"products","props":{"title":"Featured collection","limit":3}}]'::jsonb, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "sections" = EXCLUDED."sections", "updatedAt" = NOW();

-- Starter website/page
INSERT INTO "Website" ("id", "tenantId", "userId", "ownerId", "name", "slug", "status", "industry", "theme", "metadata", "createdAt", "updatedAt")
VALUES ('web_maison_aurelia', 'tenant_main', 'user_founder', 'user_founder', 'Maison Aurelia', 'maison-aurelia', 'Draft', 'Luxury retail', '{"background":"#F8F6F0","accent":"#D4AF37","text":"#1a1a1a","fonts":{"heading":"Playfair Display","body":"Inter"}}'::jsonb, '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "updatedAt" = NOW();

INSERT INTO "Page" ("id", "tenantId", "userId", "websiteId", "title", "path", "sections", "seo", "createdAt", "updatedAt")
VALUES ('page_home_maison', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Home', '/', '[{"id":"home-hero","type":"hero","props":{"eyebrow":"Seeded workspace","title":"Maison Aurelia","body":"A premium storefront with story, products and polished search settings.","cta":"Shop collection"}},{"id":"home-story","type":"scrollStory","props":{"eyebrow":"Story","title":"A journey told in motion","body":"Use image or video chapters to guide visitors through your brand story.","mediaUrl":"","mediaType":"video","chapters":[{"title":"Opening moment","body":"Introduce the mood and promise."},{"title":"Craft and detail","body":"Show materials, process and value."},{"title":"Invitation","body":"Guide visitors to the next step."}]}},{"id":"home-products","type":"products","props":{"title":"Featured products","limit":3}},{"id":"home-lead","type":"lead","props":{"title":"Join the private list","placeholder":"email@brand.com"}}]'::jsonb, '{"title":"Maison Aurelia | Premium Storefront","description":"A refined storefront for premium products, storytelling and customer conversion.","keywords":["luxury retail","premium storefront","Maison Aurelia"],"structuredDataType":"Store"}'::jsonb, NOW(), NOW())
ON CONFLICT ("websiteId", "path") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "sections" = EXCLUDED."sections", "seo" = EXCLUDED."seo", "updatedAt" = NOW();

-- Products and variants
INSERT INTO "Product" ("id", "tenantId", "userId", "websiteId", "name", "slug", "description", "price", "currency", "stock", "sku", "status", "metadata", "createdAt", "updatedAt") VALUES
('prod_noir_lamp', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Noir Lamp', 'noir-lamp', 'A sculptural lamp with a soft architectural glow.', 24000, 'usd', 14, 'NOIR-LAMP', 'Active', '{"imageUrl":"","seed":true}'::jsonb, NOW(), NOW()),
('prod_champagne_chair', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Champagne Chair', 'champagne-chair', 'A refined chair with champagne-toned detailing.', 89000, 'usd', 6, 'CHAMP-CHAIR', 'Active', '{"imageUrl":"","seed":true}'::jsonb, NOW(), NOW()),
('prod_silk_serum', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Silk Serum', 'silk-serum', 'A botanical serum with a smooth, luminous finish.', 7600, 'usd', 33, 'SILK-SERUM', 'Active', '{"imageUrl":"","seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("websiteId", "slug") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "stock" = EXCLUDED."stock", "status" = EXCLUDED."status", "updatedAt" = NOW();

INSERT INTO "ProductVariant" ("id", "tenantId", "userId", "productId", "name", "sku", "price", "stock", "metadata", "createdAt", "updatedAt") VALUES
('var_lamp_noir', 'tenant_main', 'user_founder', 'prod_noir_lamp', 'Noir', 'NOIR-LAMP-BLACK', 24000, 8, '{"color":"black"}'::jsonb, NOW(), NOW()),
('var_lamp_champagne', 'tenant_main', 'user_founder', 'prod_noir_lamp', 'Champagne', 'NOIR-LAMP-CHAMP', 26000, 6, '{"color":"champagne"}'::jsonb, NOW(), NOW()),
('var_serum_30ml', 'tenant_main', 'user_founder', 'prod_silk_serum', '30ml', 'SILK-SERUM-30', 7600, 20, '{"size":"30ml"}'::jsonb, NOW(), NOW()),
('var_serum_50ml', 'tenant_main', 'user_founder', 'prod_silk_serum', '50ml', 'SILK-SERUM-50', 11600, 13, '{"size":"50ml"}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "tenantId" = EXCLUDED."tenantId", "userId" = EXCLUDED."userId", "stock" = EXCLUDED."stock", "price" = EXCLUDED."price", "updatedAt" = NOW();

-- Example lead/order/usage/generation checkpoint
INSERT INTO "Lead" ("id", "tenantId", "userId", "websiteId", "name", "email", "source", "status", "metadata", "createdAt", "updatedAt")
VALUES ('lead_sophia', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Sophia Chen', 'sophia@example.com', 'Homepage form', 'New', '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Order" ("id", "tenantId", "userId", "websiteId", "customerName", "customerEmail", "total", "currency", "status", "items", "metadata", "createdAt", "updatedAt")
VALUES ('order_seed_1001', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'Olivia Hart', 'olivia@example.com', 31600, 'usd', 'Paid', '[{"productId":"prod_noir_lamp","quantity":1},{"productId":"prod_silk_serum","quantity":1}]'::jsonb, '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "GenerationJob" ("id", "tenantId", "userId", "websiteId", "type", "prompt", "status", "currentStep", "result", "metadata", "createdAt", "updatedAt")
VALUES ('gen_seed_job', 'tenant_main', 'user_founder', 'web_maison_aurelia', 'website', 'Seed example generation job', 'Completed', 'completed', '{"seed":true}'::jsonb, '{"seed":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "status" = EXCLUDED."status", "updatedAt" = NOW();

INSERT INTO "GenerationStep" ("id", "tenantId", "userId", "jobId", "name", "status", "input", "output", "createdAt", "updatedAt")
VALUES ('gen_seed_step', 'tenant_main', 'user_founder', 'gen_seed_job', 'seed_completed', 'Completed', '{}'::jsonb, '{"ok":true}'::jsonb, NOW(), NOW())
ON CONFLICT ("jobId", "name") DO UPDATE SET "status" = EXCLUDED."status", "updatedAt" = NOW();

COMMIT;
