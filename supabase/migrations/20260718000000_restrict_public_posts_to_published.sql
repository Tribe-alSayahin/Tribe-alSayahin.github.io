alter table public.admin_posts
  add column if not exists status text not null default 'draft'
  check (status in ('draft', 'published', 'archived'));

drop policy if exists "Public can read posts" on public.admin_posts;
create policy "Public can read published posts"
on public.admin_posts
for select
to public
using (status = 'published');

notify pgrst, 'reload schema';
