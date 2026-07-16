create index if not exists analytics_session_created_at_idx
  on public.analytics (session_id, created_at desc);

create or replace function public.prepare_analytics_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.user_id := auth.uid();
  new.event_data := coalesce(new.event_data, '{}'::jsonb);
  new.created_at := now();
  return new;
end;
$$;

revoke all on function public.prepare_analytics_event() from public;

drop trigger if exists prepare_analytics_event_before_insert on public.analytics;
create trigger prepare_analytics_event_before_insert
before insert on public.analytics
for each row
execute function public.prepare_analytics_event();

drop policy if exists "Public can insert analytics" on public.analytics;
create policy "Public can insert analytics"
on public.analytics
for insert
to public
with check (
  event_type in ('page_view', 'user_visit', 'post_view')
  and session_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and jsonb_typeof(event_data) = 'object'
  and event_data ->> 'path' like '/%'
  and length(event_data ->> 'path') <= 256
  and length(coalesce(event_data ->> 'title', '')) <= 160
  and length(coalesce(event_data ->> 'post_slug', '')) <= 160
  and octet_length(event_data::text) <= 2048
  and user_id is not distinct from auth.uid()
);

revoke insert on public.analytics from anon, authenticated;
grant insert (event_type, event_data, session_id)
on public.analytics to anon, authenticated;

notify pgrst, 'reload schema';
