# ZIA NFC — Vercel Fluid Active CPU Usage Audit

**Date:** 2025-08-20  
**Project:** zia-nfc  
**Deployment:** Vercel (Next.js 15.3.0, React 19)  
**Audit Type:** Static source-code analysis only  
**Important:** This report is based on code inspection. Actual CPU usage cannot be measured from source alone. Percentages are estimates. Vercel Analytics / Vercel Observability / CPU-time logs are required to verify exact consumption.

---

## Executive Summary

This application is built with **Next.js App Router** and uses a mix of:
- **Static rendering** for marketing pages (`/`, `/vizitkart`, `/menu`, `/pay`, `/car`)
- **ISR (Incremental Static Regeneration)** for dynamic profile pages (`/u/[slug]`, `/r/[slug]`, `/[slug]`)
- **Server Components** with direct Supabase queries
- **Server Actions** for admin mutations
- **API Routes** for chat, orders, checkout, and cache revalidation
- **Edge Middleware** for security and content negotiation

The **primary CPU consumers** on Vercel are:
1. **Per-request Supabase database queries** for public profile/restaurant pages
2. **Server Actions** that perform image processing with `sharp` and multi-file uploads to R2/Supabase Storage
3. **API Route handlers** that proxy external services (NVIDIA chat, Polar.sh checkout)
4. **Sitemap generation** that queries all enabled profiles on every build/crawl
5. **Admin dashboard** that loads full profile/restaurant lists with service-role keys

---

## 1. Server Components That Execute on Every Request

### 1.1 Public Profile Pages (`/u/[slug]/page.tsx`, `/r/[slug]/page.tsx`, `/[slug]/page.tsx`)

| Attribute | Value |
|-----------|-------|
| **File** | `app/u/[slug]/page.tsx`, `app/r/[slug]/page.tsx`, `app/[slug]/page.tsx` |
| **Component** | `ProfilePage`, `RestaurantPage`, `CombinedPage` |
| **Trigger** | Every GET request to `/{slug}`, `/u/{slug}`, `/r/{slug}` |
| **Execution** | Server-side on every cold request; warm requests may be served from ISR cache |
| **CPU Consumer** | **Medium** |

**What happens:**
```typescript
// app/u/[slug]/page.tsx
export const revalidate = 600; // 10 minutes ISR
export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug); // Supabase query
```

```typescript
// app/[slug]/page.tsx
export const revalidate = 600;
export default async function CombinedPage({ params }: Props) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug); // 1st Supabase query
  // ... if not found:
  const carProfile = await getCarProfileBySlug(slug); // 2nd query
  const restaurant = await getRestaurantBySlug(slug); // 3rd query
```

**Why it consumes CPU:**
- Each cold request triggers a Supabase PostgREST query over HTTPS
- The combined `/[slug]` page can trigger **up to 3 sequential database queries** per miss
- ISR cache (`revalidate = 600`) reduces this, but cache misses after 10 minutes cause revalidation
- `unstable_cache` with `revalidate: 120` adds an additional data-cache layer, but still executes on cache miss

**Impact:** Medium. For a site with 1000 daily visits and 10-minute ISR, most requests are served from cache after initial warm-up. However, the combined slug page's sequential fallback queries are inefficient.

**Recommendation:**
- Keep `/u/[slug]` and `/r/[slug]` as canonical routes instead of the catch-all `/[slug]`
- Add `generateStaticParams()` to pre-render known slugs at build time
- Reduce `revalidate` to 300-600s is fine, but add `generateStaticParams()` for known slugs
- Consider a single lookup query or a database view to resolve profile vs restaurant in one query

---

### 1.2 Admin Dashboard (`/admin/page.tsx`)

| Attribute | Value |
|-----------|-------|
| **File** | `app/admin/page.tsx` |
| **Component** | `AdminPage` |
| **Trigger** | Every authenticated GET to `/admin` |
| **Execution** | Server-side |
| **CPU Consumer** | **High** |

