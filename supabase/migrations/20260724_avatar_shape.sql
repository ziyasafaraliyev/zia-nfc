alter table public.profiles add column if not exists avatar_shape text;
update public.profiles set avatar_shape = 'square' where avatar_shape is null;
alter table public.profiles alter column avatar_shape set default 'square';
alter table public.profiles alter column avatar_shape set not null;
alter table public.profiles drop constraint if exists profiles_avatar_shape_check;
alter table public.profiles add constraint profiles_avatar_shape_check check (avatar_shape in ('square', 'circle'));
