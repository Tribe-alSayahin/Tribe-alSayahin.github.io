import { createClient } from '@supabase/supabase-js';

export interface PublishedEventImage {
  id: string;
  event_id: string;
  file_name: string;
  public_url: string;
  thumbnail_url: string;
  sort_order: number;
  is_cover: boolean;
}

export interface PublishedEvent {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  event_date_gregorian: string;
  event_date_hijri: string;
  location: string | null;
  status: 'draft' | 'published';
  cover_image_url: string | null;
  cover_thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  admin_event_images: PublishedEventImage[];
}

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
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

const baseSelect = `
  id,
  title,
  slug,
  summary,
  description,
  event_date_gregorian,
  event_date_hijri,
  location,
  status,
  cover_image_url,
  cover_thumbnail_url,
  created_at,
  updated_at,
  admin_event_images (
    id,
    event_id,
    file_name,
    public_url,
    thumbnail_url,
    sort_order,
    is_cover
  )
`;

export async function getPublishedEvents(): Promise<PublishedEvent[]> {
  const client = getServerClient();
  if (!client) {
    console.warn('[events] Supabase service role key not configured; cannot fetch events.');
    return [];
  }

  const { data, error } = await client
    .from('admin_events')
    .select(baseSelect)
    .eq('status', 'published')
    .order('event_date_gregorian', { ascending: false })
    .order('sort_order', { referencedTable: 'admin_event_images', ascending: true });

  if (error) {
    console.error('[events] Failed to fetch published events:', error.message);
    return [];
  }

  return data ?? [];
}

export async function getPublishedEventBySlug(slug: string): Promise<PublishedEvent | null> {
  const client = getServerClient();
  if (!client) {
    console.warn('[events] Supabase service role key not configured; cannot fetch event by slug.');
    return null;
  }

  const { data, error } = await client
    .from('admin_events')
    .select(baseSelect)
    .eq('slug', decodeURIComponent(slug))
    .eq('status', 'published')
    .order('sort_order', { referencedTable: 'admin_event_images', ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[events] Failed to fetch event by slug:', slug, error.message);
    return null;
  }

  return data ?? null;
}

export async function getAllEventSlugs(): Promise<{ slug: string }[]> {
  const client = getServerClient();
  if (!client) {
    console.warn('[events] Supabase service role key not configured; skipping dynamic events routes.');
    return [];
  }

  const { data, error } = await client
    .from('admin_events')
    .select('slug')
    .eq('status', 'published')
    .order('event_date_gregorian', { ascending: false });

  if (error) {
    console.error('[events] Failed to fetch event slugs:', error.message);
    return [];
  }

  return data ?? [];
}

export async function getAllEventsForSitemap(): Promise<Array<{ slug: string; updated_at: string }>> {
  const client = getServerClient();
  if (!client) {
    console.warn('[events] Supabase service role key not configured; skipping dynamic events sitemap entries.');
    return [];
  }

  const { data, error } = await client
    .from('admin_events')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[events] Failed to fetch events sitemap entries:', error.message);
    return [];
  }

  return data ?? [];
}
