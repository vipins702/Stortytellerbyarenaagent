# SaaS Architecture Diagram

This document shows the current architecture for the website builder, storefront, media pipeline, payments, analytics and deployment flow.

## High-level architecture

```mermaid
flowchart TB
  Visitor[Public Visitor] --> PublicSite[Published Site Renderer /s/:slug]
  CustomDomain[Custom Domain] --> Middleware[Host Routing Middleware]
  Middleware --> HostResolver[/host-sites/:host]
  HostResolver --> PublicSite

  User[Workspace User] --> Clerk[Clerk Google Sign-In]
  Clerk --> AppShell[Workspace App Shell]
  AppShell --> Dashboard[Dashboard]
  AppShell --> Builder[Visual Builder]
  AppShell --> CMS[CMS Products Orders Leads]
  AppShell --> SEO[Search Presence]
  AppShell --> Assets[Asset Library]
  AppShell --> Domains[Domain Manager]
  AppShell --> Experiments[A/B Tests]
  AppShell --> Admin[Admin Panel]

  Builder --> PageAPI[Page / Website APIs]
  Builder --> Gemini[Gemini Generation APIs]
  Builder --> Blob[Vercel Blob]
  Assets --> Blob
  Gemini --> Blob

  CMS --> ProductAPI[Product / Variant APIs]
  PublicSite --> Cart[Storefront Cart]
  Cart --> StripeCheckout[Stripe Checkout]
  StripeCheckout --> StripeWebhook[Stripe Webhook]

  Domains --> VercelDomains[Vercel Domains API]
  SEO --> Sitemap[Sitemap / Robots / JSON-LD]
  PublicSite --> Analytics[Analytics Events]
  Experiments --> Analytics

  PageAPI --> Prisma[Prisma ORM]
  ProductAPI --> Prisma
  StripeWebhook --> Prisma
  Analytics --> Prisma
  Domains --> Prisma
  Admin --> Prisma
  Prisma --> Postgres[(Supabase / PostgreSQL)]
```

## Core data flow

```mermaid
sequenceDiagram
  participant U as Workspace User
  participant B as Builder
  participant A as API Routes
  participant DB as PostgreSQL
  participant Blob as Vercel Blob
  participant G as Gemini

  U->>B: Edit sections or upload media
  B->>A: Save page JSON / upload asset
  A->>DB: Store website, page, sections, asset record
  A->>Blob: Store image, video, GLB or export file
  U->>B: Generate site/image/code
  B->>A: Generation request
  A->>G: Generate metadata, image or code
  G-->>A: Structured output
  A->>DB: Persist section metadata when saved
  A->>Blob: Store generated image/export when needed
```

## Storefront checkout flow

```mermaid
sequenceDiagram
  participant V as Visitor
  participant S as Published Site
  participant C as Cart
  participant API as Storefront Checkout API
  participant Stripe as Stripe Checkout
  participant WH as Stripe Webhook
  participant DB as PostgreSQL

  V->>S: Browse products
  V->>C: Add product or variant
  C->>API: Create checkout session
  API->>DB: Validate product/variant stock
  API->>Stripe: Create checkout session
  Stripe-->>V: Hosted checkout
  Stripe->>WH: checkout.session.completed
  WH->>DB: Create order
  WH->>DB: Decrement product or variant inventory
  WH->>DB: Track checkout_completed event
```

## Deployment view

```mermaid
flowchart LR
  GitHub[GitHub Repo] --> Vercel[Vercel Build + Hosting]
  Vercel --> Next[Next.js App Router]
  Vercel --> Blob[Vercel Blob]
  Next --> Supabase[(Supabase PostgreSQL)]
  Next --> Clerk[Clerk Google Auth]
  Next --> Stripe[Stripe Billing + Connect]
  Next --> Gemini[Gemini API]
  Next --> Sentry[Sentry Monitoring]
```

## Main modules

| Module | Purpose |
| --- | --- |
| Builder | Metadata-driven visual editing and section persistence |
| Assets | Vercel Blob uploads for images, videos and 3D files |
| Gemini | Website, image, vision and code generation |
| CMS | Products, variants, orders and leads |
| Storefront | Published site renderer, cart, checkout and product pages |
| SEO | Metadata, JSON-LD, sitemap and robots files |
| Domains | Custom domain records, verification and host routing |
| Analytics | Page views, lead events, checkout events and A/B events |
| Admin | Platform counts, audit logs, webhooks and recent records |
| Monitoring | Health endpoint and Sentry-ready instrumentation |