**What happens:**
```typescript
const profiles = await listProfiles(); // service_role query: SELECT * FROM profiles
// For super_admin:
const restaurants = await listRestaurants(); // service_role query: SELECT * FROM restaurants
```

**Why it consumes CPU:**
- `listProfiles()` fetches **all columns** for **all profiles** using service role
- `listRestaurants()` fetches **all columns** for **all restaurants**
- No pagination, no field limiting
- Every admin page load re-fetches the full dataset
- Each row maps through `mapRestaurant()` including `parseRestaurantMenu(data.menu)` which parses JSON menu structures

**Impact:** High. As the number of profiles/restaurants grows, every admin page load becomes heavier. With 1000 profiles, this is 1000-row fetch + JSON parsing on every load.

**Recommendation:**
- Paginate admin lists
- Only select required fields for list view: `id, name, slug, enabled, created_at`
- Cache the admin list for short periods (e.g., 30s) with `unstable_cache`
- Move heavy menu parsing to client-side or only parse on detail view

---

### 1.3 Restaurant Admin Dashboard (`/restoran/page.tsx`)

| Attribute | Value |
|-----------|-------|
| **File** | `app/restoran/page.tsx` |
| **Component** | `DashboardPage` |
| **Trigger** | Every authenticated GET to `/restoran` |
| **Execution** | Server-side |
| **CPU Consumer** | **Medium** |

**What happens:**
```typescript
const restaurants = await listRestaurants(); // SELECT * FROM restaurants
```

**Why it consumes CPU:**
- Same as admin: fetches all restaurants with all columns
- Parses menu JSON for every restaurant in `countMenuItems()` and `hasBuiltInMenu()`
- Renders all restaurant cards server-side

**Impact:** Medium. Same scaling issue as admin dashboard.

**Recommendation:**
- Apply same pagination/field-limiting optimizations
- Consider caching for 30-60s

---

## 2. Sitemap Generation

### 2.1 Dynamic Sitemap (`/sitemap.xml`)

| Attribute | Value |
|-----------|-------|
| **File** | `app/sitemap.ts` |
| **Function** | `sitemap()` |
| **Trigger** | Every request to `/sitemap.xml` |
| **Execution** | Server-side |
| **CPU Consumer** | **Medium** |

**What happens:**
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicSupabaseClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("slug, updated_at")
    .eq("enabled", true)
    .order("created_at", { ascending: false });
```

**Why it consumes CPU:**
- Queries **all enabled profiles** on every sitemap request
- No caching beyond what Vercel CDN provides for `/sitemap.xml`
- Search engine crawlers and bots hit this regularly
- With many profiles, this is a full-table scan on every request

**Impact:** Medium. Not user-facing, but bot traffic can trigger frequent DB queries.

**Recommendation:**
- Add `unstable_cache` with `revalidate: 3600` (1 hour) to the sitemap function
- Or generate sitemap at build time with `generateStaticParams`
- Or write a cron that updates a cached sitemap file

---

## 3. API Routes

### 3.1 Chat API (`/api/chat/route.ts`)

| Attribute | Value |
|-----------|-------|
| **File** | `app/api/chat/route.ts` |
| **Handler** | `POST` |
| **Trigger** | Every chat message from frontend |
| **Execution** | Node.js runtime (explicit `runtime = "nodejs"`) |
| **CPU Consumer** | **High** |

**What happens:**
```typescript
export const runtime = "nodejs";
export async function POST(request: Request) {
  // Rate limiting per IP
  // Parse messages
  // Call NVIDIA API with streaming
  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "meta/llama-3.1-8b-instruct",
      messages: [...],
      temperature: 0.2,
      max_tokens: 150,
      stream: true,
    }),
  });
  return new Response(response.body, { ... });
