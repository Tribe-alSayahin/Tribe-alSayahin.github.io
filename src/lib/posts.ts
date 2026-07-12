import { createClient } from '@supabase/supabase-js';

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  kind: 'news' | 'event';
  status: 'published' | 'draft' | 'archived';
  featured_image?: string | null;
  event_date?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  '';
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SECRET_KEY ??
  '';

let serverClient: ReturnType<typeof createClient> | null = null;

function getServerClient() {
  if (!serverClient && SUPABASE_URL && SERVICE_ROLE_KEY) {
    serverClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return serverClient;
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const client = getServerClient();
  if (!client) {
    console.warn('[posts] Supabase service role key not configured; skipping dynamic news routes.');
    return [];
  }

  const { data, error } = await client
    .from('admin_posts')
    .select('slug')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[posts] Failed to fetch post slugs:', error.message);
    return [];
  }

  return (data as Pick<NewsPost, 'slug'>[] | null)?.filter((p) => p.slug) ?? [];
}

export async function getAllPosts(): Promise<NewsPost[]> {
  const client = getServerClient();
  if (!client) {
    console.warn('[posts] Supabase service role key not configured; cannot fetch posts.');
    return [];
  }

  const { data, error } = await client
    .from('admin_posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[posts] Failed to fetch posts:', error.message);
    return [];
  }

  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<NewsPost | null> {
  const client = getServerClient();
  if (!client) {
    console.warn('[posts] Supabase service role key not configured; cannot fetch post.');
    return null;
  }

  const { data, error } = await client
    .from('admin_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('[posts] Failed to fetch post by slug:', error.message);
    return null;
  }

  return data ?? null;
}

export function createSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}
