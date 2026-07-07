-- إعداد Supabase لقسم الإدارة: الأخبار والمناسبات
-- نفّذ هذا الملف كاملاً داخل Supabase SQL Editor

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

alter table public.admin_posts enable row level security;

drop policy if exists "Public can read posts" on public.admin_posts;
create policy "Public can read posts"
on public.admin_posts
for select
to public
using (true);

drop policy if exists "Authenticated can insert posts" on public.admin_posts;
create policy "Authenticated can insert posts"
on public.admin_posts
for insert
to authenticated
with check (auth.uid() is not null);

drop policy if exists "Authenticated can update posts" on public.admin_posts;
create policy "Authenticated can update posts"
on public.admin_posts
for update
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "Authenticated can delete posts" on public.admin_posts;
create policy "Authenticated can delete posts"
on public.admin_posts
for delete
to authenticated
using (auth.uid() is not null);
