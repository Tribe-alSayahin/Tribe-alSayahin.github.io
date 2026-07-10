-- Migration: إنشاء جدول admin_posts لقسم الأخبار والمناسبات
-- يُطبَّق تلقائياً عند استخدام Supabase CLI (supabase db push)
-- أو يُنفَّذ يدوياً في Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.admin_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  kind text not null check (kind in ('news', 'event')),
  event_date date null,
  created_at timestamptz not null default now(),
  created_by uuid null references auth.users(id) on delete set null
);

-- فهرس على created_at لتسريع الاستعلامات المرتّبة بالتاريخ
create index if not exists admin_posts_created_at_idx
  on public.admin_posts (created_at desc);

alter table public.admin_posts enable row level security;

-- قراءة مفتوحة للجميع (زوار + مستخدمون)
drop policy if exists "Public can read posts" on public.admin_posts;
create policy "Public can read posts"
  on public.admin_posts
  for select
  to public
  using (true);

-- الإضافة للمستخدمين المسجّلين فقط
drop policy if exists "Authenticated can insert posts" on public.admin_posts;
create policy "Authenticated can insert posts"
  on public.admin_posts
  for insert
  to authenticated
  with check (auth.uid() is not null);

-- التعديل للمستخدمين المسجّلين فقط
drop policy if exists "Authenticated can update posts" on public.admin_posts;
create policy "Authenticated can update posts"
  on public.admin_posts
  for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- الحذف للمستخدمين المسجّلين فقط
drop policy if exists "Authenticated can delete posts" on public.admin_posts;
create policy "Authenticated can delete posts"
  on public.admin_posts
  for delete
  to authenticated
  using (auth.uid() is not null);

-- تحديث schema cache في PostgREST بعد إنشاء الجدول
-- (مطلوب إذا ظهر خطأ "Could not find the table in the schema cache")
notify pgrst, 'reload schema';
