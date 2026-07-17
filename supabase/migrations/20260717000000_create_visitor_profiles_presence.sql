create table if not exists public.visitor_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  provider text not null default 'unknown',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists visitor_profiles_last_seen_idx
  on public.visitor_profiles (last_seen_at desc);

alter table public.visitor_profiles enable row level security;

create or replace function public.upsert_visitor_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.visitor_profiles (
    user_id,
    full_name,
    email,
    avatar_url,
    provider,
    created_at,
    updated_at,
    last_seen_at
  )
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'name'), '')
    ),
    new.email,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'avatar_url'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'picture'), '')
    ),
    coalesce(
      nullif(btrim(new.raw_app_meta_data ->> 'provider'), ''),
      nullif(btrim(new.raw_app_meta_data -> 'providers' ->> 0), ''),
      'unknown'
    ),
    coalesce(new.created_at, now()),
    now(),
    now()
  )
  on conflict (user_id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      avatar_url = excluded.avatar_url,
      provider = excluded.provider,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_visitor_profile_after_auth_change on auth.users;
create trigger sync_visitor_profile_after_auth_change
after insert or update of email, raw_user_meta_data, raw_app_meta_data
on auth.users
for each row
execute function public.upsert_visitor_profile_from_auth();

insert into public.visitor_profiles (
  user_id,
  full_name,
  email,
  avatar_url,
  provider,
  created_at,
  updated_at,
  last_seen_at
)
select
  auth_user.id,
  coalesce(
    nullif(btrim(auth_user.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(auth_user.raw_user_meta_data ->> 'name'), '')
  ),
  auth_user.email,
  coalesce(
    nullif(btrim(auth_user.raw_user_meta_data ->> 'avatar_url'), ''),
    nullif(btrim(auth_user.raw_user_meta_data ->> 'picture'), '')
  ),
  coalesce(
    nullif(btrim(auth_user.raw_app_meta_data ->> 'provider'), ''),
    nullif(btrim(auth_user.raw_app_meta_data -> 'providers' ->> 0), ''),
    'unknown'
  ),
  auth_user.created_at,
  now(),
  coalesce(auth_user.last_sign_in_at, auth_user.created_at, now())
from auth.users as auth_user
on conflict (user_id) do update
set full_name = excluded.full_name,
    email = excluded.email,
    avatar_url = excluded.avatar_url,
    provider = excluded.provider,
    updated_at = now();

create or replace function public.sync_my_visitor_profile()
returns table (
  user_id uuid,
  full_name text,
  email text,
  avatar_url text,
  provider text,
  created_at timestamptz,
  updated_at timestamptz,
  last_seen_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  auth_account auth.users%rowtype;
begin
  if auth.uid() is null then
    raise exception 'يجب تسجيل الدخول أولاً.' using errcode = '42501';
  end if;

  select *
  into auth_account
  from auth.users
  where id = auth.uid();

  if auth_account.id is null then
    raise exception 'تعذر العثور على الحساب المسجل.' using errcode = '42501';
  end if;

  insert into public.visitor_profiles as profile (
    user_id,
    full_name,
    email,
    avatar_url,
    provider,
    created_at,
    updated_at,
    last_seen_at
  )
  values (
    auth_account.id,
    coalesce(
      nullif(btrim(auth_account.raw_user_meta_data ->> 'full_name'), ''),
      nullif(btrim(auth_account.raw_user_meta_data ->> 'name'), '')
    ),
    auth_account.email,
    coalesce(
      nullif(btrim(auth_account.raw_user_meta_data ->> 'avatar_url'), ''),
      nullif(btrim(auth_account.raw_user_meta_data ->> 'picture'), '')
    ),
    coalesce(
      nullif(btrim(auth_account.raw_app_meta_data ->> 'provider'), ''),
      nullif(btrim(auth_account.raw_app_meta_data -> 'providers' ->> 0), ''),
      'unknown'
    ),
    coalesce(auth_account.created_at, now()),
    now(),
    now()
  )
  on conflict (user_id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      avatar_url = excluded.avatar_url,
      provider = excluded.provider,
      updated_at = now(),
      last_seen_at = now();

  return query
  select
    profile.user_id,
    profile.full_name,
    profile.email,
    profile.avatar_url,
    profile.provider,
    profile.created_at,
    profile.updated_at,
    profile.last_seen_at
  from public.visitor_profiles as profile
  where profile.user_id = auth.uid();
end;
$$;

create or replace function public.list_visitor_profiles()
returns table (
  user_id uuid,
  full_name text,
  email text,
  avatar_url text,
  provider text,
  created_at timestamptz,
  last_seen_at timestamptz,
  is_online boolean
)
language plpgsql
security definer
stable
set search_path = ''
as $$
begin
  if not public.has_admin_role(array['super_admin', 'admin']) then
    raise exception 'غير مصرح لك بعرض قائمة الزوار.' using errcode = '42501';
  end if;

  return query
  select
    profile.user_id,
    profile.full_name,
    profile.email,
    profile.avatar_url,
    profile.provider,
    profile.created_at,
    profile.last_seen_at,
    profile.last_seen_at >= now() - interval '2 minutes'
  from public.visitor_profiles as profile
  order by
    (profile.last_seen_at >= now() - interval '2 minutes') desc,
    profile.last_seen_at desc;
end;
$$;

drop policy if exists "Users can read own visitor profile" on public.visitor_profiles;
create policy "Users can read own visitor profile"
on public.visitor_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can read visitor profiles" on public.visitor_profiles;
create policy "Admins can read visitor profiles"
on public.visitor_profiles
for select
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']));

revoke all on public.visitor_profiles from anon;
revoke insert, update, delete on public.visitor_profiles from authenticated;
grant select on public.visitor_profiles to authenticated;

revoke all on function public.upsert_visitor_profile_from_auth() from public;
revoke all on function public.sync_my_visitor_profile() from public;
revoke all on function public.list_visitor_profiles() from public;
grant execute on function public.sync_my_visitor_profile() to authenticated;
grant execute on function public.list_visitor_profiles() to authenticated;

create table if not exists public.visitor_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  provider text not null default 'unknown',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists visitor_profiles_last_seen_idx
  on public.visitor_profiles (last_seen_at desc);

alter table public.visitor_profiles enable row level security;

create or replace function public.upsert_visitor_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.visitor_profiles (
    user_id,
    full_name,
    email,
    avatar_url,
    provider,
    created_at,
    updated_at,
    last_seen_at
  )
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'name'), '')
    ),
    new.email,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'avatar_url'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'picture'), '')
    ),
    coalesce(
      nullif(btrim(new.raw_app_meta_data ->> 'provider'), ''),
      nullif(btrim(new.raw_app_meta_data -> 'providers' ->> 0), ''),
      'unknown'
    ),
    coalesce(new.created_at, now()),
    now(),
    now()
  )
  on conflict (user_id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      avatar_url = excluded.avatar_url,
      provider = excluded.provider,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_visitor_profile_after_auth_change on auth.users;
create trigger sync_visitor_profile_after_auth_change
after insert or update of email, raw_user_meta_data, raw_app_meta_data
on auth.users
for each row
execute function public.upsert_visitor_profile_from_auth();

insert into public.visitor_profiles (
  user_id,
  full_name,
  email,
  avatar_url,
  provider,
  created_at,
  updated_at,
  last_seen_at
)
select
  auth_user.id,
  coalesce(
    nullif(btrim(auth_user.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(auth_user.raw_user_meta_data ->> 'name'), '')
  ),
  auth_user.email,
  coalesce(
    nullif(btrim(auth_user.raw_user_meta_data ->> 'avatar_url'), ''),
    nullif(btrim(auth_user.raw_user_meta_data ->> 'picture'), '')
  ),
  coalesce(
    nullif(btrim(auth_user.raw_app_meta_data ->> 'provider'), ''),
    nullif(btrim(auth_user.raw_app_meta_data -> 'providers' ->> 0), ''),
    'unknown'
  ),
  auth_user.created_at,
  now(),
  coalesce(auth_user.last_sign_in_at, auth_user.created_at, now())
from auth.users as auth_user
on conflict (user_id) do update
set full_name = excluded.full_name,
    email = excluded.email,
    avatar_url = excluded.avatar_url,
    provider = excluded.provider,
    updated_at = now();

create or replace function public.sync_my_visitor_profile()
returns table (
  user_id uuid,
  full_name text,
  email text,
  avatar_url text,
  provider text,
  created_at timestamptz,
  updated_at timestamptz,
  last_seen_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  auth_account auth.users%rowtype;
begin
  if auth.uid() is null then
    raise exception 'يجب تسجيل الدخول أولاً.' using errcode = '42501';
  end if;

  select *
  into auth_account
  from auth.users
  where id = auth.uid();

  if auth_account.id is null then
    raise exception 'تعذر العثور على الحساب المسجل.' using errcode = '42501';
  end if;

  insert into public.visitor_profiles as profile (
    user_id,
    full_name,
    email,
    avatar_url,
    provider,
    created_at,
    updated_at,
    last_seen_at
  )
  values (
    auth_account.id,
    coalesce(
      nullif(btrim(auth_account.raw_user_meta_data ->> 'full_name'), ''),
      nullif(btrim(auth_account.raw_user_meta_data ->> 'name'), '')
    ),
    auth_account.email,
    coalesce(
      nullif(btrim(auth_account.raw_user_meta_data ->> 'avatar_url'), ''),
      nullif(btrim(auth_account.raw_user_meta_data ->> 'picture'), '')
    ),
    coalesce(
      nullif(btrim(auth_account.raw_app_meta_data ->> 'provider'), ''),
      nullif(btrim(auth_account.raw_app_meta_data -> 'providers' ->> 0), ''),
      'unknown'
    ),
    coalesce(auth_account.created_at, now()),
    now(),
    now()
  )
  on conflict (user_id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      avatar_url = excluded.avatar_url,
      provider = excluded.provider,
      updated_at = now(),
      last_seen_at = now();

  return query
  select
    profile.user_id,
    profile.full_name,
    profile.email,
    profile.avatar_url,
    profile.provider,
    profile.created_at,
    profile.updated_at,
    profile.last_seen_at
  from public.visitor_profiles as profile
  where profile.user_id = auth.uid();
end;
$$;

create or replace function public.list_visitor_profiles()
returns table (
  user_id uuid,
  full_name text,
  email text,
  avatar_url text,
  provider text,
  created_at timestamptz,
  last_seen_at timestamptz,
  is_online boolean
)
language plpgsql
security definer
stable
set search_path = ''
as $$
begin
  if not public.has_admin_role(array['super_admin', 'admin']) then
    raise exception 'غير مصرح لك بعرض قائمة الزوار.' using errcode = '42501';
  end if;

  return query
  select
    profile.user_id,
    profile.full_name,
    profile.email,
    profile.avatar_url,
    profile.provider,
    profile.created_at,
    profile.last_seen_at,
    profile.last_seen_at >= now() - interval '2 minutes'
  from public.visitor_profiles as profile
  order by
    (profile.last_seen_at >= now() - interval '2 minutes') desc,
    profile.last_seen_at desc;
end;
$$;

drop policy if exists "Users can read own visitor profile" on public.visitor_profiles;
create policy "Users can read own visitor profile"
on public.visitor_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can read visitor profiles" on public.visitor_profiles;
create policy "Admins can read visitor profiles"
on public.visitor_profiles
for select
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']));

revoke all on public.visitor_profiles from anon;
revoke insert, update, delete on public.visitor_profiles from authenticated;
grant select on public.visitor_profiles to authenticated;

revoke all on function public.upsert_visitor_profile_from_auth() from public;
revoke all on function public.sync_my_visitor_profile() from public;
revoke all on function public.list_visitor_profiles() from public;
grant execute on function public.sync_my_visitor_profile() to authenticated;
grant execute on function public.list_visitor_profiles() to authenticated;

notify pgrst, 'reload schema';

