create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  enabled boolean not null default true,
  name text not null,
  profession text,
  bio text,
  phone text,
  whatsapp text,
  instagram text,
  tiktok text,
  website text,
  facebook text,
  x text,
  linkedin text,
  youtube text,
  location text,
  location_url text,
  avatar_url text,
  background_url text,
  cover_style text not null default 'auto',
  cover_position text not null default 'center',
  gallery text[] not null default '{}',
  theme text not null default 'light',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  cv_url text,
  client_email text,
  client_password text,
  reservation_enabled boolean default false
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  enabled boolean not null default true,
  name text not null,
  description text,
  phone text,
  instagram text,
  tiktok text,
  facebook text,
  menu_url text,
  location_name text,
  location_url text,
  avatar_url text,
  cover_url text,
  cover_style text not null default 'auto',
  cover_position text not null default 'center',
  gallery text[] not null default '{}',
  theme text not null default 'light',
  revenue numeric default 0,
  orders_count integer default 0,
  rating numeric default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists background_url text;
alter table public.profiles add column if not exists cover_style text not null default 'auto';
alter table public.profiles add column if not exists cover_position text not null default 'center';
alter table public.profiles add column if not exists facebook text;
alter table public.profiles add column if not exists x text;
alter table public.profiles add column if not exists linkedin text;
alter table public.profiles add column if not exists youtube text;
alter table public.profiles add column if not exists location_url text;
alter table public.profiles add column if not exists cv_url text;
alter table public.profiles add column if not exists theme text not null default 'light';
alter table public.profiles add column if not exists client_email text;
alter table public.profiles add column if not exists client_password text;
alter table public.profiles add column if not exists reservation_enabled boolean default false;

alter table public.profiles drop constraint if exists profiles_cover_style_check;
alter table public.profiles add constraint profiles_cover_style_check
check (cover_style in ('auto', 'square', 'banner'));

alter table public.profiles drop constraint if exists profiles_cover_position_check;
alter table public.profiles add constraint profiles_cover_position_check
check (cover_position in ('top', 'center', 'bottom'));

alter table public.profiles enable row level security;

drop policy if exists "Enabled profiles are public" on public.profiles;
create policy "Enabled profiles are public"
on public.profiles for select
using (enabled = true);

drop policy if exists "Service role manages profiles" on public.profiles;
create policy "Service role manages profiles"
on public.profiles for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists restaurants_updated_at on public.restaurants;
create trigger restaurants_updated_at
before update on public.restaurants
for each row execute function public.touch_updated_at();

insert into storage.buckets (id, name, public)
values ('profiles', 'profiles', true)
on conflict (id) do update set public = true;

drop policy if exists "Public profile images are readable" on storage.objects;
create policy "Public profile images are readable"
on storage.objects for select
using (bucket_id = 'profiles');

drop policy if exists "Service role uploads profile images" on storage.objects;
drop policy if exists "Service role manages profile images" on storage.objects;
create policy "Service role manages profile images"
on storage.objects for all
using (bucket_id = 'profiles' and auth.role() = 'service_role')
with check (bucket_id = 'profiles' and auth.role() = 'service_role');
