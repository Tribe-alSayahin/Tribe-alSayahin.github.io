-- إعداد Supabase لقسم الإدارة: الأخبار والمناسبات
-- نفّذ هذا الملف كاملاً داخل Supabase SQL Editor

create extension if not exists pgcrypto;

-- جدول الأخبار والمناسبات
create table if not exists public.admin_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
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
  add column if not exists featured_image text,
  add column if not exists updated_at timestamptz not null default now();

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

drop policy if exists "Public can read admin users" on public.admin_users;
create policy "Public can read admin users"
on public.admin_users
for select
to public
using (false);

drop policy if exists "Authenticated can read admin users" on public.admin_users;
create policy "Authenticated can read admin users"
on public.admin_users
for select
to authenticated
using (auth.uid() is not null);

drop policy if exists "Super admin can manage admin users" on public.admin_users;
create policy "Super admin can manage admin users"
on public.admin_users
for all
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
using (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role in ('super_admin', 'admin')
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role in ('super_admin', 'admin')
  )
);

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
with check (auth.uid() is not null);

drop policy if exists "Admin can delete media" on public.media;
create policy "Admin can delete media"
on public.media
for delete
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role in ('super_admin', 'admin')
  )
);

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
using (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role in ('super_admin', 'admin')
  )
);

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
using (
  exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role in ('super_admin', 'admin')
  )
);

drop policy if exists "Admin can insert logs" on public.admin_logs;
create policy "Admin can insert logs"
on public.admin_logs
for insert
to authenticated
with check (auth.uid() is not null);

-- تحديث schema cache في PostgREST بعد إنشاء الجداول
-- يحلّ خطأ "Could not find the table" في schema cache
notify pgrst, 'reload schema';
