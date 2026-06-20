# Aurelia AI — Premium DB-Driven AI Website Builder SaaS MVP

This project has been upgraded from a static prototype into a **Next.js 14, API-first, DB-driven SaaS foundation**.

The app is no longer powered by mock arrays for core SaaS data. Websites, pages, sections, component definitions, templates, products, leads, orders, subscriptions and publish versions are modeled in Prisma and accessed through API/server data layers.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS premium design system
- Prisma ORM
- PostgreSQL/Supabase-ready schema
- Metadata-driven component registry
- API routes for websites, pages, products, leads, orders, templates, components and publish
- AI generation API contract, ready for OpenAI wiring

## Run Locally

```bash
npm install
cp .env.example .env
# Set DATABASE_URL to Supabase/Postgres
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open:

```txt
http://localhost:3000
```

## DB-Driven Architecture

### Prisma models

- User
- Organization
- Membership
- Website
- Page
- Template
- ComponentDefinition
- Asset
- Product
- Lead
- Order
- PublishVersion
- Subscription

### Metadata-driven builder

Component definitions are records in the database via `ComponentDefinition`:

```txt
type
label
description
category
schema
defaults
metadata
```

Pages store a JSON section tree:

```json
[
  {
    "id": "section-id",
    "type": "hero",
    "props": {},
    "animation": {},
    "metadata": {}
  }
]
```

The builder reads component metadata from `/api/components`, reads the page JSON from Prisma, edits locally, and persists through:

```txt
PATCH /api/pages/:pageId
```

## API Routes

```txt
GET  /api/components
GET  /api/templates
GET  /api/websites
POST /api/websites
GET  /api/websites/:websiteId
PATCH /api/websites/:websiteId
DELETE /api/websites/:websiteId
PATCH /api/pages/:pageId
GET  /api/websites/:websiteId/products
POST /api/websites/:websiteId/products
GET  /api/websites/:websiteId/leads
POST /api/websites/:websiteId/leads
GET  /api/websites/:websiteId/orders
POST /api/websites/:websiteId/orders
POST /api/websites/:websiteId/publish
POST /api/ai/generate
```

## Pages

```txt
/                  Marketing landing
/login             Clerk-ready login screen
/signup            Clerk-ready signup screen
/dashboard         DB-driven website dashboard
/builder           DB-driven metadata builder
/cms/products      DB products
/cms/orders        DB orders
/cms/leads         DB leads
/templates         DB templates
/settings          Settings shell
/billing           Pricing/billing shell
```

## Important Production Notes

- `lib/auth.ts` currently creates/loads a real DB development user from `DEV_USER_EMAIL`. Replace it with Clerk `auth()` and `currentUser()` when Clerk keys are available.
- `/api/ai/generate` returns metadata-driven sections and is ready for OpenAI integration. Add `OPENAI_API_KEY` and replace the rules-engine branch with a model call.
- Uploads, Stripe checkout, custom domains and email notification routes are scaffold-ready but not yet fully wired.
- `index.html` remains only as the old preview artifact; the actual SaaS is the Next.js app.

## Vercel Deployment

This project is now optimized for Vercel hosting.

### Required Vercel environment variables

Add these in **Vercel → Project → Settings → Environment Variables**:

```env
DATABASE_URL="your-supabase-or-postgres-connection-string"
GEMINI_API_KEY="your-gemini-api-key"
BLOB_READ_WRITE_TOKEN="auto-created-by-vercel-blob-or-manually-copied"
DEV_USER_EMAIL="founder@yourdomain.com"
DEV_USER_NAME="Founder"
```

Optional model overrides:

```env
GEMINI_TEXT_MODEL="gemini-2.5-flash"
GEMINI_CODE_MODEL="gemini-2.5-pro"
GEMINI_IMAGE_MODEL="gemini-2.5-flash-image-preview"
```

### Vercel Blob

Create/connect Blob storage in Vercel:

```txt
Vercel Dashboard → Storage → Blob → Connect Project
```

The app uses Blob for:

- image uploads
- GLB/GLTF model uploads
- Gemini-generated image assets
- exported HTML files

### Gemini-powered routes

```txt
POST /api/ai/generate
```

Generates metadata-driven website JSON using Gemini.

```txt
POST /api/ai/image
```

Generates an image with Gemini and saves it to Vercel Blob, optionally indexing it as a DB Asset.

```txt
POST /api/websites/:websiteId/export
```

Uses Gemini code generation to export a premium static HTML file, then stores it in Vercel Blob.

### Public published sites

After publishing a website, view it at:

```txt
/s/:slug
```

Example:

```txt
/s/maison-aurelia
```

The public renderer reads the published DB website, page sections, products and Blob assets.

## Production Layer Added

### Clerk-ready auth

`lib/auth.ts` now checks for Clerk environment variables and mirrors the Clerk user into the `User` table. If Clerk env vars are missing, it falls back to the configured dev DB user so Vercel previews remain usable.

Required Clerk env when enabling real auth:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
```

### Stripe Billing

Added:

