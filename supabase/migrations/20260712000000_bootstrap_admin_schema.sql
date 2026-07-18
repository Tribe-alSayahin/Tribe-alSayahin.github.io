create extension if not exists pgcrypto;

alter table public.admin_posts
  add column if not exists slug text,
  add column if not exists status text not null default 'draft',
  add column if not exists featured_image text,
  add column if not exists updated_at timestamptz not null default now();

update public.admin_posts
set slug = coalesce(nullif(slug, ''), id::text)
where slug is null or slug = '';

alter table public.admin_posts alter column slug set not null;
create unique index if not exists admin_posts_slug_idx on public.admin_posts (slug);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('super_admin', 'admin', 'editor')),
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.admin_posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text,
  content text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text not null,
  file_size bigint,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_data jsonb,
  session_id text,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.comments enable row level security;
alter table public.media enable row level security;
alter table public.analytics enable row level security;
alter table public.admin_logs enable row level security;

grant select on public.admin_posts to anon, authenticated;
grant insert, update, delete on public.admin_posts to authenticated;
grant select on public.admin_users to authenticated;
grant select, insert, update, delete on public.comments to authenticated;
grant select, insert, delete on public.media to authenticated;
grant insert on public.analytics to anon, authenticated;
grant select on public.analytics to authenticated;
grant select, insert on public.admin_logs to authenticated;

create index if not exists comments_post_id_idx on public.comments (post_id);
create index if not exists comments_user_id_idx on public.comments (user_id);
create index if not exists analytics_created_at_idx on public.analytics (created_at desc);
create index if not exists admin_logs_created_at_idx on public.admin_logs (created_at desc);

notify pgrst, 'reload schema';
