/**
 * إدارة الإحصائيات
 */

import { supabase } from './supabase';
import type { Json, Tables, TablesInsert } from './database.types';

export type AnalyticsEventType = 'page_view' | 'user_visit' | 'post_view' | 'post_click';

export type AnalyticsEvent = Omit<Tables<'analytics'>, 'event_type' | 'event_data'> & {
  event_type: AnalyticsEventType;
  event_data: Record<string, unknown> | null;
};

export type AnalyticsInsert = Omit<TablesInsert<'analytics'>, 'event_type' | 'event_data'> & {
  event_type: Exclude<AnalyticsEventType, 'post_click'>;
  event_data?: Record<string, unknown> & Json;
};

type ApiError = { message: string };

/**
 * تسجيل حدث إحصائي
 */
export async function trackEvent(event: AnalyticsInsert): Promise<{ error: ApiError | null }> {
  const { error } = await supabase
    .from('analytics')
    .insert(event);

  return { error: error };
}

/**
 * جلب الإحصائيات حسب نوع الحدث
 */
export async function fetchAnalyticsByEventType(
  eventType: string,
  limit = 100,
): Promise<{ data: AnalyticsEvent[]; error: null } | { data: null; error: ApiError }> {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('event_type', eventType)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return { data: null, error };
  }

  return { data: (data ?? []), error: null };
}

/**
 * جلب عدد الأحداث حسب النوع
 */
export async function fetchEventCounts(days = 30): Promise<{ data: Record<string, number>; error: null } | { data: null; error: ApiError }> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('analytics')
    .select('event_type')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  // حساب عدد الأحداث لكل نوع
  const counts: Record<string, number> = {};
  const rows: Array<{ event_type: string }> = (data ?? []);
  for (const row of rows) {
    counts[row.event_type] = (counts[row.event_type] ?? 0) + 1;
  }

  return { data: counts, error: null };
}

/**
 * جلب إحصائيات الفترة الزمنية
 */
export async function fetchAnalyticsByDateRange(
  startDate: Date,
  endDate: Date,
): Promise<{ data: AnalyticsEvent[]; error: null } | { data: null; error: ApiError }> {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false })
    .limit(5000);

  if (error) {
    return { data: null, error };
  }

  return { data: (data ?? []), error: null };
}

/**
 * جلب إحصائيات الزوار الفريدين
 */
export async function fetchUniqueVisitors(days = 30): Promise<{ data: number; error: null } | { data: null; error: ApiError }> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('analytics')
    .select('session_id')
    .gte('created_at', startDate.toISOString());

  if (error) {
    return { data: null, error };
  }

  // حساب عدد الجلسات الفريدة
  const rows: Array<{ session_id: string | null }> = (data ?? []);
  const uniqueSessions = new Set(
    rows.map(r => r.session_id).filter((id): id is string => Boolean(id))
  );

  return { data: uniqueSessions.size, error: null };
}
