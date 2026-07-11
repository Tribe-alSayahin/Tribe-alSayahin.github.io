/**
 * إدارة الإحصائيات
 */

import { supabase } from './supabase';

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  event_data: Record<string, unknown> | null;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
}

export interface AnalyticsInsert {
  event_type: string;
  event_data?: Record<string, unknown>;
  user_id?: string;
  session_id?: string;
}

/**
 * تسجيل حدث إحصائي
 */
export async function trackEvent(event: AnalyticsInsert) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('analytics')
    .insert(event);

  return { error };
}

/**
 * جلب الإحصائيات حسب نوع الحدث
 */
export async function fetchAnalyticsByEventType(eventType: string, limit = 100) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('analytics')
    .select('*')
    .eq('event_type', eventType)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * جلب عدد الأحداث حسب النوع
 */
export async function fetchEventCounts() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('analytics')
    .select('event_type')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  // حساب عدد الأحداث لكل نوع
  const counts: Record<string, number> = {};
  const rows: Array<{ event_type: string }> = data ?? [];
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
  endDate: Date
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('analytics')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * جلب إحصائيات الزوار الفريدين
 */
export async function fetchUniqueVisitors(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('analytics')
    .select('session_id')
    .gte('created_at', startDate.toISOString());

  if (error) {
    return { data: null, error };
  }

  // حساب عدد الجلسات الفريدة
  const rows: Array<{ session_id: string | null }> = data ?? [];
  const uniqueSessions = new Set(
    rows.map(r => r.session_id).filter((id): id is string => Boolean(id))
  );

  return { data: uniqueSessions.size, error: null };
}
