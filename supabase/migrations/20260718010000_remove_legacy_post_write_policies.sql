drop policy if exists "Authenticated can insert posts" on public.admin_posts;
drop policy if exists "Authenticated can update posts" on public.admin_posts;
drop policy if exists "Authenticated can delete posts" on public.admin_posts;

notify pgrst, 'reload schema';