```txt
POST /api/billing/checkout
POST /api/billing/portal
POST /api/stripe/webhook
```

Required Stripe env:

```env
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRO_PRICE_ID=""
STRIPE_BUSINESS_PRICE_ID=""
```

The billing page now opens Stripe Checkout for Pro/Business and includes a customer portal action.

### Product CRUD

`/cms/products` now has a real DB-backed CRUD UI:

- create product
- edit product
- delete product
- status, stock, SKU, price and description

APIs:

```txt
POST   /api/websites/:websiteId/products
PATCH  /api/products/:productId
DELETE /api/products/:productId
```

### Asset Library

Added:

```txt
/assets
```

Features:

- Vercel Blob file uploads
- image and GLB/GLTF support
- Gemini image generation into Blob
- DB Asset records

### Version History

Added:

```txt
/versions
GET  /api/websites/:websiteId/versions
POST /api/versions/:versionId/restore
```

Publishing creates `PublishVersion` snapshots. Versions can be restored back into draft pages.

### First-party Analytics

Added `AnalyticsEvent` model and:

```txt
/analytics
GET  /api/websites/:websiteId/analytics
POST /api/websites/:websiteId/analytics
```

Published sites now track page views and lead-submit events.

### Published lead capture

Published site route:

```txt
/s/:slug
```

The lead form now posts real leads to DB and tracks analytics events.

## Premium Pending Layer Added

### Plan limits

Added `lib/plans.ts` with DB-backed plan checks:

- Free: 2 websites, no custom domains
- Pro: 10 websites, 3 custom domains
- Business: unlimited websites, 25 custom domains

`POST /api/websites` now enforces website limits. `POST /api/domains` enforces domain limits.

### Team and organization collaboration

Added:

```txt
/team
GET  /api/team
POST /api/team
```

This is DB-driven through `Organization` and `Membership`, with roles:

```txt
Owner, Admin, Designer, Editor, Viewer, Billing
```

### Custom domains

Added Prisma `Domain` model and:

```txt
/domains
GET  /api/domains
POST /api/domains
```

Domain records include Vercel-ready DNS metadata:

```txt
CNAME www → cname.vercel-dns.com
```

### Stripe Connect + storefront checkout

Added:

```txt
/commerce
POST /api/connect/stripe
POST /api/storefront/:slug/checkout
```

Published product cards now have a real checkout button. If the site owner has connected Stripe Express, checkout is created on the connected account and platform-fee metadata is prepared.

### A/B testing foundation

Added Prisma models:

```txt
ABTest
ABVariant
```

Added:

```txt
/ab-tests
GET  /api/ab-tests
POST /api/ab-tests
```

Experiments store metadata-driven section variants and conversion goals.

### Gemini vision: image/scene to website

Added:

```txt
POST /api/ai/vision
```

Uploads an image/screenshot/scene and asks Gemini to return metadata-driven editable website JSON using the same component registry contract.

### Published storefront improvements

Published product cards on `/s/:slug` now use:

```txt
components/commerce/BuyButton.tsx
```

Checkout route:

```txt
POST /api/storefront/:slug/checkout
```

This creates Stripe Checkout sessions from DB products.

## Search, discovery and onboarding layer

### Search Presence

Added:

```txt
/seo
PATCH /api/pages/:pageId/seo
POST  /api/seo/suggest
```

The search settings are stored in the existing `Page.seo` JSON field and include:

- search title
- meta description
- keywords
- canonical URL
- open graph image
- no-index control
- structured data type

The suggestion tool prepares refined keyword and page ideas using Gemini when available, with a local fallback when the key is missing.

### Structured data

Published pages now include JSON-LD for:

- WebSite
- Store
- Organization
- LocalBusiness
- ProductCollection
- OfferCatalog when products exist

This is rendered on:

```txt
/s/:slug
```

### Sitemap and robots

Added platform files:

```txt
/sitemap.xml
/robots.txt
```

Added per-site files:

```txt
/s/:slug/sitemap.xml
/s/:slug/robots.txt
```

The per-site robots file respects the page no-index setting.

### Tenant onboarding

Added:

```txt
/onboarding
```

The onboarding flow helps a tenant:

1. create a site
2. add products and visuals
3. review search settings
4. connect a domain
5. invite teammates

### Human user guide

Added:

```txt
/guide
docs_TOOL_GUIDE.md
```

The guide uses plain human sentences and visual illustrations to help site owners launch without technical language.

## Latest production hardening layer

### Protected routes

Added `middleware.ts`. When Clerk keys are configured, workspace routes are protected. When Clerk keys are missing, local and preview builds continue to work with the development DB user.

Protected areas include:

```txt
/dashboard
/builder
/cms
/assets
/seo
/domains
/team
/commerce
/ab-tests
/analytics
/versions
/settings
/billing
```

### Role and permission helper

Added:

```txt
lib/permissions.ts
```

This centralizes role permissions for website read/write/publish, billing, team and commerce actions.

### Scene upload inside builder

The builder generation modal now supports uploading a scene or screenshot. It calls:

```txt
POST /api/ai/vision
```

