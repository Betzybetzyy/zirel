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

**REQUIRED:** Before writing any UI code — colors, typography, spacing, shadows, components, layout — read the relevant file in `docs/styles/`. Use `docs/styles.md` as the index to find the right file. Never guess design decisions; always consult the style docs first.

### Forms

All forms use **React Hook Form + Zod**. Pattern: `useForm({ resolver: zodResolver(schema) })` + `<Form {...form}>` + wrapper components.

- **Schemas:** `lib/schemas/<dominio>.ts` (centralized, typed with `z.infer`). Shared messages in `lib/schemas/messages.ts`.
- **Wrappers:** `components/form/TextField`, `SelectField`, `DateField` — auto-wire label, input, error per field via `FormProvider`.
- **UI primitives:** `components/ui/form.tsx` (Form, FormField, FormItem, FormLabel, FormControl, FormMessage).
- **Reference docs:** `docs/styles/forms.md` — full pattern, examples, and a reference Producto form for future admin CRUD.

Rules: `isSubmitting` disables submit; `form.reset()` on success; `form.setError("root", ...)` for server errors; never duplicate types from `z.infer`.

### DB

Prisma 7 with `@prisma/adapter-pg` (driver adapter, not default connector). Singleton client in `lib/prisma.ts` uses `PrismaPg` adapter. Production DB is Neon (serverless PostgreSQL). Local dev can use Docker: `docker compose up db` exposes Postgres on port 5433.

### Seed

`scripts/seed.ts` reads `seed-data/inventario.xlsx` and uploads images from `seed-data/fotos/<category>/` to Cloudinary. Pass `--skip-upload` to reuse existing Cloudinary URLs (used in Docker setup).

### Admin

Route group `app/(admin)/` contains the back-office. Auth is JWT stored in an httpOnly cookie named `session` (7-day TTL, HS256, signed with `SESSION_SECRET`). Logic lives in `lib/session.ts`.

**DAL (`lib/dal.ts`)** — always use these guards at the top of admin Server Components and Actions:
- `verifyAdmin()` — redirects to `/` if not authenticated or not ADMIN role.
- `verifySession()` — redirects to `/` if not authenticated.
- `isAuthenticated()` / `getCurrentUser()` — non-redirecting checks.

`lib/admin-ui-store.ts` — persisted Zustand store for sidebar (`collapsed`) and admin theme. Set page title/breadcrumb via the `<PageMeta />` component (not persisted).

### Feature flags

Two-layer system: static registry in `lib/feature-flags.ts` (typed, with defaults) + dynamic state in DB table `feature_flags`.

- Read in layouts/Server Components: `getFeatureFlags()` from `lib/queries.ts` → `FeatureFlagMap`.
- Admin panel at `/admin/configuracion` can toggle any flag and create dynamic ones.
- Add a static flag: append to `FEATURE_FLAGS` array; it becomes type-safe immediately and appears in admin on next toggle (upsert, no migration needed).
- Key format: `/^[a-z][a-z0-9_-]*$/`, max 50 chars.

See `docs/styles/feature-flags.md` for full pattern.

### Utilities

`lib/utils-format.ts` — `formatCLP(amount)` formats numbers as Chilean pesos (`es-CL` locale, no decimals). Use for all price display.

## Env vars

```
DATABASE_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_WHATSAPP_NUMBER   # digits only, e.g. 56912345678
SESSION_SECRET                # random 32+ char string for JWT signing
```
