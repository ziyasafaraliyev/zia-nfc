# Zia NFC

Modern NFC business card platform for Azerbaijan.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Create the Supabase tables from `supabase/schema.sql`, then set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- Cloudflare R2 vars (`CLOUDFLARE_R2_*`) — required for image uploads

**Media architecture**

- **Cloudflare R2** — actual image/PDF files (avatars, covers, gallery, CV)
- **Supabase** — database only: stores public R2 URLs in columns like `avatar_url`, `gallery`, `cover_url`

New uploads never write to Supabase Storage. Legacy Supabase Storage URLs are still deleted if present when media is replaced or a profile/restaurant is removed.

Routes:

- `/` landing page
- `/u/[slug]` dynamic customer profile
- `/admin` single-admin dashboard
