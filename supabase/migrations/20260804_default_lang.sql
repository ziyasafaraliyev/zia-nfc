-- Add default_lang column to profiles table
-- Super admin can set the default language for each customer profile
-- Valid values: az, en, de, fr, ru (matches LANGS in language-context.tsx)
alter table public.profiles
  add column if not exists default_lang text not null default 'az';
