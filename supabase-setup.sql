-- ============================================
-- Supabase Setup for Tribe Al-Siyahin Admin
-- ============================================
-- Run this SQL in Supabase Dashboard > SQL Editor

-- ============================================
-- 1. ENABLE EXTENSIONS
-- ============================================
create extension if not exists "uuid-ossp";

-- ============================================
-- 2. CREATE TABLES
-- ============================================

-- News table
create table if not exists public.news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  summary text,
  content text,
  image_url text,
  published_at date,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gallery table
create table if not exists public.gallery (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Site content table
create table if not exists public.site_content (
  id uuid primary key default uuid_generate_v4(),
  section_key text unique not null,
  title text,
  content text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Social links table
create table if not exists public.social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,
  label text,
  url text not null,
  is_active boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Site settings table
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  setting_key text unique not null,
  setting_value text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 3. CREATE UPDATED_AT TRIGGER FUNCTION
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Apply trigger to tables with updated_at
drop trigger if exists news_updated_at on public.news;
create trigger news_updated_at
  before update on public.news
  for each row execute function public.handle_updated_at();

drop trigger if exists gallery_updated_at on public.gallery;
create trigger gallery_updated_at
  before update on public.gallery
  for each row execute function public.handle_updated_at();

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at
  before update on public.site_content
  for each row execute function public.handle_updated_at();

drop trigger if exists social_links_updated_at on public.social_links;
create trigger social_links_updated_at
  before update on public.social_links
  for each row execute function public.handle_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.handle_updated_at();

-- ============================================
-- 4. ENABLE RLS ON ALL TABLES
-- ============================================
alter table public.news enable row level security;
alter table public.gallery enable row level security;
alter table public.site_content enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;

-- ============================================
-- 5. RLS POLICIES - PUBLIC READ
-- ============================================

-- News: public reads published only, authenticated users can do everything
create policy "Public read published news" on public.news
  for select using (is_published = true);

create policy "Authenticated users can insert news" on public.news
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update news" on public.news
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete news" on public.news
  for delete using (auth.role() = 'authenticated');

-- Gallery: public reads all, authenticated users can do everything
create policy "Public read gallery" on public.gallery
  for select using (true);

create policy "Authenticated users can insert gallery" on public.gallery
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update gallery" on public.gallery
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete gallery" on public.gallery
  for delete using (auth.role() = 'authenticated');

-- Site content: public reads all, authenticated users can do everything
create policy "Public read site_content" on public.site_content
  for select using (true);

create policy "Authenticated users can insert site_content" on public.site_content
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update site_content" on public.site_content
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete site_content" on public.site_content
  for delete using (auth.role() = 'authenticated');

-- Social links: public reads active only, authenticated users can do everything
create policy "Public read active social links" on public.social_links
  for select using (is_active = true);

create policy "Authenticated users can insert social_links" on public.social_links
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update social_links" on public.social_links
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete social_links" on public.social_links
  for delete using (auth.role() = 'authenticated');

-- Site settings: public reads all, authenticated users can do everything
create policy "Public read site_settings" on public.site_settings
  for select using (true);

create policy "Authenticated users can insert site_settings" on public.site_settings
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update site_settings" on public.site_settings
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete site_settings" on public.site_settings
  for delete using (auth.role() = 'authenticated');

-- ============================================
-- 6. STORAGE BUCKET SETUP
-- ============================================
-- Create storage bucket named "site-images"
-- Run this in Supabase Dashboard > Storage:
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('site-images', 'site-images', true)
-- ON CONFLICT (id) DO NOTHING;
--
-- Then set these policies in Storage > site-images bucket:
--
-- Policy 1: Public read access
-- Allow anon to SELECT files
-- bucket_id = 'site-images'
-- AND auth.role() = 'anon'
--
-- Policy 2: Authenticated upload
-- Allow authenticated to INSERT
-- bucket_id = 'site-images'
-- AND auth.role() = 'authenticated'
--
-- Policy 3: Authenticated update/delete
-- Allow authenticated to UPDATE/DELETE
-- bucket_id = 'site-images'
-- AND auth.role() = 'authenticated'

-- ============================================
-- 7. SEED DEFAULT DATA
-- ============================================

-- Default site content sections
insert into public.site_content (section_key, title, content) values
  ('about', 'عن القبيلة', 'قبيلة السياحين من المزاحمة من الروقة من عتيبة الهيلا — قبيلة عربية أصيلة في نجد وما حولها.'),
  ('history', 'التاريخ', 'تاريخ عريق يمتد لقرون في قلب نجد، من هجرة الجثوم الأولى حتى اليوم.'),
  ('heritage', 'التراث', 'إرث ثقافي غني يشمل الشعر النبطي والوسم التقليدي والعادات الأصيلة.')
on conflict (section_key) do nothing;

-- Default social links
insert into public.social_links (platform, label, url, is_active) values
  ('whatsapp', 'واتساب', 'https://wa.me/966500000000', true),
  ('email', 'بريد إلكتروني', 'mailto:info@alsayahin.sa', true),
  ('youtube', 'يوتيوب', 'https://youtube.com/@alsayahin', true)
on conflict (id) do nothing;

-- Default site settings
insert into public.site_settings (setting_key, setting_value) values
  ('site_name', 'الموقع الرسمي لقبيلة السياحين'),
  ('site_description', 'البوابة الرقمية الموثقة لقبيلة السياحين من الروقة من عتيبة'),
  ('contact_email', 'info@alsayahin.sa'),
  ('footer_text', 'جميع الحقوق محفوظة لقبيلة السياحين'),
  ('main_color', '#c9a24b'),
  ('secondary_color', '#8a6d2c')
on conflict (setting_key) do nothing;