```

**Why it consumes CPU:**
- Explicitly uses Node.js runtime, which on Vercel uses **Fluid Active CPU** (not Edge)
- Streams the response back to client
- Each request involves:
  - JSON parsing
  - Rate-limit lookup/storage
  - Upstream NVIDIA API call
  - Stream proxying
- `stream: true` means the Vercel function stays alive for the duration of the stream
- Long-running streaming = more billable CPU time

**Impact:** High. This is the most likely Fluid Active CPU consumer because:
1. It's explicitly Node.js runtime
2. It streams responses
3. It's called potentially on every homepage visit (WebChat component)

**Recommendation:**
- Verify if WebChat is loaded on every page or only homepage
- If on every page, lazy-load the WebChat component
- Consider moving to an Edge Function if possible (remove `runtime = "nodejs"`)
- Add aggressive client-side caching for chat responses
- Limit streaming duration

---

### 3.2 Checkout API (`/api/checkout/route.ts`)

| Attribute | Value |
|-----------|-------|
| **File** | `app/api/checkout/route.ts` |
| **Handler** | `POST` |
| **Trigger** | User initiates Polar.sh checkout |
| **Execution** | Server Components/Server Actions runtime |
| **CPU Consumer** | **Low** |

**Why it consumes CPU:**
- Makes an external HTTP call to Polar.sh
- Parses request/response JSON
- Low frequency (only on purchase intent)

**Impact:** Low. Infrequent, short-lived.

---

### 3.3 Orders API (`/api/orders/route.ts`)

| Attribute | Value |
|-----------|-------|
| **File** | `app/api/orders/route.ts` |
| **Handler** | `POST` |
| **Trigger** | Restaurant order creation |
| **Execution** | Server Components/Server Actions runtime |
| **CPU Consumer** | **Low** |

**Why it consumes CPU:**
- Single Supabase INSERT
- UUID generation
- Low frequency

**Impact:** Low.

---

### 3.4 Revalidate API (`/api/revalidate/route.ts`)

| Attribute | Value |
|-----------|-------|
| **File** | `app/api/revalidate/route.ts` |
| **Handler** | `POST` (and `GET`) |
| **Trigger** | After admin saves, cron jobs |
| **Execution** | Server Components/Server Actions runtime |
| **CPU Consumer** | **Medium** |

**What happens:**
```typescript
export async function POST(request: NextRequest) {
  // Auth check with CRON_SECRET or Bearer token
  revalidateTag(profileCacheTag(slug));
  revalidateTag("profiles");
  revalidatePath(`/${slug}`);
  revalidatePath(`/u/${slug}`);
  revalidatePath("/admin");
```

**Why it consumes CPU:**
- `revalidateTag` and `revalidatePath` trigger cache purges
- Each call can cause Next.js to regenerate multiple pages
- If called with broad tags like `"profiles"`, it purges all profile caches
- `revalidatePath("/admin")` on every profile save is expensive

**Impact:** Medium. Each admin save triggers revalidation of the entire admin page plus the profile page. With rapid admin edits, this can cause thundering-herd regeneration.

**Recommendation:**
- Don't revalidate `/admin` on every profile save
- Only revalidate specific profile paths
- Use `revalidateTag` with specific tags, not broad tags
- Consider debouncing rapid successive saves

---

## 4. Server Actions (Admin Mutations)

### 4.1 Admin Actions (`/app/admin/actions.ts`)

| Attribute | Value |
|-----------|-------|
| **File** | `app/admin/actions.ts` |
| **Functions** | `saveProfile`, `toggleProfile`, `deleteProfile`, `loginAdmin`, etc. |
| **Trigger** | Form submissions in admin panel |
| **Execution** | Server-side |
| **CPU Consumer** | **Very High** (during file uploads) |

**Why it consumes CPU:**
- **Image processing with `sharp`:**
  - Avatar resizing/compression
  - Cover image processing
  - Gallery image processing
  - QR code generation with `qrcode`
- **Multi-file upload handling:**
  - Gallery sections can have up to 30 images
  - Each image goes through `sharp` processing
- **R2/Supabase Storage uploads:**
  - Multiple parallel uploads
  - Old file deletion
- **Menu parsing:**
  - `parseRestaurantMenu()` parses menu JSON structures

**CPU-intensive operations:**
```typescript
// Image processing with sharp
const resized = await sharp(blob)
  .resize(width, height, { fit: "cover" })
  .jpeg({ quality: 85 })
  .toBuffer();

// QR code generation
const qrBuffer = await QRCode.toBuffer(qrData, { width: 800, margin: 2 });

// Multi-file gallery uploads
for (const file of galleryFiles) {
  const processed = await sharp(file)...
  await uploadToR2(path, processed);
}
```

**Impact:** Very High during admin saves. A single profile save with 30 gallery images can trigger:
- 30+ `sharp` operations
- 30+ R2/Supabase uploads
- Multiple DB writes
- Cache invalidation

**Recommendation:**
- Process images asynchronously/serverless-style (upload raw, process in background)
- Use a queue for image processing
- Limit parallel `sharp` operations
- Add client-side progress indication
- Consider Vercel Blob Storage for simpler uploads

---

## 5. Middleware

### 5.1 Edge Middleware (`/middleware.ts`)

| Attribute | Value |
|-----------|-------|
| **File** | `middleware.ts` |
| **Function** | `middleware()` |
| **Trigger** | Every request matching `/((?!_next/static|...).*)` |
| **Execution** | Edge Runtime |
| **CPU Consumer** | **Low** |

**What happens:**
- Path traversal checks (`..`, `%2e%2e`, `\0`, `%00`)
- Method validation
- Markdown content negotiation for `/`
- Security headers injection (redundant with `next.config.ts` for most routes)
- Cache-Control for `/admin` and `/restoran`

**Why it consumes CPU:**
- Runs on **every non-static request** at the edge
- String operations and header manipulation
- Small overhead per request

**Impact:** Low. Edge middleware is lightweight, but cumulative overhead across all routes adds up. The redundant header setting (also in `next.config.ts`) is wasteful.

**Recommendation:**
- Remove duplicate header logic from middleware since `next.config.ts` already handles it
- Keep middleware minimal: only do what `next.config.ts` cannot do
- Consider moving markdown negotiation to a separate lightweight edge function

---

## 6. Image Processing & Optimization

### 6.1 Next.js Image Optimization

| Attribute | Value |
|-----------|-------|
| **Config** | `next.config.ts` images |
| **Formats** | AVIF, WebP |
| **Remote Patterns** | `*.supabase.co/storage/v1/object/public/**`, `*.r2.dev` |

**Why it consumes CPU:**
- Next.js Image component with `sharp` backend resizes/optimizes images on first request
- Supabase Storage URLs are rewritten to `/storage/v1/render/image/public/...` in `lib/media.ts`
- These transformations happen server-side on first request per size

**Impact:** Medium. Image optimization is CPU-intensive but cached. First request for each image size is expensive; subsequent requests are fast.

**Recommendation:**
- Pre-generate common image sizes at upload time (in admin actions)
- Use `images.loader = "custom"` with an external CDN/optimizer
- Ensure `deviceSizes` and `imageSizes` are minimal

---

## 7. External API Requests

### 7.1 NVIDIA Chat API Proxy

| Attribute | Value |
|-----------|-------|
| **File** | `app/api/chat/route.ts` |
| **Endpoint** | `https://integrate.api.nvidia.com/v1/chat/completions` |
| **Runtime** | Node.js |
| **Trigger** | Chat messages from WebChat component |

**Why it consumes CPU:**
- Node.js runtime = Fluid Active CPU
- Streaming keeps function alive
- Upstream latency + streaming overhead

**Impact:** High (see Section 3.1)

---

### 7.2 Polar.sh Checkout API

| Attribute | Value |
|-----------|-------|
| **File** | `app/api/checkout/route.ts` |
| **Endpoint** | `https://api.polar.sh/v1/checkouts/` |
| **Trigger** | Purchase flow |

**Impact:** Low. Infrequent.

---

## 8. Cron Jobs / Background Tasks

### 8.1 Vercel Cron: Daily Visits

| Attribute | Value |
|-----------|-------|
| **Config** | `vercel.json` |
| **Path** | `/api/cron/daily-visits` |
| **Schedule** | `0 16 * * *` (daily at 16:00) |

**Note:** The actual `/api/cron/daily-visits` route file was not found in the scanned source tree. It may exist in a branch, be deployed from a different source, or have been removed.

**Expected behavior if present:**
- Would run once daily
- Would increment visit counters via Supabase or Storage
- Minimal CPU impact

---

## 9. Authentication Checks

### 9.1 Admin Session Verification

| Attribute | Value |
|-----------|-------|
| **File** | `app/admin/actions.ts` |
| **Function** | `getAdminSession()` |
| **Trigger** | Every `/admin` page load, every admin Server Action |

**What happens:**
```typescript
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token); // HMAC verification
  // Then DB lookup for client_admin role
}
```

**Why it consumes CPU:**
- HMAC-SHA256 computation per request
- Base64 decode
- Cookie parsing
- Optional Supabase query for client_admin role lookup

**Impact:** Low. HMAC operations are fast. The optional Supabase query adds one DB call per admin page load.

---

## 10. Heavy Computations & Inefficient Patterns

### 10.1 Sequential Fallback Queries in `/[slug]/page.tsx`

```typescript
const profile = await getProfileBySlug(slug);
if (profile?.enabled) return renderProfile();
const carProfile = await getCarProfileBySlug(slug);
if (carProfile?.enabled) return renderCar();
const restaurant = await getRestaurantBySlug(slug);
if (restaurant?.enabled) return renderRestaurant();
return notFound();
```

**Impact:** Medium. Up to 3 DB queries per cold request for non-matching slugs.

**Recommendation:**
- Use a single database function/RPC that returns the entity type + data
- Or maintain a slug-to-type mapping table

### 10.2 Menu Parsing on Every Admin Load

```typescript
// In restaurant cards
const menuItemCount = countMenuItems(restaurant.menu ?? []);
```

**Impact:** Low-Medium. JSON parsing is fast but adds up with many restaurants.

---

## 11. Third-Party Scripts & Analytics

### 11.1 Vercel Web Analytics / Speed Insights

**Not visible in source code.** If enabled in Vercel dashboard, these inject scripts that:
- Track page views client-side
- Do NOT consume server CPU (client-side only)

**Impact:** Negligible server-side.

### 11.2 WebChat Component

| Attribute | Value |
|-----------|-------|
| **File** | `components/web-chat.tsx`, `components/web-chat-app.tsx` |
| **Trigger** | Client-side mount |

**Note:** The WebChat component likely calls `/api/chat` when mounted. If it's on every page, every page visit triggers chat API calls.

**Recommendation:**
- Confirm if WebChat is only on homepage or all pages
- Lazy-load it with `dynamic()` import
- Add client-side idle delay before initializing

---

## 12. Top 10 Likely Sources of Fluid Active CPU Consumption

Based on source-code analysis, ranked by estimated CPU impact:

| Rank | Source | Estimated CPU % | Why |
|------|--------|-----------------|-----|
| 1 | `/api/chat` Node.js streaming | 25-35% | Explicit Node.js runtime, streaming, per-visit |
| 2 | Admin Server Actions (`sharp` + uploads) | 20-30% | Image processing + multi-file uploads |
| 3 | Profile/Restaurant page SSR + DB queries | 15-20% | Per-request DB queries on cold cache |
| 4 | Admin page full-table fetches | 10-15% | `SELECT *` without pagination |
| 5 | Sitemap generation | 5-10% | Full profile table scan per request |
| 6 | Image optimization (`sharp` via Next.js) | 5-10% | First-request per size |
| 7 | Revalidation cascades | 3-5% | Tag/path revalidation on admin saves |
| 8 | Middleware overhead | 2-3% | Every non-static request |
| 9 | External API proxies (Polar.sh, etc.) | 1-2% | Low frequency |
| 10 | Authentication HMAC + DB lookups | 1-2% | Per admin request |

**Total estimate:** 90-130% (these overlap; actual is 100% of Fluid Active CPU)

---

## 13. Estimated Percentage Breakdown

| Category | Estimated % | Confidence |
|----------|-------------|------------|
| **Chat API (Node.js streaming)** | 30% | Medium |
| **Admin image processing** | 25% | Medium |
| **Public page DB queries** | 20% | Medium |
| **Admin dashboard queries** | 10% | Medium |
| **Sitemap generation** | 7% | Low |
| **Image optimization** | 5% | Low |
| **Revalidation** | 3% | Low |
| **Other** | 5% | Low |

> **Note:** These are rough estimates. Actual percentages require Vercel Observability data with function-level CPU metrics.

---

## 14. Quick Wins

These can be implemented quickly with minimal code changes:

### 14.1 Cache the Sitemap
**File:** `app/sitemap.ts`  
**Change:** Wrap sitemap function in `unstable_cache` with 1-hour revalidation
```typescript
import { unstable_cache } from "next/cache";
export const revalidate = 3600;
// Or wrap the query in unstable_cache
```
**Expected Impact:** 5-10% CPU reduction on bot traffic

### 14.2 Limit Admin List Fields
**File:** `app/admin/actions.ts` (`listProfiles`, `listRestaurants`)  
**Change:** Select only needed fields for list views
```typescript
// Instead of .select("*")
.select("id, name, slug, enabled, created_at, updated_at")
```
**Expected Impact:** 10-15% CPU reduction on admin loads

### 14.3 Remove Redundant Middleware Headers
**File:** `middleware.ts`  
**Change:** Remove duplicate header setting that's already in `next.config.ts`
**Expected Impact:** 2-3% CPU reduction per request

### 14.4 Lazy-Load WebChat
**File:** `app/page.tsx` or wherever WebChat is imported  
**Change:**
```typescript
import dynamic from "next/dynamic";
const WebChat = dynamic(() => import("@/components/web-chat"), { ssr: false });
```
**Expected Impact:** 25-35% CPU reduction if WebChat is on all pages

### 14.5 Reduce `revalidate` on Admin Path
**File:** `app/api/revalidate/route.ts`  
**Change:** Remove `revalidatePath("/admin")` from profile saves
**Expected Impact:** 3-5% CPU reduction

---

## 15. High-Impact Optimizations

These require more significant changes:

### 15.1 Move Chat to Edge Runtime
**File:** `app/api/chat/route.ts`  
**Change:** Remove `export const runtime = "nodejs";` and ensure no Node.js-only APIs are used
**Expected Impact:** 30% CPU reduction + faster response times

### 15.2 Async Image Processing Queue
**File:** `app/admin/actions.ts`  
**Change:** Upload raw images immediately, process with `sharp` in a background job or Vercel Cron
**Expected Impact:** 20-25% CPU reduction during admin saves

### 15.3 Generate Static Profiles at Build Time
**File:** `app/u/[slug]/page.tsx`, `app/r/[slug]/page.tsx`  
**Change:** Add `generateStaticParams()` to pre-render known slugs
```typescript
export async function generateStaticParams() {
  const supabase = createPublicSupabaseClient();
  const { data } = await supabase.from("profiles").select("slug").eq("enabled", true);
  return data?.map(p => ({ slug: p.slug })) ?? [];
}
```
**Expected Impact:** 15-20% CPU reduction on cache misses

---

## 16. Potentially Unnecessary Server Execution

### 16.1 Homepage Markdown Negotiation
**File:** `middleware.ts`  
**Issue:** Every request to `/` checks `Accept: text/markdown` header. This is only relevant for AI agents.
**Recommendation:** Move to a dedicated edge function or check User-Agent

### 16.2 Profile/Restaurant Dual Fetch in `/[slug]/page.tsx`
**Issue:** The combined slug page tries profile, car, then restaurant sequentially. Most slugs are either profiles or restaurants, not both.
**Recommendation:** Use a single database lookup

### 16.3 `parseRestaurantMenu()` on Admin List
**Issue:** Menu JSON is parsed for every restaurant card in the admin list
**Recommendation:** Parse only when needed (detail view, menu editor)

---

## 17. Recommended Architecture Changes

### 17.1 Separate Admin and Public APIs
- Admin actions already use service-role Supabase client
- Consider moving admin to a separate Vercel project or route group (`/(admin)`)
- This allows separate CPU/memory configurations

### 17.2 Image Processing Pipeline
```
Current: Upload → sharp → upload to R2 → save DB
Better:  Upload → save to R2 → return URL → queue sharp processing → update DB
```

### 17.3 Caching Strategy
```
Public profiles: ISR (10min) + edge cache
Admin lists: Server-side cache (30s)
Sitemap: Cache (1h)
API responses: Client-side cache where possible
```

---

## 18. What Cannot Be Determined From Source Code

### 18.1 Actual CPU Usage Distribution
**Required Data:** Vercel Observability → Functions → CPU Time by endpoint

### 18.2 Edge vs Node.js Runtime Breakdown
**Required Data:** Vercel Observability → Functions → Runtime type per invocation

### 18.3 Actual ISR Cache Hit Rate
**Required Data:** Vercel Analytics → Cache hit ratio per page

### 18.4 Image Optimization CPU Cost
**Required Data:** Vercel Functions → `/next/image` endpoint CPU time

### 18.5 Real-World Request Patterns
**Required Data:** Vercel Analytics → Top pages, bot traffic vs human traffic ratio

---

## 19. Specific Code-Level Recommendations

### 19.1 `app/sitemap.ts`
```typescript
// BEFORE
export default async function sitemap() {
  const { data: profiles } = await supabase.from("profiles").select("slug, updated_at")...
}

// AFTER
import { unstable_cache } from "next/cache";
export const revalidate = 3600;
export default async function sitemap() {
  return unstable_cache(
    async () => {
      const { data: profiles } = await supabase...
      return [...staticRoutes, ...profileRoutes];
    },
    ["sitemap"],
    { revalidate: 3600 }
  )();
}
```

### 19.2 `app/admin/actions.ts` - List Functions
```typescript
// BEFORE
const { data } = await supabase.from("profiles").select("*").order("created_at");

// AFTER
const { data } = await supabase
  .from("profiles")
  .select("id, name, slug, enabled, created_at, updated_at, avatar_url")
  .order("created_at", { ascending: false })
  .limit(100); // Add pagination
```

### 19.3 `middleware.ts` - Remove Redundant Headers
```typescript
// Remove these lines (already in next.config.ts):
response.headers.set("X-Content-Type-Options", "nosniff");
response.headers.set("X-Frame-Options", "DENY");
response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
// ... etc
```

### 19.4 `app/api/chat/route.ts` - Consider Edge
```typescript
// Evaluate if streaming can be done from Edge
// Remove runtime = "nodejs" if possible
// Add timeout to prevent runaway streaming
```

---

## 20. Summary

| Area | Risk Level | Notes |
|------|-----------|-------|
| Chat API | 🔴 High | Node.js streaming = primary Fluid CPU consumer |
| Admin Actions | 🔴 High | Sharp processing + multi-file uploads |
| Public Pages | 🟡 Medium | DB queries on cold cache; ISR helps |
| Admin Dashboard | 🟡 Medium | Full-table fetches without pagination |
| Sitemap | 🟡 Medium | Un-cached full table scan |
| Middleware | 🟢 Low | Lightweight edge logic |
| Image Optimization | 🟢 Low | Cached after first request |
| External APIs | 🟢 Low | Low frequency |

**Bottom Line:** The application has several known CPU-intensive patterns that are typical of Next.js apps with server-side database queries and image processing. The most impactful optimizations are:
1. Move `/api/chat` to Edge runtime or reduce its usage
2. Make admin image processing asynchronous
3. Cache the sitemap and admin lists
4. Add `generateStaticParams()` for known slugs

**Actual Fluid Active CPU usage can only be confirmed via Vercel Observability.**
