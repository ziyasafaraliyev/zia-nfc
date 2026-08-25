# Zia NFC — agent map

Read this file first. Do **not** `list_dir` the repo root or walk `node_modules/`, `public/` image dumps, `next-dev*.log`, or `scripts/*.json`. Open only the file that matches the task.

Next.js 15 App Router + React 19 + Tailwind 3 + TypeScript. Live site: `https://zianfc.vercel.app`. UI language: Azerbaijani (`az`). Brand blue: `#29AEEE` (`brand` in Tailwind). Font: Plus Jakarta Sans (ə/Ə).

```
npm run dev      # next dev -p 3000
npm run build
```

## Products

| Product | Public URL | Admin | What it is |
|---|---|---|---|
| Vizitkart | `/{slug}` or `/u/{slug}` | `/admin` | NFC digital business card + portfolio |
| Menu | `/{slug}` + `/{slug}/menyu\|sebet\|ode\|hazir` | `/restoran` | Restaurant digital menu + order flow |
| Pay | `/pay` | — | Marketing site + interactive demo (`/pay/demo`) |
| Car | `/{slug}` | `/car/admin` | Car/driver NFC sticker profile |

`/{slug}` resolver (`app/[slug]/page.tsx`) tries **profile → car → restaurant**, then 404. Same slug must not exist in two tables.

Reserved slugs (cannot be customer slugs): `admin u api login logout auth settings dashboard static _next pay car demo restoran r about privacy-policy favicon.ico robots.txt sitemap.xml`.

## Where to edit

| Task | Open these |
|---|---|
| Public profile UI | `components/profile-page-view.tsx` |
| Profile admin form | `components/profile-form.tsx` |
| Profile / restaurant / car CRUD + login | `app/admin/actions.ts` |
| Super-admin dashboard UI | `app/admin/page.tsx` |
| Restaurant public page | `app/r/[slug]/page.tsx` + `components/restaurant-menu-view.tsx` |
| Restaurant order steps | `components/restaurant-order/*` + `lib/restaurant-order.ts` + `lib/restaurant-order-page.tsx` |
| Restaurant admin | `app/restoran/page.tsx` + `components/restaurant-form.tsx` + `components/restaurant-menu-editor.tsx` |
| Car public / admin | `components/profile-car-page-view.tsx` / `components/car-form.tsx` / `app/car/admin/page.tsx` |
| Landing (4 products) | `components/main-platform-page.tsx` |
| Pay marketing | `components/pay/*` + `app/pay/page.tsx` |
| Pay demo checkout | `app/pay/demo/*` + `lib/demo-data.ts` (fake, no payment) |
| Types | `lib/types.ts` |
| URLs | `lib/urls.ts` — public NFC links are **short** `/{slug}`, not `/u/` |
| i18n | `components/language-context.tsx` — `t(az, en, de?, fr?, ru?)` |
| Media upload / delete | `lib/r2.ts` + `lib/media.ts` + `lib/upload-entry.ts` |
| Security helpers | `lib/security.ts` |
| DB schema + migrations | `supabase/schema.sql` + `supabase/migrations/` |
| Env / CSP / image hosts | `next.config.ts` |
| Edge middleware | `middleware.ts` (security + markdown homepage; **auth is not here**) |

## Routes (app/)

```
/                         landing — MainPlatformPage + WebChat
/vizitkart                vizitkart product page
/menu                     menu product page
/pay                      Zia Pay marketing
/pay/demo                 demo: skan → menyu → sebet → ode → hazir
/pay/about  /pay/privacy-policy
/admin                    super-admin (profiles). Auth: HMAC cookie zia_admin_session
/restoran                 restaurant admin (same cookie)
/car  /car/admin          car product + car admin (same cookie)
/u/[slug]                 explicit profile (+ /portfolio /qr /vcard)
/r/[slug]                 explicit restaurant (+ /menyu /sebet /ode /hazir)
/[slug]                   short NFC URL (profile | car | restaurant)
/[slug]/vcard             vCard download
/[slug]/menyu|sebet|ode|hazir   restaurant order (also under /r/[slug]/…)
/checkout/subscription    Polar checkout
/checkout/success
```

API (`app/api/`):

| Path | Role |
|---|---|
| `POST /api/chat` | Landing chatbot (NVIDIA, origin + rate limit) |
| `POST /api/checkout` | Polar.sh checkout session |
| `POST /api/orders` | Insert `restaurant_orders` row, return token |
| `POST /api/profile/track` | Increment `views_count` / `saves_count` |
| `POST /api/wallet` | Google Wallet pass JWT |
| `POST /api/revalidate` | On-demand cache revalidate |
| `GET /api/cron/daily-visits` | Vercel cron `0 16 * * *` → Telegram daily visits |
| `POST /api/webhooks/polar` | Polar payment webhook |
| `POST /api/webhooks/lemonsqueezy` | Legacy LemonSqueezy webhook |

