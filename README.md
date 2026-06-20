# Aurelia AI — Premium Website Builder SaaS MVP

This workspace contains a self-contained MVP prototype for a premium AI-powered website builder SaaS.

## Open the MVP

Open `index.html` in a browser, or use the Arena preview.

No installation is required. The app is intentionally built as a single-file static MVP so it previews reliably without external CDNs, fonts, APIs, databases, or network access.

## MVP Features Built

- Premium landing page inspired by Apple/Webflow/Stripe/Vercel aesthetics
- Dashboard with website cards and activity feed
- Visual builder with:
  - Component library
  - Drag/drop sections into canvas
  - Add/remove/reorder sections
  - Inline content editing
  - Real-time preview
  - Luxury color presets
  - Font pairing/animation controls
  - 3D model upload placeholder
- AI generator modal with:
  - Prompt input
  - Industry selection
  - Image inspiration upload placeholder
  - Loading/progress states
  - Generated editable website canvas
- Template gallery with one-click template application
- Mini CMS with:
  - Product CRUD
  - Inventory edits
  - Lead capture simulation
  - Order status tracker
- Settings/billing page with:
  - Plan cards
  - Team invite placeholder
  - Domain connection placeholder
  - Analytics placeholder
- LocalStorage persistence
- Responsive mobile design
- Export HTML demo action
- Publish simulation

## Production Next.js Roadmap

The next step is converting this MVP prototype into the requested stack:

- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Clerk Auth + Clerk Organizations
- Supabase PostgreSQL + Prisma
- Stripe Billing, later Stripe Connect for storefront payments
- Uploadthing/Cloudinary for assets
- OpenAI for prompt-to-site generation
- React Three Fiber for 3D product/model viewer
- GSAP/Framer Motion/Lenis for production animation
- Sentry + PostHog/Vercel Analytics

## Suggested MVP Database Models

- User
- Organization
- Membership
- Website
- Page
- Section
- Asset
- Product
- Order
- Lead
- Template
- Subscription
- PublishVersion

## Notes

This is an MVP UI/application prototype, not a full backend SaaS yet. It is designed to validate the product flow and interface before wiring real auth, database, AI, billing, publishing, and storage services.
