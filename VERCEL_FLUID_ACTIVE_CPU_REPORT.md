# Zia NFC — Vercel Fluid Active CPU Report

**Layihə:** `C:\Users\Ziya\Desktop\zia-nfc`  
**Tarix:** 2026-08-06  
**Metod:** Kod bazası statik analizi (API route-lar, server actions, middleware, heavy deps)  
**Qeyd:** Vercel Dashboard real metrikaları yoxlanmayıb (CLI/login yoxdur). Bu report **hansı kod yollarının Active CPU-nu çox yandırması ehtimalı** haqqındadır.

---

## Fluid Active CPU nədir?

Vercel **Fluid Compute** rejimində server funksiyaları üçün əsasən **Active CPU** (aktiv hesablama vaxtı) ölçülür:

| Növ | Nə sayılır | Nümunə |
|-----|------------|--------|
| **Active CPU** | CPU işləyən millisaniyələr | `sharp` encode, `bcrypt`, QR generate, JSON parse |
| **Wall time / duration** | Funksiya açıq qalan vaxt | Streaming chat, xarici API gözləmə |
| **Invocation count** | Neçə dəfə işə düşür | Middleware, `/api/visit`, profil ISR miss |

**Ən bahalı kombinasiya:** yüksək CPU × yüksək traffic.

---

## TOP ranking — ən çox Active CPU yandıranlar

### 🔴 1. `app/admin/actions.ts` — Sharp WebP encode + multi-upload  
**Risk: ÇOX YÜKSƏK (per invocation)**

| Fakt | Detal |
|------|--------|
| Fayl | `app/admin/actions.ts` (~1740 sətir) |
| CPU işi | `sharp`: EXIF rotate → resize → WebP (`effort: 4`) |
| Loop | Keyfiyyət azaldıb yenidən encode (fayl 20MB-dən böyük qalsa) |
| Portfolio | **Ardıcıl** gallery upload — max **30 şəkil** bir save-də |
| Body limit | `next.config.ts` → `serverActions.bodySizeLimit: "50mb"` |
| Digər CPU | `bcryptjs` salt rounds **12** (login) |

**Niyə bahalıdır?**  
Hər admin save-də bir neçə böyük şəkil server-side re-encode olunur. Bu saf Active CPU-dur (I/O deyil). 10–30 gallery şəkil = dəqiqələr səviyyəsində CPU yığılması mümkündür.

**Tövsiyə:**
1. Gallery encode-u **parallel batch** (məs. 3–4 concurrent) və ya client-side WebP-ə keçir (artıq client pre-compress var — server-i yüngülləşdir).
2. `effort: 4` → `effort: 2–3` (sürət↑, keyfiyyət demək olar eyni).
3. Admin save üçün ayrıca `maxDuration` və monitorinq.
4. `jimp` paketini sil (istifadə olunmur, cold start/bundle artıq yük).

---

### 🔴 2. `app/u/[slug]/qr/route.ts` — QRCode + Sharp composite  
**Risk: YÜKSƏK (CPU × cache miss traffic)**

| Fakt | Detal |
|------|--------|
| CPU | `qrcode` PNG buffer + `sharp` logo overlay |
| Ölçü | 384px, error correction `H` |
| Cache | `revalidate = 300` + `Cache-Control` 300s |
| Çağırış | Profil QR modal / `/u/{slug}/qr` |

**Niyə bahalıdır?**  
Hər cache miss-də native `sharp` + QR generation. NFC traffic artdıqca cold/miss-lər Active CPU yığır.

**Tövsiyə:**
1. QR-i **build/admin-save** zamanı generate edib R2/CDN-ə yaz (static URL).
2. Cache-i 300s → **86400** (slug dəyişmir; admin save-də `revalidatePath` kifayətdir).
3. SVG default ver (`format=svg`) — logo composite lazım deyilsə `sharp` işləməsin.
4. Edge-compatible pure JS QR (logo olmadan) daha ucuz ola bilər.

---

### 🟠 3. `app/api/chat/route.ts` — NVIDIA SSE streaming  
**Risk: YÜKSƏK (duration / concurrency), orta Active CPU**

