-- NULL retains the existing gallery; [] explicitly removes every image.
alter table public.site_sections add column if not exists gallery_images jsonb;

create or replace function public.is_valid_site_section_gallery(images jsonb)
returns boolean
language plpgsql
immutable
set search_path = pg_catalog
as $$
declare
  image jsonb;
  source text;
  dimension text;
begin
  if images is null or images = 'null'::jsonb then return true; end if;
  if jsonb_typeof(images) <> 'array' then return false; end if;
  if jsonb_array_length(images) > 30 then return false; end if;
  for image in select value from jsonb_array_elements(images) loop
    if jsonb_typeof(image) <> 'object'
       or coalesce(jsonb_typeof(image->'src'), '') <> 'string'
       or coalesce(jsonb_typeof(image->'alt'), '') <> 'string'
       or coalesce(jsonb_typeof(image->'caption'), '') <> 'string' then
      return false;
    end if;
    source := image->>'src';
    if length(source) not between 1 and 2048
       or source ~ '[[:space:][:cntrl:]]'
       or position(chr(92) in source) > 0
       or not (source ~ '^/([^/]|$)' or source ~ '^https://[^/@?#]+([/?#]|$)')
       or length(btrim(image->>'alt')) not between 1 and 500
       or length(image->>'caption') > 2000 then
      return false;
    end if;
    foreach dimension in array array['width', 'height'] loop
      if image ? dimension then
        if jsonb_typeof(image->dimension) <> 'number' then return false; end if;
        if (image->>dimension)::numeric < 1 or (image->>dimension)::numeric > 20000
           or trunc((image->>dimension)::numeric) <> (image->>dimension)::numeric then
          return false;
        end if;
      end if;
    end loop;
  end loop;
  return true;
end;
$$;

alter table public.site_sections
  add constraint site_sections_gallery_images_valid
  check (public.is_valid_site_section_gallery(gallery_images));

insert into public.site_sections (section_key, title, description, status, sort_order)
values ('sheikhdom', 'المشيخة', 'مجموعة الصور التي أرفقها مالك الموقع لقسم المشيخة.', 'published', 30)
on conflict (section_key) do nothing;

-- Existing admin RLS and site-media storage policies remain in force.
notify pgrst, 'reload schema';
