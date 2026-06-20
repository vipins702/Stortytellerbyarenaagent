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
