import { createClient, type AuthChangeEvent, type Session, type User } from '@supabase/supabase-js';

type SupabaseErrorLike = { message: string } | null;

interface AdminPostRecordLike {
  id: string;
  title: string;
  slug: string | null;
  content: string;
  kind: 'news' | 'event';
  status: 'draft' | 'published';
  featured_image: string | null;
  event_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

interface AdminPostInsertLike {
  title: string;
  slug?: string;
  content: string;
  kind: 'news' | 'event';
  status?: 'draft' | 'published';
  featured_image?: string | null;
  event_date?: string | null;
  created_by?: string | null;
  updated_at?: string;
}

interface AdminUserRecordLike {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'editor';
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminUserInsertLike {
  user_id: string;
  role?: 'super_admin' | 'admin' | 'editor';
  full_name?: string;
  updated_at?: string;
}

interface CommentRecordLike {
  id: string;
  post_id: string;
  user_id: string | null;
  author_name: string | null;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface CommentInsertLike {
  post_id: string;
  user_id?: string;
  author_name?: string;
  content: string;
  status?: 'pending' | 'approved' | 'rejected';
  updated_at?: string;
}

interface MediaRecordLike {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  uploaded_by: string;
  created_at: string;
}

interface MediaInsertLike {
  file_name: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  uploaded_by: string;
}

interface AnalyticsRecordLike {
  id: string;
  event_type: string;
  event_data: Record<string, unknown> | null;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
}

interface AnalyticsInsertLike {
  event_type: string;
  event_data?: Record<string, unknown>;
  user_id?: string;
  session_id?: string;
}

interface AdminLogRecordLike {
  id: string;
  user_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

interface AdminLogInsertLike {
  user_id?: string | null;
  action: string;
  target_type: string;
  target_id?: string | null;
  details?: Record<string, unknown>;
}

interface AdminEventRecordLike {
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
  created_by: string | null;
}

interface AdminEventInsertLike {
  title: string;
  slug: string;
  summary: string;
  description: string;
  event_date_gregorian: string;
  event_date_hijri: string;
  location?: string | null;
  status?: 'draft' | 'published';
  created_by?: string | null;
  cover_image_url?: string | null;
  cover_thumbnail_url?: string | null;
  updated_at?: string;
}

interface AdminEventImageRecordLike {
  id: string;
  event_id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  thumbnail_path: string;
  thumbnail_url: string;
  mime_type: string;
  size_bytes: number;
  sort_order: number;
  is_cover: boolean;
  uploaded_by: string | null;
  created_at: string;
}

interface AdminEventImageInsertLike {
  event_id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  thumbnail_path: string;
  thumbnail_url: string;
  mime_type: string;
  size_bytes: number;
  sort_order: number;
  is_cover?: boolean;
  uploaded_by?: string | null;
}

interface PoetryEntryRecordLike {
  id: string;
  title: string;
  poet_name: string;
  story: string | null;
  poem_text: string;
  source: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

interface PoetryEntryInsertLike {
  title: string;
  poet_name: string;
  story?: string | null;
  poem_text: string;
  source?: string | null;
  status?: 'draft' | 'published';
  created_by?: string | null;
  updated_at?: string;
}

interface QueryResult<T> {
  data: T | null;
  error: SupabaseErrorLike;
  count?: number | null;
  status?: number;
  statusText?: string;
}

interface OrderOptions {
  ascending?: boolean;
}

type SelectQuery<T> = Promise<QueryResult<T[]>> & {
  order(column: string, options?: OrderOptions): SelectQuery<T>;
  eq(column: string, value: string | number | boolean | null): SelectQuery<T>;
  neq(column: string, value: string | number | boolean | null): SelectQuery<T>;
  in(column: string, values: string[]): SelectQuery<T>;
  or(filters: string, options?: { foreignTable: string }): SelectQuery<T>;
  gte(column: string, value: string): SelectQuery<T>;
  lte(column: string, value: string): SelectQuery<T>;
  gt(column: string, value: string): SelectQuery<T>;
  lt(column: string, value: string): SelectQuery<T>;
  is(column: string, value: null): SelectQuery<T>;
  limit(count: number): SelectQuery<T>;
  range(from: number, to: number): SelectQuery<T>;
  single(): Promise<QueryResult<T>>;
  maybeSingle(): Promise<QueryResult<T>>;
};

type MutationQuery<T> = Promise<QueryResult<null>> & {
  eq(column: string, value: string | number | boolean | null): MutationQuery<T>;
  neq(column: string, value: string | number | boolean | null): MutationQuery<T>;
  in(column: string, values: string[]): MutationQuery<T>;
  select(columns?: string): SelectQuery<T>;
};

interface AdminPostsTable {
  select(columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated' }): SelectQuery<AdminPostRecordLike>;
  insert(payload: AdminPostInsertLike | AdminPostInsertLike[]): Promise<QueryResult<AdminPostRecordLike[]>>;
  update(payload: Partial<AdminPostInsertLike>): MutationQuery<AdminPostRecordLike>;
  delete(): MutationQuery<AdminPostRecordLike>;
}

interface AdminUsersTable {
  select(columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated' }): SelectQuery<AdminUserRecordLike>;
  insert(payload: AdminUserInsertLike | AdminUserInsertLike[]): Promise<QueryResult<AdminUserRecordLike[]>>;
  update(payload: Partial<AdminUserInsertLike>): MutationQuery<AdminUserRecordLike>;
  delete(): MutationQuery<AdminUserRecordLike>;
}

interface CommentsTable {
  select(columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated' }): SelectQuery<CommentRecordLike>;
  insert(payload: CommentInsertLike | CommentInsertLike[]): Promise<QueryResult<CommentRecordLike[]>>;
  update(payload: Partial<CommentInsertLike>): MutationQuery<CommentRecordLike>;
  delete(): MutationQuery<CommentRecordLike>;
}

interface MediaTable {
  select(columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated' }): SelectQuery<MediaRecordLike>;
  insert(payload: MediaInsertLike | MediaInsertLike[]): Promise<QueryResult<MediaRecordLike[]>>;
  delete(): MutationQuery<MediaRecordLike>;
}

interface AnalyticsTable {
  select(columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated' }): SelectQuery<AnalyticsRecordLike>;
  insert(payload: AnalyticsInsertLike | AnalyticsInsertLike[]): Promise<QueryResult<AnalyticsRecordLike[]>>;
}

interface AdminLogsTable {
  select(columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated' }): SelectQuery<AdminLogRecordLike>;
  insert(payload: AdminLogInsertLike | AdminLogInsertLike[]): Promise<QueryResult<AdminLogRecordLike[]>>;
}

interface AdminEventsTable {
  select(columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated' }): SelectQuery<AdminEventRecordLike>;
  insert(payload: AdminEventInsertLike | AdminEventInsertLike[]): MutationQuery<AdminEventRecordLike>;
  update(payload: Partial<AdminEventInsertLike>): MutationQuery<AdminEventRecordLike>;
  delete(): MutationQuery<AdminEventRecordLike>;
}

interface AdminEventImagesTable {
  select(columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated' }): SelectQuery<AdminEventImageRecordLike>;
  insert(payload: AdminEventImageInsertLike | AdminEventImageInsertLike[]): MutationQuery<AdminEventImageRecordLike>;
  update(payload: Partial<AdminEventImageInsertLike>): MutationQuery<AdminEventImageRecordLike>;
  delete(): MutationQuery<AdminEventImageRecordLike>;
}

interface PoetryEntriesTable {
  select(columns?: string, options?: { count?: 'exact' | 'planned' | 'estimated' }): SelectQuery<PoetryEntryRecordLike>;
  insert(payload: PoetryEntryInsertLike | PoetryEntryInsertLike[]): MutationQuery<PoetryEntryRecordLike>;
  update(payload: Partial<PoetryEntryInsertLike>): MutationQuery<PoetryEntryRecordLike>;
  delete(): MutationQuery<PoetryEntryRecordLike>;
}

interface StorageBucket {
  from(bucket: string): {
    upload(path: string, file: File | Blob, options?: { contentType?: string; upsert?: boolean }): Promise<{ data: { path: string } | null; error: SupabaseErrorLike }>;
    getPublicUrl(path: string): { data: { publicUrl: string } };
    remove(paths: string[]): Promise<{ error: SupabaseErrorLike }>;
    list(prefix?: string, options?: { limit?: number }): Promise<{ data: { name: string }[] | null; error: SupabaseErrorLike }>;
  };
}

interface SupabaseLike {
  auth: {
    signInWithPassword(credentials: { email: string; password: string }): Promise<{
      data: { user: User | null; session: Session | null };
      error: SupabaseErrorLike;
    }>;
    signInWithOAuth(options: { provider: string; options?: Record<string, unknown> }): Promise<{
      data: { url: string | null; provider: string | null };
      error: SupabaseErrorLike;
    }>;
    signUp(credentials: { email: string; password: string }): Promise<{
      data: { user: User | null; session: Session | null };
      error: SupabaseErrorLike;
    }>;
    signOut(): Promise<{ error: SupabaseErrorLike }>;
    getSession(): Promise<{ data: { session: Session | null } }>;
    setSession(credentials: { access_token: string; refresh_token: string }): Promise<{
      data: { session: Session | null; user: User | null };
      error: SupabaseErrorLike;
    }>;
    exchangeCodeForSession(code: string): Promise<{
      data: { session: Session | null; user: User | null };
      error: SupabaseErrorLike;
    }>;
    getUser(): Promise<{ data: { user: User | null } }>;
    onAuthStateChange(
      callback: (event: AuthChangeEvent, session: Session | null) => void,
    ): { data: { subscription: { unsubscribe(): void } } };
    admin: {
      getUserById(userId: string): Promise<{ data: { user: User | null } }>;
    };
  };
  rpc<T>(fn: string, args?: Record<string, string | number | boolean | null | undefined>): Promise<QueryResult<T>>;
  from(table: 'admin_posts'): AdminPostsTable;
  from(table: 'admin_users'): AdminUsersTable;
  from(table: 'comments'): CommentsTable;
  from(table: 'media'): MediaTable;
  from(table: 'analytics'): AnalyticsTable;
  from(table: 'admin_logs'): AdminLogsTable;
  from(table: 'admin_events'): AdminEventsTable;
  from(table: 'admin_event_images'): AdminEventImagesTable;
  from(table: 'poetry_entries'): PoetryEntriesTable;
  storage: StorageBucket;
}

const viteEnv =
  typeof import.meta !== 'undefined'
    ? (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    : undefined;

const SUPABASE_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL) ||
  viteEnv?.NEXT_PUBLIC_SUPABASE_URL ||
  viteEnv?.VITE_SUPABASE_URL ||
  '';

const SUPABASE_PUBLISHABLE_KEY =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  viteEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  viteEnv?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  viteEnv?.VITE_SUPABASE_ANON_KEY ||
  '';

let client: SupabaseLike | null = null;

try {
    if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
      client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      }) as unknown as SupabaseLike;
    }
  } catch (error) {
  console.warn('Supabase initialization skipped:', error);
}

const createQueryResult = <T>(data: T | null = null, error: SupabaseErrorLike = null): QueryResult<T> => ({
  data,
  error,
});

const createNoopSelectQuery = <T>(): SelectQuery<T> => {
  const query = Promise.resolve(
    createQueryResult<T[]>([]),
  ) as unknown as SelectQuery<T>;

  query.order = () => createNoopSelectQuery<T>();
  query.eq = () => createNoopSelectQuery<T>();
  query.neq = () => createNoopSelectQuery<T>();
  query.in = () => createNoopSelectQuery<T>();
  query.or = () => createNoopSelectQuery<T>();
  query.gte = () => createNoopSelectQuery<T>();
  query.lte = () => createNoopSelectQuery<T>();
  query.gt = () => createNoopSelectQuery<T>();
  query.lt = () => createNoopSelectQuery<T>();
  query.is = () => createNoopSelectQuery<T>();
  query.limit = () => createNoopSelectQuery<T>();
  query.range = () => createNoopSelectQuery<T>();
  query.single = () => Promise.resolve(createQueryResult<T>(null));
  query.maybeSingle = () => Promise.resolve(createQueryResult<T>(null));

  return query;
};

const createNoopMutationQuery = <T>(): MutationQuery<T> => {
  const query = Promise.resolve(
    createQueryResult<null>(null),
  ) as unknown as MutationQuery<T>;

  query.eq = () => createNoopMutationQuery<T>();
  query.neq = () => createNoopMutationQuery<T>();
  query.in = () => createNoopMutationQuery<T>();
  query.select = () => createNoopSelectQuery<T>();

  return query;
};

const noopClient: SupabaseLike = {
  auth: {
    signInWithPassword: () => Promise.resolve({
      data: { user: null, session: null },
      error: { message: 'Supabase is not configured' },
    }),
    signOut: () => Promise.resolve({ error: null }),
    signInWithOAuth: () => Promise.resolve({ data: { url: null, provider: null }, error: { message: 'Supabase is not configured' } }),
    signUp: () => Promise.resolve({
      data: { user: null, session: null },
      error: { message: 'Supabase is not configured' },
    }),
    getSession: () => Promise.resolve({ data: { session: null } }),
    setSession: () => Promise.resolve({
      data: { session: null, user: null },
      error: { message: 'Supabase is not configured' },
    }),
    exchangeCodeForSession: () => Promise.resolve({
      data: { session: null, user: null },
      error: { message: 'Supabase is not configured' },
    }),
    getUser: () => Promise.resolve({ data: { user: null } }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe() {},
        },
      },
    }),
    admin: {
      getUserById: () => Promise.resolve({ data: { user: null } }),
    },
  },
  rpc: () => Promise.resolve(createQueryResult(null)),
  from: (() => {
    const createTable = <T>(): { select: () => SelectQuery<T>; insert: () => Promise<QueryResult<T[]>>; update: () => MutationQuery<T>; delete: () => MutationQuery<T> } => ({
      select: () => createNoopSelectQuery<T>(),
      insert: () => Promise.resolve(createQueryResult<T[]>([])),
      update: () => createNoopMutationQuery<T>(),
      delete: () => createNoopMutationQuery<T>(),
    });

    return (table: string) => {
      if (table === 'admin_posts') return createTable<AdminPostRecordLike>();
      if (table === 'admin_users') return createTable<AdminUserRecordLike>();
      if (table === 'comments') return createTable<CommentRecordLike>();
      if (table === 'media') return createTable<MediaRecordLike>();
      if (table === 'analytics') {
        return {
          select: () => createNoopSelectQuery<AnalyticsRecordLike>(),
          insert: () => Promise.resolve(createQueryResult<AnalyticsRecordLike[]>([])),
        };
      }
      if (table === 'admin_logs') {
        return {
          select: () => createNoopSelectQuery<AdminLogRecordLike>(),
          insert: () => Promise.resolve(createQueryResult<AdminLogRecordLike[]>([])),
          update: () => createNoopMutationQuery<AdminLogRecordLike>(),
          delete: () => createNoopMutationQuery<AdminLogRecordLike>(),
        };
      }
      if (table === 'admin_events') {
        return {
          select: () => createNoopSelectQuery<AdminEventRecordLike>(),
          insert: () => createNoopMutationQuery<AdminEventRecordLike>(),
          update: () => createNoopMutationQuery<AdminEventRecordLike>(),
          delete: () => createNoopMutationQuery<AdminEventRecordLike>(),
        };
      }
      if (table === 'admin_event_images') {
        return {
          select: () => createNoopSelectQuery<AdminEventImageRecordLike>(),
          insert: () => createNoopMutationQuery<AdminEventImageRecordLike>(),
          update: () => createNoopMutationQuery<AdminEventImageRecordLike>(),
          delete: () => createNoopMutationQuery<AdminEventImageRecordLike>(),
        };
      }
      if (table === 'poetry_entries') {
        return {
          select: () => createNoopSelectQuery<PoetryEntryRecordLike>(),
          insert: () => createNoopMutationQuery<PoetryEntryRecordLike>(),
          update: () => createNoopMutationQuery<PoetryEntryRecordLike>(),
          delete: () => createNoopMutationQuery<PoetryEntryRecordLike>(),
        };
      }
      return createTable<AdminPostRecordLike>();
    };
  })() as unknown as SupabaseLike['from'],
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'Supabase is not configured' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      remove: () => Promise.resolve({ error: null }),
      list: () => Promise.resolve({ data: [], error: null }),
    }),
  },
};

export const supabase: SupabaseLike = client ?? noopClient;
export const isSupabaseConfigured = (): boolean => client !== null;
