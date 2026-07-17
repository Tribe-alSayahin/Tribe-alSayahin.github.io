import { createClient } from '@supabase/supabase-js';
import type { PoetryEntry } from './poetry-types';

export interface SitemapPoetryEntry {
  id: string;
  updated_at: string;
}

const POETRY_SELECT = 'id,title,poet_name,story,poem_text,source,status,created_at,updated_at,created_by';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

let serverClient: ReturnType<typeof createClient> | null = null;

function getServerClient() {
  if (!serverClient && SUPABASE_URL && SERVICE_ROLE_KEY) {
    serverClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return serverClient;
}

export async function getPublishedPoetryEntries(): Promise<PoetryEntry[]> {
  const client = getServerClient();
  if (!client) {
    console.warn('[poetry] Supabase service role key not configured; skipping published poetry.');
    return [];
  }

  const { data, error } = await client
    .from('poetry_entries')
    .select(POETRY_SELECT)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[poetry] Failed to fetch published poetry:', error.message);
    return [];
  }

  return data ?? [];
}

export async function getAllPoetryIds(): Promise<{ id: string }[]> {
  const entries = await getPublishedPoetryEntries();
  return entries.map(({ id }) => ({ id }));
}

export async function getPublishedPoetryById(id: string): Promise<PoetryEntry | null> {
  const client = getServerClient();
  if (!client) return null;

  const { data, error } = await client
    .from('poetry_entries')
    .select(POETRY_SELECT)
    .eq('id', decodeURIComponent(id))
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('[poetry] Failed to fetch poetry entry:', error.message);
    return null;
  }

  return data ?? null;
}

export async function getAllPoetryForSitemap(): Promise<SitemapPoetryEntry[]> {
  const entries = await getPublishedPoetryEntries();
  return entries.map(({ id, updated_at }) => ({ id, updated_at }));
}