The response is converted into editable page sections and can be saved to the database.

### 3D model section

Added a metadata-driven `model3d` component definition and public renderer support. This works with Vercel Blob GLB/GLTF uploads and gives published pages a premium 3D showcase section.

### Domain verification hook

Added:

```txt
POST /api/domains/:domainId/verify
lib/vercel-domains.ts
```

If these env vars are set, the route talks to Vercel's domain APIs:

```env
VERCEL_API_TOKEN=""
VERCEL_PROJECT_ID=""
```

If they are not set, the UI still gives useful DNS instructions without breaking the app.

### Storefront order creation

Stripe checkout completion now creates DB `Order` records for storefront purchases and tracks a `checkout_completed` analytics event.

The existing billing subscription webhook behavior is preserved.

## Continuation hardening layer

### Audit logs

Added `AuditLog` model and `lib/audit.ts`. Important workspace actions now write audit records without blocking user flows.

Tracked actions now include:

- page section updates
- page search updates
- product create/update/delete
- asset uploads
- website publishing
- domain creation
- team invites
- Stripe Connect onboarding start

### Lightweight rate limiting

Added `lib/rate-limit.ts` for server-side request throttling. It currently protects high-frequency routes such as page saving, lead capture and asset uploads. For large production traffic, replace this with Upstash Redis or Vercel KV while keeping the same helper contract.

### Webhook idempotency

Added `WebhookEvent` model. Stripe webhooks now store processed event IDs and skip duplicate processed events.

### Email notifications

Added `lib/email.ts`, ready for Resend.

New env vars:

```env
RESEND_API_KEY=""
EMAIL_FROM="Aurelia <hello@yourdomain.com>"
```

Notifications now send when configured:

- new published-site lead
- new storefront order

If Resend variables are missing, email is skipped safely.

### Onboarding state

Added `OnboardingState` model and:

```txt
GET   /api/onboarding
PATCH /api/onboarding
```

The onboarding page now records current step, checklist and completion state in the database.

### Permission enforcement started

The permission helper is now applied to several important write actions:

- page section save
- page search settings save
- product create/update/delete
- asset upload
- website publish
- domain creation

Remaining write APIs should continue adopting the same `assertWebsitePermission` helper.

## Main remaining task pass

This pass completed the main remaining production pieces.

### Full sensitive write permission coverage

The permission helper is now applied to more high-risk APIs:

- website update/delete
- page section save
- page search settings
- product create/update/delete
- product asset upload
- website publish
- website export
- version restore
- domain creation
- A/B test creation

### Admin panel

Added:

```txt
/admin
lib/admin.ts
components/admin/AdminDashboard.tsx
```

Admin access is controlled by:

```env
ADMIN_EMAILS="founder@yourdomain.com,ops@yourdomain.com"
```

The admin panel shows:

- users
- websites
- subscriptions
- orders
- leads
- webhook event count
- recent audit logs
- recent webhook events

### Storefront cart

Added:

```txt
components/commerce/StorefrontCart.tsx
```

Published product cards now add items to a storefront cart instead of only starting a single-product checkout.

The existing checkout endpoint already accepts multiple items:

```txt
POST /api/storefront/:slug/checkout
```

### Inventory decrement

Stripe webhook handling now decrements product stock after successful storefront checkout.

### Product image and variant metadata

The product manager now supports:

- product image URL
- simple line-based variants

These are stored in `Product.metadata` to keep the system metadata-driven without adding unnecessary tables yet.

Published product cards use `metadata.imageUrl` when present.

### Basic A/B rendering and tracking

Published sites now load the first active A/B test, render the highest-weight variant sections and track an `ab_view` analytics event.

Added:

```txt
components/published/ABTracker.tsx
```

This keeps experiments metadata-driven through `ABTest` and `ABVariant`.

## Media storytelling refinement

### Image generation and upload

The platform supports image generation through Gemini and image upload through Vercel Blob:

```txt
POST /api/ai/image
POST /api/websites/:websiteId/assets
```

Images are stored as `Asset` records and can be used by product cards, published pages and visual sections.

### Video upload for scroll storytelling

Video upload is now supported for:

```txt
video/mp4
video/webm
```

Videos are uploaded to Vercel Blob through the asset library and builder upload flow. Upload validation now checks type and size:

- images up to 12 MB
- videos up to 80 MB
- GLB/GLTF models up to 50 MB

### Scroll Storytelling section

Added metadata-driven section type:

```txt
scrollStory
```

This section supports:

- image or video media URL
- sticky visual panel
- narrative chapters
- premium dark editorial layout
- published renderer support
- builder preview support

It is designed for product launches, case studies, brand stories and cinematic landing pages.

### Models used inside the app

The app uses Gemini through configurable environment variables:

```env
GEMINI_TEXT_MODEL="gemini-2.5-flash"
GEMINI_CODE_MODEL="gemini-2.5-pro"
GEMINI_IMAGE_MODEL="gemini-2.5-flash-image-preview"
```

These are used for site generation, code export and image creation inside the product.
