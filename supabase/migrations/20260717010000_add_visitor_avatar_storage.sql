insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'visitor-avatars',
  'visitor-avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Visitors can read own avatar metadata" on storage.objects;
create policy "Visitors can read own avatar metadata"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'visitor-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Visitors can upload own avatar" on storage.objects;
create policy "Visitors can upload own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'visitor-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Visitors can update own avatar" on storage.objects;
create policy "Visitors can update own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'visitor-avatars'
  and owner_id = auth.uid()::text
)
with check (
  bucket_id = 'visitor-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Visitors can delete own avatar" on storage.objects;
create policy "Visitors can delete own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'visitor-avatars'
  and owner_id = auth.uid()::text
);
