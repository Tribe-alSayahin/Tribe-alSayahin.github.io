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

export const fetchAdminPosts = async () =>
  supabase
    .from('admin_posts')
    .select('id,title,content,kind,event_date,created_at,created_by')
    .order('created_at', { ascending: false });

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
