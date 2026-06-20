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
