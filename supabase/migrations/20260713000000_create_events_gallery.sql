-- Migration: إنشاء نظام المناسبات والأحداث المصوّرة

create extension if not exists pgcrypto;

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

-- قراءة المناسبات المنشورة للعامة
create policy "Public can read published events"
  on public.admin_events
  for select
  to public
  using (status = 'published');

-- إدارة المناسبات للأدمن
create policy "Admins can manage events"
  on public.admin_events
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

-- قراءة الصور مرتبطة بحالة المناسبة
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

-- إدارة الصور للأدمن
create policy "Admins can manage event images"
  on public.admin_event_images
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

-- Bucket الصور الخاصة بالمناسبات
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('events', 'events', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read events bucket"
  on storage.objects
  for select
  to public
  using (bucket_id = 'events');

create policy "Admins can upload events bucket"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'events'
    and exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

create policy "Admins can update events bucket"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'events'
    and exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  )
  with check (
    bucket_id = 'events'
    and exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

create policy "Admins can delete events bucket"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'events'
    and exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

notify pgrst, 'reload schema';
