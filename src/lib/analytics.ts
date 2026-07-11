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
  const { error } = await supabase
    .from('analytics' as any)
    .insert(event as any);

  return { error };
}

/**
 * جلب الإحصائيات حسب نوع الحدث
 */
export async function fetchAnalyticsByEventType(eventType: string, limit = 100) {
  const { data, error } = await supabase
    .from('analytics' as any)
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
  const { data, error } = await supabase
    .from('analytics' as any)
    .select('event_type')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  // حساب عدد الأحداث لكل نوع
  const counts: Record<string, number> = {};
  data?.forEach((event: any) => {
    counts[event.event_type] = (counts[event.event_type] || 0) + 1;
  });

  return { data: counts, error: null };
}

/**
 * جلب إحصائيات الفترة الزمنية
 */
export async function fetchAnalyticsByDateRange(
  startDate: Date,
  endDate: Date
) {
  const { data, error } = await (supabase
    .from('analytics' as any)
    .select('*') as any)
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

  const { data, error } = await (supabase
    .from('analytics' as any)
    .select('session_id') as any)
    .gte('created_at', startDate.toISOString());

  if (error) {
    return { data: null, error };
  }

  // حساب عدد الجلسات الفريدة
  const uniqueSessions = new Set(data?.map((event: any) => event.session_id).filter(Boolean));

  return { data: uniqueSessions.size, error: null };
}