## Data

**Supabase = DB only. Cloudflare R2 = files.** Profile/restaurant/car image + CV URLs stored in columns. New uploads never go to Supabase Storage. Legacy Storage URLs are still deleted on replace/remove.

Tables (see `lib/types.ts` + `supabase/schema.sql`):

- `profiles` — vizitkart. Public select hides `client_email` / `client_password`. Feature flags: `enabled`, `portfolio_enabled`, `wallet_enabled`, `qr_enabled`, `referral_enabled`, `stats_enabled`, `lang_switcher_enabled`, `reservation_enabled`. `gallery` = string[] **or** `PortfolioSection[]`. `catalog` = `{id,name,url}[]`.
- `restaurants` + `restaurant_reviews` (avg `rating` via trigger). `menu` JSON: categories → items.
- `car_profiles`
- `site_daily_visits`
- `restaurant_orders` (created by `/api/orders`)

Reads:

- Public: `createPublicSupabaseClient()` + RLS (`enabled = true`).
- Admin lists / writes: `createServiceSupabaseClient()`.
- Public fetchers are `cache()` + `unstable_cache` tagged: `profile:{slug}`, `restaurant:{slug}`, `car-profile:{slug}`. After save, `revalidateTag` + `revalidatePath`.

Never select `client_password` on public profile queries (`PUBLIC_PROFILE_SELECT` in `lib/profiles.ts`).

## Auth

Not NextAuth / Supabase Auth. Super-admin HMAC session in `app/admin/actions.ts`:

- Cookie: `zia_admin_session`, 8h, signed with `SESSION_SECRET`
- Login: `ADMIN_EMAIL` + password, rate-limited
- `getAdminSession()` / `isAdminAuthenticated()` — call in `/admin`, `/restoran`, `/car/admin`
- Middleware does **not** enforce auth

Client dashboards use `client_email` / `client_password` on the profile row (bcrypt). Restaurant reviews are public inserts.

## Order flow

Steps: **menyu → sebet → ode → hazir**. Cart is `localStorage` (`lib/restaurant-order.ts`). Service fee **12%**. Shared renderer: `lib/restaurant-order-page.tsx` → `components/restaurant-order/RestaurantOrderFlow.tsx`. Demo copy lives under `app/pay/demo` and does not hit the DB.

## Conventions

- Path alias: `@/` → repo root.
- Server mutations: `"use server"` in `app/admin/actions.ts`. Client forms: `components/server-action-form.tsx`. After save, redirect `?saved=1`.
- Redirects: only `safeInternalPath()` (`lib/security.ts`).
- Images: `components/smart-image.tsx`. Allow jpeg/png/webp/gif/bmp/tiff/heic. **No SVG** (XSS). Max upload 20MB; server action body 50MB.
- Motion: `lib/use-lite-motion.ts` before adding Framer Motion on public NFC pages (hot path).
- i18n: wrap user-visible strings with `t(...)`. Default lang per profile: `default_lang`.
- Public NFC `/{slug}` is latency-sensitive — do not add heavy middleware work there.
- Do not set `Cache-Control` on `/u` or `/r` HTML (breaks App Router RSC).
- Admin + `/restoran` are `no-store` + `noindex`.
- Do not invent emerald/amber/rose on admin UI; dashboard is black / white / brand blue.

## Env (names only — never commit values)

`NEXT_PUBLIC_SUPABASE_URL` `NEXT_PUBLIC_SUPABASE_ANON_KEY` `SUPABASE_SERVICE_ROLE_KEY` `ADMIN_EMAIL` `SESSION_SECRET` `NEXT_PUBLIC_SITE_URL` `CLOUDFLARE_R2_*` `POLAR_*` `GOOGLE_WALLET_*` `UPSTASH_REDIS_REST_*` (optional rate-limit) Telegram vars used by `lib/visits.ts`.

## Do not

- Do not read or commit `scripts/nodal-bison-*.json` or any key/PEM.
- Do not rewrite the `/{slug}` resolver without checking all three entity types.
- Do not move public profile URLs from `/{slug}` to `/u/{slug}` — NFC cards encode the short URL (`getProfilePath`).
- Do not add new reserved slugs without updating `RESERVED_SLUGS` in `app/admin/actions.ts`.
- Do not dump `node_modules`, build logs, or binary assets into context.
