import { supabase } from './supabase';
import type { Tables, TablesInsert, TablesUpdate } from './database.types';

export type AdminPostKind = 'news' | 'event';
export type AdminPostStatus = 'draft' | 'published';

export type AdminPostRecord = Omit<Tables<'admin_posts'>, 'kind' | 'status'> & {
  kind: AdminPostKind;
  status: AdminPostStatus;
};

export type AdminPostInsert = Omit<TablesInsert<'admin_posts'>, 'kind' | 'status'> & {
  kind: AdminPostKind;
  status?: AdminPostStatus;
};

export type AdminPostUpdate = Omit<TablesUpdate<'admin_posts'>, 'kind' | 'status'> & {
  kind?: AdminPostKind;
  status?: AdminPostStatus;
};

export interface FetchPostsOptions {
  kind?: AdminPostKind | 'all';
  status?: AdminPostStatus | 'all';
  search?: string;
  sortBy?: 'created_at' | 'title' | 'updated_at';
  ascending?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * اسم موثّق القبيلة المعتمد الذي يُنسب إليه كل المحتوى المنشور.
 */
export const VERIFIED_AUTHOR_NAME = 'حسين بن علي بن بعاج ابن مسيلم';

/**
 * رسالة خطأ واضحة عند غياب جدول admin_posts في قاعدة البيانات.
 */
export const SCHEMA_CACHE_ERROR_MESSAGE =
  'جدول admin_posts غير موجود في قاعدة البيانات. يرجى تنفيذ ملف supabase-setup.sql في Supabase SQL Editor ثم إعادة المحاولة.';

/** يكشف ما إذا كان الخطأ ناتجاً عن غياب الجدول في schema cache. */
export const isSchemaNotFoundError = (message: string): boolean =>
  message.includes('schema cache') ||
  message.includes('admin_posts') ||
  message.includes('relation') ||
  message.includes('does not exist');

export const fetchAdminPosts = async (options: FetchPostsOptions = {}) => {
  const {
    kind = 'all',
    status = 'all',
    search = '',
    sortBy = 'created_at',
    ascending = false,
    page = 1,
    pageSize = 10,
  } = options;

  let query = supabase
    .from('admin_posts')
    .select('id,title,slug,content,kind,status,featured_image,event_date,created_at,updated_at,created_by', { count: 'exact' });

  if (kind !== 'all') {
    query = query.eq('kind', kind);
  }
  if (status !== 'all') {
    query = query.eq('status', status);
  }
  if (search.trim()) {
    query = query.or(`title.ilike.%${search.trim()}%,content.ilike.%${search.trim()}%`);
  }

  query = query.order(sortBy, { ascending });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const result = await query;

  if (result.error && isSchemaNotFoundError(result.error.message)) {
    return { ...result, error: { ...result.error, message: SCHEMA_CACHE_ERROR_MESSAGE } };
  }

  return result;
};

export const fetchAdminPostById = async (id: string) => {
  const result = await supabase
    .from('admin_posts')
    .select('id,title,slug,content,kind,status,featured_image,event_date,created_at,updated_at,created_by')
    .eq('id', id)
    .single();

  if (result.error && isSchemaNotFoundError(result.error.message)) {
    return { ...result, error: { ...result.error, message: SCHEMA_CACHE_ERROR_MESSAGE } };
  }

  return result;
};

const GREGORIAN_DATE_REGEX = /^\d{4}-\d{2}-\d{2}/;

export const formatGregorianDateArabic = (value: string | null): string => {
  if (!value) {
    return 'بدون تاريخ';
  }

  const source = GREGORIAN_DATE_REGEX.test(value) ? value : value.slice(0, 10);
  const date = new Date(source);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ar-SA-u-nu-arab', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};
