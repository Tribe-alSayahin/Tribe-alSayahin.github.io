create table if not exists public.poetry_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  poet_name text not null,
  story text,
  poem_text text not null,
  source text,
  status text not null check (status in ('draft', 'published')) default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users(id) on delete set null
);

create index if not exists poetry_entries_status_idx
  on public.poetry_entries (status);

create index if not exists poetry_entries_created_at_idx
  on public.poetry_entries (created_at desc);

alter table public.poetry_entries enable row level security;

drop policy if exists "Public can read published poetry entries" on public.poetry_entries;
create policy "Public can read published poetry entries"
on public.poetry_entries
for select
to public
using (status = 'published');

drop policy if exists "Admins can manage poetry entries" on public.poetry_entries;
create policy "Admins can manage poetry entries"
on public.poetry_entries
for all
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']))
with check (public.has_admin_role(array['super_admin', 'admin']));

notify pgrst, 'reload schema';
