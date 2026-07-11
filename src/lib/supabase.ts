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

const createNoopSelectQuery = (): AdminPostsSelectQuery => {
  const query = Promise.resolve(
    createQueryResult<AdminPostRecordLike[]>([]),
  ) as unknown as AdminPostsSelectQuery;

  query.order = () => createNoopSelectQuery();
  query.eq = () => createNoopSelectQuery();
  query.limit = () => createNoopSelectQuery();
  query.single = () => Promise.resolve(createQueryResult<AdminPostRecordLike>(null));

  return query;
};

const createNoopMutationQuery = (): AdminPostsMutationQuery => {
  const query = Promise.resolve(
    createQueryResult<null>(null),
  ) as unknown as AdminPostsMutationQuery;

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
  from: () => ({
    select: () => createNoopSelectQuery(),
    insert: () => Promise.resolve(createQueryResult<null>(null)),
    update: () => createNoopMutationQuery(),
    delete: () => createNoopMutationQuery(),
  }),
};

export const supabase: SupabaseLike = client ?? noopClient;
export const isSupabaseConfigured = (): boolean => client !== null;
