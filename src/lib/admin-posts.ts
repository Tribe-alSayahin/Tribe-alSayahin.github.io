import { supabase } from './supabase';

export type AdminPostKind = 'news' | 'event';

export interface AdminPostRecord {
  id: string;
  title: string;
  content: string;
  kind: AdminPostKind;
  event_date: string | null;
  created_at: string;
  created_by: string | null;
}

export interface AdminPostInsert {
  title: string;
  content: string;
  kind: AdminPostKind;
  event_date?: string | null;
  created_by?: string | null;
}

/**
 * اسم موثّق القبيلة المعتمد الذي يُنسب إليه كل المحتوى المنشور.
 */
export const VERIFIED_AUTHOR_NAME = 'حسين بن علي بن بعاج ابن مسيلم';

/**
 * رسالة خطأ واضحة عند غياب جدول admin_posts في قاعدة البيانات.
 * يحدث هذا عادةً عند عدم تنفيذ supabase-setup.sql أو عند انتهاء صلاحية schema cache في PostgREST.
 */
export const SCHEMA_CACHE_ERROR_MESSAGE =
  'جدول admin_posts غير موجود في قاعدة البيانات. يرجى تنفيذ ملف supabase-setup.sql في Supabase SQL Editor ثم إعادة المحاولة.';

/** يكشف ما إذا كان الخطأ ناتجاً عن غياب الجدول في schema cache. */
export const isSchemaNotFoundError = (message: string): boolean =>
  message.includes('schema cache') ||
  message.includes('admin_posts') ||
  message.includes('relation') ||
  message.includes('does not exist');

export const fetchAdminPosts = async () => {
  const result = await supabase
    .from('admin_posts')
    .select('id,title,content,kind,event_date,created_at,created_by')
    .order('created_at', { ascending: false });

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
