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

The schema also creates a public `profiles` storage bucket used by the admin panel for profile images and portfolio uploads.

Routes:

- `/` landing page
- `/u/[slug]` dynamic customer profile
- `/admin` single-admin dashboard
