# Aurelia AI — Premium AI Website Builder SaaS MVP

This is now a real Next.js SaaS MVP structure, not only a single `index.html` prototype.

## Built

- Next.js 14 App Router
- TypeScript
- Tailwind CSS design system
- SaaS landing page
- Login / signup screens, ready for Clerk
- Dashboard: My Websites
- Visual Builder route with:
  - component library
  - add sections
  - drag/drop into canvas
  - inline editing
  - reorder/delete sections
  - AI generator modal
  - export/publish placeholders
  - 3D model upload placeholder
- CMS routes:
  - products
  - orders
  - leads
- Template gallery
- Settings page
- Billing/pricing page
- AI generation API route with validation and mocked response
- Prisma PostgreSQL schema for production backend
- `.env.example` for Clerk, Stripe, OpenAI, Uploadthing and database

## Run locally

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Production integrations to wire next

- Clerk auth and organizations
- Supabase PostgreSQL via Prisma
- Stripe Billing
- OpenAI GPT-4/DALL-E website generation
- Uploadthing/Cloudinary asset uploads
- React Three Fiber 3D model viewer
- Real publish pipeline and custom domains

## Important

`index.html` remains in the repo as an old static prototype, but the actual SaaS MVP is now the Next.js app under `app/`, `components/`, `lib/`, and `prisma/`.
