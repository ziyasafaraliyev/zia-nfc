-- Telegram social link on public profiles
alter table public.profiles
  add column if not exists telegram text;
