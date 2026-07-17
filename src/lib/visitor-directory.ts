import { supabase } from './supabase';

export interface StoredVisitorProfile {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  provider: string;
  createdAt: string;
  lastSeenAt: string;
}

export interface VisitorDirectoryEntry extends StoredVisitorProfile {
  isOnline: boolean;
}

interface VisitorProfileRow {
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  provider: string | null;
  created_at: string;
  last_seen_at: string;
  is_online?: boolean;
}

type ApiError = { message: string };
type ItemResult<T> = { data: T | null; error: ApiError | null };
type ListResult<T> = { data: T[] | null; error: ApiError | null };

const mapProfile = (row: VisitorProfileRow): StoredVisitorProfile => ({
  userId: row.user_id,
  fullName: row.full_name?.trim() ?? '',
  email: row.email?.trim() ?? '',
  avatarUrl: row.avatar_url?.trim() ?? '',
  provider: row.provider?.trim() ?? '',
  createdAt: row.created_at,
  lastSeenAt: row.last_seen_at,
});

export async function syncCurrentVisitorProfile(): Promise<ItemResult<StoredVisitorProfile>> {
  const { data, error } = await supabase.rpc<VisitorProfileRow[]>('sync_my_visitor_profile');

  if (error) return { data: null, error };

  const row = Array.isArray(data) ? data[0] : null;
  return { data: row ? mapProfile(row) : null, error: null };
}

export async function fetchVisitorDirectory(): Promise<ListResult<VisitorDirectoryEntry>> {
  const { data, error } = await supabase.rpc<VisitorProfileRow[]>('list_visitor_profiles');

  if (error) return { data: null, error };

  const rows = Array.isArray(data) ? data : [];
  return {
    data: rows.map((row) => ({ ...mapProfile(row), isOnline: row.is_online === true })),
    error: null,
  };
}

export const formatVisitorDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'غير متاح';

  return new Intl.DateTimeFormat('ar-SA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};
