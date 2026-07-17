drop policy if exists "Visitors can read own avatar metadata" on storage.objects;
create policy "Visitors can read own avatar metadata"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'visitor-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

notify pgrst, 'reload schema';
