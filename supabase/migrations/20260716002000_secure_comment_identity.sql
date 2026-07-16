create or replace function public.current_google_visitor_name()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when coalesce(users.raw_app_meta_data ->> 'provider', '') = 'google'
      then coalesce(
        nullif(btrim(users.raw_user_meta_data ->> 'full_name'), ''),
        nullif(btrim(users.raw_user_meta_data ->> 'name'), '')
      )
    else null
  end
  from auth.users
  where users.id = auth.uid();
$$;

revoke all on function public.current_google_visitor_name() from public;
grant execute on function public.current_google_visitor_name() to authenticated;

create or replace function public.enforce_comment_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  verified_name text;
begin
  verified_name := public.current_google_visitor_name();

  if auth.uid() is null or verified_name is null then
    raise exception 'A verified Google account with a profile name is required'
      using errcode = '42501';
  end if;

  new.user_id := auth.uid();
  new.author_name := verified_name;
  new.status := 'pending';
  return new;
end;
$$;

revoke all on function public.enforce_comment_identity() from public;

drop trigger if exists enforce_comment_identity_before_insert on public.comments;
create trigger enforce_comment_identity_before_insert
before insert on public.comments
for each row
execute function public.enforce_comment_identity();

drop policy if exists "Authenticated can insert comments" on public.comments;
create policy "Authenticated can insert comments"
on public.comments
for insert
to authenticated
with check (
  auth.uid() is not null
  and user_id = auth.uid()
  and author_name = public.current_google_visitor_name()
  and status = 'pending'
);

revoke select on public.comments from anon;
grant select (id, post_id, author_name, content, status, created_at, updated_at)
on public.comments to anon;

notify pgrst, 'reload schema';
