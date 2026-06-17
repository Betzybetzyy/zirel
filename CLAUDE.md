# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build (Turbopack)
npm run lint         # ESLint
npm run db:seed      # seed from seed-data/inventario.xlsx + upload to Cloudinary
npm run db:seed -- --only=ANI-001,ANI-002  # re-seed specific SKUs
npx prisma generate  # regenerate client after schema changes
npx prisma db push   # push schema to DB (no migration file)
npx prisma studio    # DB browser UI
```

## Architecture

**Next.js 16** app router, React 19, Turbopack. No tests exist.

### Data flow

All DB reads go through `lib/queries.ts` (thin Prisma wrappers). Writes happen only via Server Actions in `app/actions/`. Prices are always verified server-side against DB in `createOrder` — never trust client-sent prices.

### Cart

Client-only Zustand store (`lib/cart-store.ts`) persisted to `localStorage` as `zirel-cart`. No server session. Cart data is passed to `createOrder` but prices are re-fetched from DB.

### Checkout flow

`/carrito` → `/checkout` (form + `createOrder` Server Action) → `/pedido-confirmado` (shows order number + WhatsApp deep-link built by `lib/whatsapp.ts`). Order is saved to DB regardless of WhatsApp; `whatsappSent` flag is always `false` (not yet automated).

### Images

Cloudinary only. `ProductImage.url` stores the Cloudinary URL. `next.config.ts` allowlists `res.cloudinary.com`. Product cards use a two-layer frame: outer beige bg + inner white container + `object-contain`. Do **not** use `mix-blend-multiply` on product images (tints silver jewelry).

### Styling

Tailwind v4 + shadcn/ui. Brand palette defined as CSS custom properties in `app/globals.css` under `/* === Paleta Zirel === */`. Always use these vars (`--zirel-*`) rather than arbitrary hex values. Fonts: `Libre_Baskerville` (headings) and `Nunito_Sans` (body).

### DB

Prisma 7 with `@prisma/adapter-pg` (driver adapter, not default connector). Singleton client in `lib/prisma.ts` uses `PrismaPg` adapter. Production DB is Neon (serverless PostgreSQL). Local dev can use Docker: `docker compose up db` exposes Postgres on port 5433.

### Seed

`scripts/seed.ts` reads `seed-data/inventario.xlsx` and uploads images from `seed-data/fotos/<category>/` to Cloudinary. Pass `--skip-upload` to reuse existing Cloudinary URLs (used in Docker setup).

## Env vars

```
DATABASE_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_WHATSAPP_NUMBER   # digits only, e.g. 56912345678
```
