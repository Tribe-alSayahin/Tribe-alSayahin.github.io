begin;

select plan(7);

insert into public.admin_posts (title, slug, content, kind, status)
values
  ('خبر منشور', 'rls-published', 'محتوى', 'news', 'published'),
  ('مسودة سرية', 'rls-draft', 'محتوى', 'news', 'draft');

set local role anon;

select results_eq(
  $$select slug from public.admin_posts where slug like 'rls-%' order by slug$$,
  array['rls-published'::text],
  'anonymous visitors can read published posts only'
);

select throws_ok(
  $$insert into public.admin_posts (title, slug, content, kind, status) values ('مرفوض', 'rls-anon-write', 'محتوى', 'news', 'published')$$,
  '42501',
  null,
  'anonymous visitors cannot create posts'
);

reset role;

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values (
  '11111111-1111-4111-8111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'visitor@example.test',
  '',
  now(),
  now(),
  now()
);

select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select throws_ok(
  $$insert into public.admin_posts (title, slug, content, kind, status) values ('مرفوض', 'rls-user-write', 'محتوى', 'news', 'published')$$,
  '42501',
  null,
  'ordinary authenticated users cannot create posts'
);

select lives_ok(
  $$insert into storage.objects (bucket_id, name, owner_id) values ('visitor-avatars', '11111111-1111-4111-8111-111111111111/avatar.webp', '11111111-1111-4111-8111-111111111111')$$,
  'visitor can upload an avatar inside the owned folder'
);

select throws_ok(
  $$insert into storage.objects (bucket_id, name, owner_id) values ('visitor-avatars', '22222222-2222-4222-8222-222222222222/avatar.webp', '11111111-1111-4111-8111-111111111111')$$,
  '42501',
  null,
  'visitor cannot upload into another user folder'
);

select results_eq(
  $$select name from storage.objects where bucket_id = 'visitor-avatars' order by name$$,
  array['11111111-1111-4111-8111-111111111111/avatar.webp'::text],
  'visitor can read only owned avatar metadata'
);

select set_config('storage.allow_delete_query', 'true', true);

select lives_ok(
  $$delete from storage.objects where bucket_id = 'visitor-avatars' and name = '11111111-1111-4111-8111-111111111111/avatar.webp'$$,
  'visitor can delete owned avatar metadata'
);

select * from finish();
rollback;
