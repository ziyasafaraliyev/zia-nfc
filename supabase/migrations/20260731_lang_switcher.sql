-- Add lang_switcher_enabled column to profiles table
-- When true, a 4-language switcher (AZ, EN, DE, FR) is shown on the public profile page
-- Can only be activated by super admin

alter table public.profiles
  add column if not exists lang_switcher_enabled boolean not null default false;
