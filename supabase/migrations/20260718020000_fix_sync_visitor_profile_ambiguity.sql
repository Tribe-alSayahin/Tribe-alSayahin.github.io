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
  on conflict on constraint visitor_profiles_pkey do update
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

grant execute on function public.sync_my_visitor_profile() to authenticated;
notify pgrst, 'reload schema';
