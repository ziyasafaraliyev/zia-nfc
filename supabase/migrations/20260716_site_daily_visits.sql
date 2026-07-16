-- Run this in Supabase SQL Editor if not applied yet.
-- Daily site visit counters for 20:00 Telegram report (Asia/Baku).

create table if not exists public.site_daily_visits (
  visit_date date primary key,
  count integer not null default 0 check (count >= 0),
  updated_at timestamptz not null default now()
);

create or replace function public.increment_site_visit(p_date date)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.site_daily_visits (visit_date, count, updated_at)
  values (p_date, 1, now())
  on conflict (visit_date) do update
  set
    count = public.site_daily_visits.count + 1,
    updated_at = now();
end;
$$;

revoke all on function public.increment_site_visit(date) from public;
grant execute on function public.increment_site_visit(date) to service_role;

alter table public.site_daily_visits enable row level security;

drop policy if exists "Service role manages site_daily_visits" on public.site_daily_visits;
create policy "Service role manages site_daily_visits"
on public.site_daily_visits for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