| Fakt | Detal |
|------|--------|
| Runtime | `nodejs` |
| Model | `meta/llama-3.1-8b-instruct` via NVIDIA |
| Mode | `stream: true` → funksiya stream bitənə qədər açıq |
| Rate limit | 20 req / 60s / IP |

**Niyə bahalıdır?**  
Streaming proxy funksiyanı uzun müddət saxlayır. Fluid-də idle I/O Active CPU-dan az sayılır, amma:
- connection hold = concurrency slot
- parse/proxy chunk-lar = bir az CPU
- bot/spam olmadan belə chatbot landing-də tez-tez açılır

**Tövsiyə:**
1. `max_tokens: 150` artıq yaxşıdır — saxla.
2. Edge runtime + stream mümkün deyilsə, timeout/qısa cavab saxla.
3. Rate limit-i Upstash ilə real multi-instance et (indi çox vaxt in-memory).
4. Chatbot-u yalnız user açıq olanda mount et (lazy).

---

### 🟠 4. `app/u/[slug]/vcard/route.ts` (+ `app/[slug]/vcard`)  
**Risk: ORTA–YÜKSƏK (hər save klikində)**

| Fakt | Detal |
|------|--------|
| Dynamic | `export const dynamic = "force-dynamic"` — **heç cache yoxdur** |
| İş | Profile DB + **avatar full download** + base64 fold |
| Side effect | `increment_profile_save` RPC |

**Niyə bahalıdır?**  
Hər vCard yükləməsində şəkil yenidən çəkilir və base64-ə çevrilir. Avatar böyükdürsə CPU + memory + network.

**Tövsiyə:**
1. `force-dynamic` götür; `revalidate = 300` və ya tag-based cache.
2. Avatar-ı kiçik thumbnail-dən oxu (məs. 256px).
3. PHOTO xəttini optional et / lazy (əvvəl text-only vCard).

---

### 🟠 5. `app/api/wallet/route.ts` — Google Wallet multi-hop  
**Risk: ORTA (duration), aşağı–orta CPU**

| Fakt | Detal |
|------|--------|
| CPU | `jose` RS256 JWT (2 dəfə: OAuth + save) |
| Network | Sequential: token → class GET/POST → object GET/PUT/POST |
| Traffic | Yalnız "Add to Wallet" klik |

**Tövsiyə:** Class-ı bir dəfə create et, token-i qısa cache-lə (memory/KV ~50 dəq).

---

### 🟡 6. `middleware.ts` — demək olar hər request  
**Risk: ORTA (volume × edge)**

| Fakt | Detal |
|------|--------|
| Matcher | Static asset-lər istisna, **bütün path-lər** |
| Optimizasiya | Public profile (`/u`, `/r`, short slug) üçün early `next()` |
| Hələ də | Hər HTML/API request edge middleware invoke |

**Tövsiyə:** Matcher-i daralt — yalnız admin, API hardening, markdown negotiation lazım olan path-lər.

---

### 🟡 7. `VisitTracker` → `POST /api/visit`  
**Risk: ORTA (yüksək invocation count)**

| Fakt | Detal |
|------|--------|
| Yerləşmə | `app/layout.tsx` — **bütün səhifələr** |
| Client | `sessionStorage` ilə 1×/session |
| Server | Supabase RPC `increment_site_visit` və ya Storage fallback |

**Niyə bahalıdır?**  
CPU ağır deyil, amma **hər unikal session** serverless invocation + DB round-trip. Traffic artdıqca Fluid invocation/Active CPU cəmi böyüyür.

**Tövsiyə:**
1. Yalnız landing (`/`) və ya marketing path-lərdə say.
2. Client-də `navigator.sendBeacon` + edge-light counter.
3. Storage fallback-dan qaç (2 I/O: download+upload) — table/RPC mütləq işləsin.

---

### 🟡 8. `app/[slug]/page.tsx` — multi lookup cascade  
**Risk: ORTA (cache miss / bot traffic)**

ISR `revalidate = 300` yaxşıdır, amma miss/bot slug-larda:

1. `getProfileBySlug`
2. `getCarProfileBySlug`
3. `getRestaurantBySlug`

Üç sequential Supabase call = duration + bir az CPU.

**Tövsiyə:** Single RPC/view “resolve slug type” və ya parallel `Promise.all` + early exit.

---

### 🟢 9. Digər API-lər — aşağı risk

