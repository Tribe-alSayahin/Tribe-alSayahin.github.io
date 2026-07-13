-- إعداد Supabase لقسم الإدارة: الأخبار والمناسبات
-- نفّذ هذا الملف كاملاً داخل Supabase SQL Editor

create extension if not exists pgcrypto;

-- جدول إدارة المستخدمين والصلاحيات
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null check (role in ('super_admin', 'admin', 'editor')) default 'editor',
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- جدول الأخبار والمناسبات
create table if not exists public.admin_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  content text not null,
  kind text not null check (kind in ('news', 'event')),
  status text not null check (status in ('draft', 'published')) default 'published',
  featured_image text null,
  event_date date null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users(id) on delete set null
);

-- إضافة الأعمدة المفقودة عند وجود جدول قديم
alter table public.admin_posts
  add column if not exists status text not null check (status in ('draft', 'published')) default 'published',
  add column if not exists slug text,
  add column if not exists featured_image text,
  add column if not exists updated_at timestamptz not null default now();

-- فهرس فريد على slug (يسمح بقيم null متعددة)
create unique index if not exists admin_posts_slug_unique_idx
  on public.admin_posts (slug);

-- تعبئة slug للمنشورات القديمة ومنع الـ null في المستقبل
-- 1. دالة slugify تولد slug من العنوان
-- 2. تحديث الصفوف التي slug فارغة
-- 3. جعل العمود NOT NULL
-- ملاحظة: إذا كان slugify(title) فارغاً (عنوان بدون أحرف أبجدية رقمية)، يُستخدم id كـ slug.

-- (ملاحظة: لا تستخدم منطق C# slug، لكن منطق SQL بسيط)

-- 1. تعبئة slug الفارغة مع معالجة التكرار
-- تولد slug من العنوان، وإذا كان مكرراً تُلحق عداد، وإذا كان العنوان لا يحتوي على أحرف أبجدية رقمية تُستخدم id.
DO $$
DECLARE
  rec record;
  base_slug text;
  final_slug text;
  counter int;
BEGIN
  FOR rec IN
    SELECT id, title
    FROM public.admin_posts
    WHERE slug IS NULL
    ORDER BY created_at
  LOOP
    base_slug := lower(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(rec.title, '\s+', '-', 'g'),
            '[^[:alnum:]-]', '', 'g'
          ),
          '-+', '-', 'g'
        ),
        '^-|-$', '', 'g'
      )
    );

    IF base_slug = '' THEN
      final_slug := rec.id::text;
    ELSE
      final_slug := base_slug;
      counter := 1;
      WHILE EXISTS (
        SELECT 1 FROM public.admin_posts WHERE slug = final_slug AND id <> rec.id
      ) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
      END LOOP;
    END IF;

    UPDATE public.admin_posts SET slug = final_slug WHERE id = rec.id;
  END LOOP;
END $$;

-- 2. جعل slug NOT NULL بعد التعبئة
alter table public.admin_posts
  alter column slug set not null;

alter table public.admin_posts
  drop constraint if exists admin_posts_created_by_fkey;

alter table public.admin_posts
  add constraint admin_posts_created_by_fkey
  foreign key (created_by) references auth.users(id) on delete set null;

-- فهرس على created_at لتسريع الاستعلامات المرتّبة بالتاريخ
create index if not exists admin_posts_created_at_idx
  on public.admin_posts (created_at desc);

create index if not exists admin_posts_status_idx
  on public.admin_posts (status);

create index if not exists admin_posts_kind_idx
  on public.admin_posts (kind);

alter table public.admin_posts enable row level security;

drop policy if exists "Public can read posts" on public.admin_posts;
create policy "Public can read posts"
on public.admin_posts
for select
to public
using (status = 'published');

drop policy if exists "Super admin can insert posts" on public.admin_posts;
create policy "Super admin can insert posts"
on public.admin_posts
for insert
to authenticated
with check (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role = 'super_admin'
  )
);

drop policy if exists "Super admin can update posts" on public.admin_posts;
create policy "Super admin can update posts"
on public.admin_posts
for update
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role = 'super_admin'
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role = 'super_admin'
  )
);

drop policy if exists "Super admin can delete posts" on public.admin_posts;
create policy "Super admin can delete posts"
on public.admin_posts
for delete
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role = 'super_admin'
  )
);

-- جدول إدارة المستخدمين والصلاحيات
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null check (role in ('super_admin', 'admin', 'editor')) default 'editor',
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_users_user_id_idx
  on public.admin_users (user_id);

create index if not exists admin_users_role_idx
  on public.admin_users (role);

alter table public.admin_users enable row level security;

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
drop policy if exists "Users can read own admin role" on public.admin_users;
drop policy if exists "Admins can read admin users" on public.admin_users;
drop policy if exists "Super admin can insert admin users" on public.admin_users;
drop policy if exists "Super admin can update admin users" on public.admin_users;
drop policy if exists "Super admin can delete admin users" on public.admin_users;

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

