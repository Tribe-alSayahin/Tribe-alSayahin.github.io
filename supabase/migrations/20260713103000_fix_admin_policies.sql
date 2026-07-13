create or replace function public.current_admin_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role
  from public.admin_users
  where user_id = auth.uid()
  limit 1;
$$;

create or replace function public.has_admin_role(allowed_roles text[])
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(public.current_admin_role() = any(allowed_roles), false);
$$;

create or replace function public.list_admin_users()
returns table (
  id uuid,
  user_id uuid,
  email text,
  role text,
  full_name text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.has_admin_role(array['super_admin', 'admin']) then
    raise exception 'غير مصرح لك بعرض مستخدمي الإدارة.' using errcode = '42501';
  end if;

  return query
  select
    admin_user.id,
    admin_user.user_id,
    auth_user.email::text,
    admin_user.role,
    admin_user.full_name,
    admin_user.created_at,
    admin_user.updated_at
  from public.admin_users as admin_user
  left join auth.users as auth_user on auth_user.id = admin_user.user_id
  order by admin_user.created_at desc;
end;
$$;

create or replace function public.create_admin_user(user_email text, user_role text default 'admin', user_full_name text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_user_id uuid;
begin
  if not public.has_admin_role(array['super_admin']) then
    raise exception 'غير مصرح لك بإضافة مستخدم إداري.' using errcode = '42501';
  end if;

  if coalesce(btrim(user_email), '') = '' then
    raise exception 'البريد الإلكتروني مطلوب.';
  end if;

  if user_role not in ('super_admin', 'admin', 'editor') then
    raise exception 'الدور المحدد غير صالح.';
  end if;

  select id
  into target_user_id
  from auth.users
  where lower(email) = lower(btrim(user_email))
  limit 1;

  if target_user_id is null then
    raise exception 'لا يوجد مستخدم بهذا البريد الإلكتروني في نظام الدخول.';
  end if;

  if exists (
    select 1
    from public.admin_users
    where user_id = target_user_id
  ) then
    raise exception 'هذا المستخدم مضاف مسبقاً في لوحة الإدارة.';
  end if;

  insert into public.admin_users (user_id, role, full_name)
  values (target_user_id, user_role, nullif(btrim(user_full_name), ''));
end;
$$;

create or replace function public.update_admin_user_role(admin_user_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_role text;
  super_admin_count integer;
begin
  if not public.has_admin_role(array['super_admin']) then
    raise exception 'غير مصرح لك بتعديل صلاحيات المستخدمين.' using errcode = '42501';
  end if;

  if new_role not in ('super_admin', 'admin', 'editor') then
    raise exception 'الدور المحدد غير صالح.';
  end if;

  select role
  into target_role
  from public.admin_users
  where id = admin_user_id
  limit 1;

  if target_role is null then
    raise exception 'المستخدم الإداري المطلوب غير موجود.';
  end if;

  if target_role = 'super_admin' and new_role <> 'super_admin' then
    select count(*)
    into super_admin_count
    from public.admin_users
    where role = 'super_admin';

    if super_admin_count = 1 then
      raise exception 'لا يمكن خفض صلاحية المشرف العام الوحيد.';
    end if;
  end if;

  update public.admin_users
  set role = new_role,
      updated_at = now()
  where id = admin_user_id;
end;
$$;

create or replace function public.delete_admin_user(admin_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_role text;
  super_admin_count integer;
begin
  if not public.has_admin_role(array['super_admin']) then
    raise exception 'غير مصرح لك بحذف المستخدمين الإداريين.' using errcode = '42501';
  end if;

  select role
  into target_role
  from public.admin_users
  where id = admin_user_id
  limit 1;

  if target_role is null then
    raise exception 'المستخدم الإداري المطلوب غير موجود.';
  end if;

  if target_role = 'super_admin' then
    select count(*)
    into super_admin_count
    from public.admin_users
    where role = 'super_admin';

    if super_admin_count = 1 then
      raise exception 'لا يمكن حذف المشرف العام الوحيد.';
    end if;
  end if;

  delete from public.admin_users
  where id = admin_user_id;
end;
$$;

grant execute on function public.current_admin_role() to authenticated;
grant execute on function public.has_admin_role(text[]) to authenticated;
grant execute on function public.list_admin_users() to authenticated;
grant execute on function public.create_admin_user(text, text, text) to authenticated;
grant execute on function public.update_admin_user_role(uuid, text) to authenticated;
grant execute on function public.delete_admin_user(uuid) to authenticated;

drop policy if exists "Super admin can insert posts" on public.admin_posts;
create policy "Super admin can insert posts"
on public.admin_posts
for insert
to authenticated
with check (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Super admin can update posts" on public.admin_posts;
create policy "Super admin can update posts"
on public.admin_posts
for update
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']))
with check (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Super admin can delete posts" on public.admin_posts;
create policy "Super admin can delete posts"
on public.admin_posts
for delete
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Public can read admin users" on public.admin_users;
drop policy if exists "Authenticated can read admin users" on public.admin_users;
drop policy if exists "Super admin can manage admin users" on public.admin_users;

create policy "Users can read own admin role"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']));

create policy "Super admin can insert admin users"
on public.admin_users
for insert
to authenticated
with check (public.has_admin_role(array['super_admin']));

create policy "Super admin can update admin users"
on public.admin_users
for update
to authenticated
using (public.has_admin_role(array['super_admin']))
with check (public.has_admin_role(array['super_admin']));

create policy "Super admin can delete admin users"
on public.admin_users
for delete
to authenticated
using (public.has_admin_role(array['super_admin']));

drop policy if exists "Admin can manage comments" on public.comments;
create policy "Admin can manage comments"
on public.comments
for all
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']))
with check (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Authenticated can upload media" on public.media;
create policy "Authenticated can upload media"
on public.media
for insert
to authenticated
with check (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Admin can delete media" on public.media;
create policy "Admin can delete media"
on public.media
for delete
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Admin can read analytics" on public.analytics;
create policy "Admin can read analytics"
on public.analytics
for select
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Admin can read logs" on public.admin_logs;
create policy "Admin can read logs"
on public.admin_logs
for select
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Admins can manage events" on public.admin_events;
create policy "Admins can manage events"
  on public.admin_events
  for all
  to authenticated
  using (public.has_admin_role(array['super_admin', 'admin']))
  with check (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Admins can manage event images" on public.admin_event_images;
create policy "Admins can manage event images"
  on public.admin_event_images
  for all
  to authenticated
  using (public.has_admin_role(array['super_admin', 'admin']))
  with check (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Admins can upload events bucket" on storage.objects;
create policy "Admins can upload events bucket"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'events'
    and public.has_admin_role(array['super_admin', 'admin'])
  );

drop policy if exists "Admins can update events bucket" on storage.objects;
create policy "Admins can update events bucket"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'events'
    and public.has_admin_role(array['super_admin', 'admin'])
  )
  with check (
    bucket_id = 'events'
    and public.has_admin_role(array['super_admin', 'admin'])
  );

drop policy if exists "Admins can delete events bucket" on storage.objects;
create policy "Admins can delete events bucket"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'events'
    and public.has_admin_role(array['super_admin', 'admin'])
  );

notify pgrst, 'reload schema';
