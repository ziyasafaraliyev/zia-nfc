-- Referral link button toggle + optional custom URL (super admin)
alter table public.profiles
  add column if not exists referral_enabled boolean not null default false;

alter table public.profiles
  add column if not exists referral_url text;