-- جدول التعليقات
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.admin_posts(id) on delete cascade,
  user_id uuid null references auth.users(id) on delete set null,
  author_name text,
  content text not null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comments_post_id_idx
  on public.comments (post_id);

create index if not exists comments_status_idx
  on public.comments (status);

alter table public.comments enable row level security;

drop policy if exists "Public can read approved comments" on public.comments;
create policy "Public can read approved comments"
on public.comments
for select
to public
using (status = 'approved');

drop policy if exists "Authenticated can insert comments" on public.comments;
create policy "Authenticated can insert comments"
on public.comments
for insert
to authenticated
with check (auth.uid() is not null or author_name is not null);

drop policy if exists "Admin can manage comments" on public.comments;
create policy "Admin can manage comments"
on public.comments
for all
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']))
with check (public.has_admin_role(array['super_admin', 'admin']));

-- جدول الوسائط (الصور والملفات)
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text not null,
  file_size bigint,
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists media_uploaded_by_idx
  on public.media (uploaded_by);

create index if not exists media_file_type_idx
  on public.media (file_type);

alter table public.media enable row level security;

drop policy if exists "Public can read media" on public.media;
create policy "Public can read media"
on public.media
for select
to public
using (true);

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

-- جدول الإحصائيات
create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_data jsonb,
  user_id uuid null references auth.users(id) on delete set null,
  session_id text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_event_type_idx
  on public.analytics (event_type);

create index if not exists analytics_created_at_idx
  on public.analytics (created_at desc);

alter table public.analytics enable row level security;

drop policy if exists "Public can insert analytics" on public.analytics;
create policy "Public can insert analytics"
on public.analytics
for insert
to public
with check (true);

drop policy if exists "Admin can read analytics" on public.analytics;
create policy "Admin can read analytics"
on public.analytics
for select
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']));

-- جدول سجل النشاطات الإدارية
create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid null,
  details jsonb null,
  created_at timestamptz not null default now()
);

create index if not exists admin_logs_user_id_idx
  on public.admin_logs (user_id);

create index if not exists admin_logs_created_at_idx
  on public.admin_logs (created_at desc);

alter table public.admin_logs enable row level security;

drop policy if exists "Admin can read logs" on public.admin_logs;
create policy "Admin can read logs"
on public.admin_logs
for select
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Admin can insert logs" on public.admin_logs;
create policy "Admin can insert logs"
on public.admin_logs
for insert
to authenticated
with check (auth.uid() is not null);

-- تحديث schema cache في PostgREST بعد إنشاء الجداول
-- يحلّ خطأ "Could not find the table" في schema cache
notify pgrst, 'reload schema';

-- =========================================================
-- نظام المناسبات والأحداث المصوّرة
-- =========================================================

create table if not exists public.admin_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  summary text not null,
  description text not null,
  event_date_gregorian date not null,
  event_date_hijri text not null,
  location text null,
  status text not null check (status in ('draft', 'published')) default 'draft',
  cover_image_url text null,
  cover_thumbnail_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users(id) on delete set null
);

create unique index if not exists admin_events_slug_unique_idx
  on public.admin_events (slug);

create index if not exists admin_events_status_idx
  on public.admin_events (status);

create index if not exists admin_events_event_date_idx
  on public.admin_events (event_date_gregorian desc);

create table if not exists public.admin_event_images (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.admin_events(id) on delete cascade,
  file_name text not null,
  storage_path text not null unique,
  public_url text not null,
  thumbnail_path text not null unique,
  thumbnail_url text not null,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  size_bytes bigint not null,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  uploaded_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists admin_event_images_event_id_idx
  on public.admin_event_images (event_id, sort_order);

create index if not exists admin_event_images_cover_idx
  on public.admin_event_images (event_id, is_cover);

alter table public.admin_events enable row level security;
alter table public.admin_event_images enable row level security;

drop policy if exists "Public can read published events" on public.admin_events;
create policy "Public can read published events"
  on public.admin_events
  for select
  to public
  using (status = 'published');

drop policy if exists "Admins can manage events" on public.admin_events;
create policy "Admins can manage events"
  on public.admin_events
  for all
  to authenticated
  using (public.has_admin_role(array['super_admin', 'admin']))
  with check (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Public can read published event images" on public.admin_event_images;
create policy "Public can read published event images"
  on public.admin_event_images
  for select
  to public
  using (
    exists (
      select 1
      from public.admin_events
      where admin_events.id = admin_event_images.event_id
        and admin_events.status = 'published'
    )
  );

drop policy if exists "Admins can manage event images" on public.admin_event_images;
create policy "Admins can manage event images"
  on public.admin_event_images
  for all
  to authenticated
  using (public.has_admin_role(array['super_admin', 'admin']))
  with check (public.has_admin_role(array['super_admin', 'admin']));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('events', 'events', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read events bucket" on storage.objects;
create policy "Public can read events bucket"
  on storage.objects
  for select
  to public
  using (bucket_id = 'events');

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
