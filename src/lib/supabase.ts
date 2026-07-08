import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env ?? {};
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

try {
  if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
    client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
} catch (error) {
  console.warn('Supabase initialization skipped:', error);
}

const noop = (): any => ({
  select: () => Promise.resolve({ data: null }),
  insert: () => Promise.resolve({ data: null }),
  update: () => Promise.resolve({ data: null }),
  delete: () => Promise.resolve({ data: null }),
  eq: () => noopQuery(),
  order: () => noopQuery(),
  limit: () => noopQuery(),
  single: () => Promise.resolve({ data: null }),
});

const noopQuery = (): any => ({
  select: () => Promise.resolve({ data: null }),
  eq: () => noopQuery(),
  order: () => noopQuery(),
  limit: () => noopQuery(),
  single: () => Promise.resolve({ data: null }),
});

const noopStorage = (): any => ({
  upload: () => Promise.resolve({ data: null }),
  getPublicUrl: () => ({ data: { publicUrl: '' } }),
  remove: () => Promise.resolve({ data: null }),
});

const noopAuth = (): any => ({
  signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase is not configured' } }),
  signOut: () => Promise.resolve(),
  getSession: () => Promise.resolve({ data: { session: null } }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
});

const noopChannel = (): any => ({
  on: () => noopChannel(),
  subscribe: () => {},
  unsubscribe: () => {},
});

const noopClient: SupabaseClient = {
  auth: noopAuth(),
  from: () => noop(),
  storage: { from: () => noopStorage() },
  channel: () => noopChannel(),
} as unknown as SupabaseClient;

export const supabase: SupabaseClient = client || noopClient;
export const isSupabaseConfigured = (): boolean => !!client;
