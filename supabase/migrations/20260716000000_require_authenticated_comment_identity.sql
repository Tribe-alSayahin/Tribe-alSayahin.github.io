drop policy if exists "Authenticated can insert comments" on public.comments;

create policy "Authenticated can insert comments"
on public.comments
for insert
to authenticated
with check (
  auth.uid() is not null
  and user_id = auth.uid()
  and nullif(btrim(author_name), '') is not null
  and status = 'pending'
);

notify pgrst, 'reload schema';
