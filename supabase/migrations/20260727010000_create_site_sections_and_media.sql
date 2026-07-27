create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text not null,
  description text not null,
  image_url text,
  image_alt text,
  status text not null default 'published' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_sections_status_sort_idx
  on public.site_sections (status, sort_order);

insert into public.site_sections (
  section_key,
  title,
  description,
  image_url,
  image_alt,
  status,
  sort_order
)
values
  (
    'home',
    'قبيلة السياحين',
    'ديوان رقمي موثّق يجمع الديار والنسب والشعر والتاريخ في سيرة واحدة، تبدأ من الجثوم وتمتد في ذاكرة المكان.',
    '/images/jathum-hills-hussain-alsaihani.jpg',
    'هضب الجثوم والسهول المحيطة به في عالية نجد',
    'published',
    0
  ),
  (
    'jathum',
    'هجرة الجثوم — أساس الديار',
    'قبل كل الأقسام تأتي الجثوم: أول هجرة رسمية أسسها السياحين في عالية نجد، ومنها انطلق الاستقرار والتحضر وامتدت بقية الديار.',
    null,
    null,
    'published',
    10
  ),
  (
    'lineage',
    'ديوان نسب القبيلة الأصيل',
    'التوثيق المتسلسل لعمود نسب فخذ السياحين من المزاحمة من الروقة من عتيبة الهيلا، وصولاً لعدنان.',
    null,
    null,
    'published',
    20
  ),
  (
    'constellation',
    'الخلاصة الكوكبية للأنساب',
    'تمثيل فلكي رمزي يربط الأنساب السبعة الكبرى في فضاء كوكبي مترابط يبرز التلاحم والأصل المشترك للقبيلة.',
    null,
    null,
    'published',
    30
  ),
  (
    'map',
    'الديار ومنازل الاستقرار',
    'استكشف التوزيع الجغرافي لديار السياحين التاريخية، من منازلهم في نجد العذية وهجرهم المعتمدة ومناهل المياه القديمة.',
    null,
    null,
    'published',
    40
  ),
  (
    'gallery',
    'معرض التراث والمقتنيات',
    'شواهد بصرية ومقتنيات تراثية تعكس تاريخ القبيلة العريق وصوراً من ذاكرة الصحراء والديار المأهولة.',
    null,
    null,
    'published',
    50
  ),
  (
    'wasm',
    'وسم الإبل وعلامة الباب',
    'وسم «الباب» الشهير للسياحين على الرقبة من الجهة اليسرى، رمز الهوية والأصالة في البادية.',
    null,
    null,
    'published',
    60
  ),
  (
    'poetry',
    'ديوان الشعر النبطي',
    'مساحة مخصصة للقصائد الموثقة وشواهد الشعر النبطي بعد مراجعتها وإسنادها إلى مصادر واضحة.',
    null,
    null,
    'published',
    70
  ),
  (
    'timeline',
    'صفحات من مآثر وإرث القبيلة',
    'تسلسل زمني يوثق أبرز المحطات التاريخية لفروسية ومواقف قبيلة السياحين وإسهامها الوطني المعتمد.',
    null,
    null,
    'published',
    80
  ),
  (
    'archive',
    'التوثيق الاستشراقي والمدونات التاريخية',
    'شهادات وملاحظات المستشرقين والرحالة الغربيين حول نسب وقوة ومواقف السياحين في تاريخ الجزيرة العربية.',
    null,
    null,
    'published',
    90
  )
on conflict (section_key) do nothing;

alter table public.site_sections enable row level security;

grant select on public.site_sections to anon, authenticated;
grant insert, update, delete on public.site_sections to authenticated;

drop policy if exists "Public can read published site sections" on public.site_sections;
create policy "Public can read published site sections"
on public.site_sections
for select
to public
using (status = 'published');

drop policy if exists "Admins can read all site sections" on public.site_sections;
create policy "Admins can read all site sections"
on public.site_sections
for select
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Admins can insert site sections" on public.site_sections;
create policy "Admins can insert site sections"
on public.site_sections
for insert
to authenticated
with check (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Admins can update site sections" on public.site_sections;
create policy "Admins can update site sections"
on public.site_sections
for update
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']))
with check (public.has_admin_role(array['super_admin', 'admin']));

drop policy if exists "Admins can delete site sections" on public.site_sections;
create policy "Admins can delete site sections"
on public.site_sections
for delete
to authenticated
using (public.has_admin_role(array['super_admin', 'admin']));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site media" on storage.objects;
create policy "Public can read site media"
on storage.objects
for select
to public
using (bucket_id = 'site-media');

drop policy if exists "Admins can upload site media" on storage.objects;
create policy "Admins can upload site media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-media'
  and public.has_admin_role(array['super_admin', 'admin'])
);

drop policy if exists "Admins can update site media" on storage.objects;
create policy "Admins can update site media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-media'
  and public.has_admin_role(array['super_admin', 'admin'])
)
with check (
  bucket_id = 'site-media'
  and public.has_admin_role(array['super_admin', 'admin'])
);

drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can delete site media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-media'
  and public.has_admin_role(array['super_admin', 'admin'])
);

notify pgrst, 'reload schema';
