-- Separate catalog links + portfolio on/off toggle
alter table public.profiles
  add column if not exists portfolio_enabled boolean not null default true;

alter table public.profiles
  add column if not exists catalog jsonb not null default '[]'::jsonb;