| Endpoint | Qiymət | Qeyd |
|----------|--------|------|
| `/api/checkout` | Aşağı | Polar fetch, nadir |
| `/api/orders` | Aşağı | 1 insert |
| `/api/revalidate` | Aşağı | cache bust |
| `/api/profile/track` | Aşağı–orta | Kodda client çağırışı tapılmadı (ölü ola bilər) |
| `/api/webhooks/polar` | Aşağı | nadir, HMAC |
| `/api/webhooks/lemonsqueezy` | Sıfır | 410 deprecated |
| `/api/cron/daily-visits` | Aşağı | 1×/gün, `maxDuration: 30` |

---

## Dependency / cold-start yükü

| Paket | Status | Active CPU təsiri |
|-------|--------|-------------------|
| `sharp` | **Aktiv** (admin + QR) | Ən böyük native CPU |
| `qrcode` | **Aktiv** (QR route) | Orta |
| `bcryptjs` | **Aktiv** (login) | Yüksək per login (salt 12) |
| `jimp` | **İstifadə olunmur** | Dead weight — sil |
| `jose` | Wallet JWT | Aşağı–orta |
| `@aws-sdk/client-s3` | R2 upload | Network ağır, CPU orta |
| `framer-motion` | Client | Server CPU-ya az təsir (bundle) |

`experimental.optimizePackageImports`: `lucide-react`, `framer-motion` — yaxşı.

---

## Traffic × CPU matrisası (təxmini)

```
                    Traffic volume
                 Low          High
CPU heavy    │ Admin save  │ QR miss storm* │
             │ Gallery×30  │                │
─────────────┼─────────────┼────────────────┤
CPU light    │ Cron/wallet │ Visit+middleware│
             │ Checkout    │ ISR profile OK  │
```

\*QR miss storm: bir profil viral olanda 300s cache bitəndə eyni vaxtda çox generate.

---

## Prioritetli fix planı (ROI sırası)

| # | Əməliyyat | Gözlənilən effekt |
|---|-----------|-------------------|
| 1 | Gallery/avatar encode-u yüngülləşdir (`effort↓`, parallel, client WebP) | **−40–70%** admin Active CPU |
| 2 | QR-i pre-generate + CDN, cache 24h | **−80%+** QR route CPU |
| 3 | vCard-dan `force-dynamic` + full avatar base64 götür | **−50–90%** vCard cost |
| 4 | `jimp` sil | Cold start / install kiçilir |
| 5 | Middleware matcher daralt | Edge invocation↓ |
| 6 | VisitTracker yalnız home | `/api/visit` invocation↓ |
| 7 | Chat lazy + rate limit Redis | Stream hold / abuse↓ |
| 8 | `[slug]` resolve-u bir sorğuya | Miss latency/CPU↓ |

---

## Artıq yaxşı olanlar (saxla)

- Public profil **ISR** (`revalidate = 300`) + `unstable_cache` + tags
- Public profile path-də middleware early return
- Chat `max_tokens: 150`, message sanitize, origin check
- Image formats AVIF/WebP, remotePatterns
- Admin/restoran `no-store` (düzgündür — CPU yox, security)
- Cron gündə 1 dəfə

---

## Vercel Dashboard-da yoxlama checklist

1. **Usage → Fluid Active CPU** — function path-lərə görə sort  
2. **Observability → Functions** — p95 duration:  
   - `admin/actions` (server action)  
   - `/u/[slug]/qr`  
   - `/api/chat`  
   - `/u/[slug]/vcard`  
3. **Invocations** — middleware / `/api/visit` spike  
4. Deploy-dən sonra eyni report-u 7 gün müqayisə et

---

## Qısa xülasə (AZ)

**Fluid Active CPU-nu ən çox yandıran 3 şey:**

1. **Admin Sharp WebP pipeline** (xüsusilə portfolio multi-upload)  
2. **QR route** (`qrcode` + `sharp` hər cache miss-də)  
3. **Streaming chat + force-dynamic vCard + global visit tracking** (volume/duration)

Bunları optimallaşdırmaq Vercel hesabını ən çox azaldacaq; checkout/webhook/cron demək olar problem deyil.

---

*Bu report yalnız repo koduna əsaslanır. Real $ rəqəmləri üçün Vercel project Usage paneli lazımdır.*
