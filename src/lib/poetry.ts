import { supabase } from './supabase';

export type PoetryStatus = 'draft' | 'published';

export interface PoetryEntry {
  id: string;
  title: string;
  poet_name: string;
  story: string | null;
  poem_text: string;
  source: string | null;
  status: PoetryStatus;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface PoetryEntryInsert {
  title: string;
  poet_name: string;
  story?: string | null;
  poem_text: string;
  source?: string | null;
  status?: PoetryStatus;
  created_by?: string | null;
  updated_at?: string;
}

export interface PoetryEntryUpdate {
  title?: string;
  poet_name?: string;
  story?: string | null;
  poem_text?: string;
  source?: string | null;
  status?: PoetryStatus;
  updated_at?: string;
}

type ApiError = { message: string };
type FetchListResult<T> = { data: T[]; error: null } | { data: null; error: ApiError };

const POETRY_SELECT = 'id,title,poet_name,story,poem_text,source,status,created_at,updated_at,created_by';

export async function fetchPublishedPoetryEntries(): Promise<FetchListResult<PoetryEntry>> {
  const { data, error } = await supabase
    .from('poetry_entries')
    .select(POETRY_SELECT)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}

export async function fetchAllPoetryEntries(): Promise<FetchListResult<PoetryEntry>> {
  const { data, error } = await supabase
    .from('poetry_entries')
    .select(POETRY_SELECT)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };
  return { data: data ?? [], error: null };
}
