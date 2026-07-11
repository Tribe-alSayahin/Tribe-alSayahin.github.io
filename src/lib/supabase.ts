import { createClient, type AuthChangeEvent, type Session } from '@supabase/supabase-js';

type SupabaseErrorLike = { message: string } | null;

interface AdminPostRecordLike {
  id: string;
  title: string;
  content: string;
  kind: 'news' | 'event';
  event_date: string | null;
  created_at: string;
  created_by: string | null;
}

interface AdminPostInsertLike {
  title: string;
  content: string;
  kind: 'news' | 'event';
  event_date?: string | null;
  created_by?: string | null;
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

interface QueryResult<T> {
  data: T | null;
  error: SupabaseErrorLike;
}

interface OrderOptions {
  ascending?: boolean;
}

type AdminPostsSelectQuery = Promise<QueryResult<AdminPostRecordLike[]>> & {
  order(column: string, options?: OrderOptions): AdminPostsSelectQuery;
  eq(column: string, value: string): AdminPostsSelectQuery;
  limit(count: number): AdminPostsSelectQuery;
  single(): Promise<QueryResult<AdminPostRecordLike>>;
};

type AdminPostsMutationQuery = Promise<QueryResult<null>> & {
  eq(column: string, value: string): Promise<QueryResult<null>>;
};

interface AdminPostsTable {
  select(columns?: string): AdminPostsSelectQuery;
  insert(payload: AdminPostInsertLike): Promise<QueryResult<null>>;
  update(payload: Partial<AdminPostInsertLike>): AdminPostsMutationQuery;
  delete(): AdminPostsMutationQuery;
}

type AdminUsersSelectQuery = Promise<QueryResult<AdminUserRecordLike[]>> & {
  order(column: string, options?: OrderOptions): AdminUsersSelectQuery;
  eq(column: string, value: string): AdminUsersSelectQuery;
  single(): Promise<QueryResult<AdminUserRecordLike>>;
};

type AdminUsersMutationQuery = Promise<QueryResult<null>> & {
  eq(column: string, value: string): Promise<QueryResult<null>>;
};

interface AdminUsersTable {
  select(columns?: string): AdminUsersSelectQuery;
  insert(payload: AdminUserInsertLike): Promise<QueryResult<null>>;
  update(payload: Partial<AdminUserInsertLike>): AdminUsersMutationQuery;
  delete(): AdminUsersMutationQuery;
}

type CommentsSelectQuery = Promise<QueryResult<CommentRecordLike[]>> & {
  order(column: string, options?: OrderOptions): CommentsSelectQuery;
  eq(column: string, value: string): CommentsSelectQuery;
};

type CommentsMutationQuery = Promise<QueryResult<null>> & {
  eq(column: string, value: string): Promise<QueryResult<null>>;
};

interface CommentsTable {
  select(columns?: string): CommentsSelectQuery;
  insert(payload: CommentInsertLike): Promise<QueryResult<null>>;
  update(payload: Partial<CommentInsertLike>): CommentsMutationQuery;
  delete(): CommentsMutationQuery;
}

type MediaSelectQuery = Promise<QueryResult<MediaRecordLike[]>> & {
  order(column: string, options?: OrderOptions): MediaSelectQuery;
  eq(column: string, value: string): MediaSelectQuery;
};

type MediaMutationQuery = Promise<QueryResult<null>> & {
  eq(column: string, value: string): Promise<QueryResult<null>>;
};

interface MediaTable {
  select(columns?: string): MediaSelectQuery;
  insert(payload: MediaInsertLike): Promise<QueryResult<null>>;
  delete(): MediaMutationQuery;
}

type AnalyticsSelectQuery = Promise<QueryResult<AnalyticsRecordLike[]>> & {
  order(column: string, options?: OrderOptions): AnalyticsSelectQuery;
  eq(column: string, value: string): AnalyticsSelectQuery;
  limit(count: number): AnalyticsSelectQuery;
  gte(column: string, value: string): AnalyticsSelectQuery;
  lte(column: string, value: string): AnalyticsSelectQuery;
};

type AnalyticsMutationQuery = Promise<QueryResult<null>>;

interface AnalyticsTable {
  select(columns?: string): AnalyticsSelectQuery;
  insert(payload: AnalyticsInsertLike): AnalyticsMutationQuery;
}

interface StorageBucket {
  from(bucket: string): {
    upload(path: string, file: File): Promise<{ data: { path: string } | null; error: SupabaseErrorLike }>;
    getPublicUrl(path: string): { data: { publicUrl: string } };
  };
}

interface SupabaseLike {
  auth: {
    signInWithPassword(credentials: { email: string; password: string }): Promise<{ data: null; error: SupabaseErrorLike }>;
    signOut(): Promise<{ error: SupabaseErrorLike }>;
    getSession(): Promise<{ data: { session: Session | null } }>;
    onAuthStateChange(
      callback: (event: AuthChangeEvent, session: Session | null) => void,
    ): { data: { subscription: { unsubscribe(): void } } };
  };
  from(table: 'admin_posts'): AdminPostsTable;
  from(table: 'admin_users'): AdminUsersTable;
  from(table: 'comments'): CommentsTable;
  from(table: 'media'): MediaTable;
  from(table: 'analytics'): AnalyticsTable;
  storage: StorageBucket;
}

const env = import.meta.env;
const SUPABASE_URL =
  env.NEXT_PUBLIC_SUPABASE_URL ?? env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseLike | null = null;

try {
  if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
    client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
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

const createNoopSelectQuery = <T>(): Promise<QueryResult<T[]>> & {
  order: () => Promise<QueryResult<T[]>>;
  eq: () => Promise<QueryResult<T[]>>;
  limit: () => Promise<QueryResult<T[]>>;
  single: () => Promise<QueryResult<T>>;
} => {
  const query = Promise.resolve(
    createQueryResult<T[]>([]),
  ) as unknown as Promise<QueryResult<T[]>> & {
    order: () => Promise<QueryResult<T[]>>;
    eq: () => Promise<QueryResult<T[]>>;
    limit: () => Promise<QueryResult<T[]>>;
    single: () => Promise<QueryResult<T>>;
  };

  query.order = () => createNoopSelectQuery<T>();
  query.eq = () => createNoopSelectQuery<T>();
  query.limit = () => createNoopSelectQuery<T>();
  query.single = () => Promise.resolve(createQueryResult<T>(null));

  return query;
};

const createNoopMutationQuery = (): Promise<QueryResult<null>> & {
  eq: () => Promise<QueryResult<null>>;
} => {
  const query = Promise.resolve(
    createQueryResult<null>(null),
  ) as unknown as Promise<QueryResult<null>> & {
    eq: () => Promise<QueryResult<null>>;
  };

  query.eq = () => Promise.resolve(createQueryResult<null>(null));

  return query;
};

const noopClient: SupabaseLike = {
  auth: {
    signInWithPassword: () => Promise.resolve({
      data: null,
      error: { message: 'Supabase is not configured' },
    }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe() {},
        },
      },
    }),
  },
  from: (() => {
    const createTable = <T>() => ({
      select: () => createNoopSelectQuery<T>(),
      insert: () => Promise.resolve(createQueryResult<null>(null)),
      update: () => createNoopMutationQuery(),
      delete: () => createNoopMutationQuery(),
    });

    return (table: string) => {
      if (table === 'admin_posts') return createTable<AdminPostRecordLike>();
      if (table === 'admin_users') return createTable<AdminUserRecordLike>();
      if (table === 'comments') return createTable<CommentRecordLike>();
      if (table === 'media') return createTable<MediaRecordLike>();
      if (table === 'analytics') {
        return {
          select: () => createNoopSelectQuery<AnalyticsRecordLike>(),
          insert: () => Promise.resolve(createQueryResult<null>(null)),
        };
      }
      return createTable<AdminPostRecordLike>();
    };
  })() as any,
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'Supabase is not configured' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

export const supabase: SupabaseLike = client ?? noopClient;
export const isSupabaseConfigured = (): boolean => client !== null;
