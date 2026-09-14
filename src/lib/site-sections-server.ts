import { createClient } from '@supabase/supabase-js';
import {
  mergeSiteSection,
  type SiteSectionContent,
  type SiteSectionKey,
} from './site-sections-shared';

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

export async function getPublishedSiteSections(
  keys: SiteSectionKey[],
): Promise<Record<SiteSectionKey, SiteSectionContent>> {
  const fallback = Object.fromEntries(keys.map((key) => [key, mergeSiteSection(key)])) as Record<
    SiteSectionKey,
    SiteSectionContent
  >;
  const client = getServerClient();

  if (!client) return fallback;

  const { data, error } = await client
    .from('site_sections')
    .select('*')
    .in('section_key', keys)
    .eq('status', 'published');

  if (error) {
    console.error('[site-sections] Failed to fetch published sections:', error.message);
    return fallback;
  }

  for (const row of (data ?? []) as unknown as SiteSectionContent[]) {
    const key = row.section_key;
    if (keys.includes(key)) {
      fallback[key] = mergeSiteSection(key, row);
    }
  }

  return fallback;
}

export interface SiteSectionUpdate {
  section_key: SiteSectionKey;
  updated_at: string;
}

export async function getPublishedSiteSectionUpdates(): Promise<SiteSectionUpdate[]> {
  const client = getServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from('site_sections')
    .select('section_key,updated_at')
    .eq('status', 'published');

  if (error) {
    console.error('[site-sections] Failed to fetch section update dates:', error.message);
    return [];
  }

  return data ?? [];
}
