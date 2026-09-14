begin;

select plan(8);

select ok(public.is_valid_site_section_gallery(null), 'NULL keeps the default gallery');
select ok(public.is_valid_site_section_gallery('[]'::jsonb), 'an empty gallery can be saved');
select ok(public.is_valid_site_section_gallery(
  '[{"src":"/images/sheikhdom/example.png","alt":"وصف الصورة","caption":"تعليق"}]'::jsonb
), 'valid image metadata is accepted');
select ok(not public.is_valid_site_section_gallery(
  '[{"src":"javascript:alert(1)","alt":"وصف","caption":""}]'::jsonb
), 'script URLs are rejected');
select ok(not public.is_valid_site_section_gallery(
  '[{"src":"//example.com/image.png","alt":"وصف","caption":""}]'::jsonb
), 'protocol relative URLs are rejected');
select ok(not public.is_valid_site_section_gallery(
  '[{"src":"/image.png","alt":"","caption":""}]'::jsonb
), 'empty alternative text is rejected');

set local role anon;
select throws_ok(
  $$insert into public.site_sections (section_key, title, description, gallery_images)
    values ('rls-sheikhdom-test', 'مرفوض', 'مرفوض', '[]')$$,
  '42501', null, 'anonymous visitors cannot write section content'
);
select throws_ok(
  $$insert into storage.objects (bucket_id, name) values ('site-media', 'sheikhdom/rls-test.png')$$,
  '42501', null, 'anonymous visitors cannot upload sheikhdom images'
);

select * from finish();
rollback;
