'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart3, Users, Eye, TrendingUp, Calendar } from 'lucide-react';
import {
  fetchUniqueVisitors,
  fetchAnalyticsByDateRange,
  type AnalyticsEvent,
} from '../../lib/analytics';

const PERIOD_OPTIONS = [
  { value: 7, label: 'آخر 7 أيام' },
  { value: 30, label: 'آخر 30 يوم' },
  { value: 90, label: 'آخر 3 أشهر' },
  { value: 365, label: 'آخر سنة' },
];

export function AnalyticsDashboard() {
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [periodDays, setPeriodDays] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = useCallback(async (days: number) => {
    setIsLoading(true);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [visitorsResult, rangeResult] = await Promise.all([
      fetchUniqueVisitors(days),
      fetchAnalyticsByDateRange(startDate, endDate),
    ]);

    if (visitorsResult.data !== null) {
      setUniqueVisitors(visitorsResult.data);
    }

    if (rangeResult.data) {
      setEvents(rangeResult.data);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadAnalytics(periodDays);
  }, [loadAnalytics, periodDays]);

  const topPosts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of events) {
      const postSlug = event.event_data?.post_slug;
      if (event.event_type === 'post_view' && typeof postSlug === 'string') {
        counts[postSlug] = (counts[postSlug] ?? 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [events]);

  const topPages = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of events) {
      const path = event.event_data?.path;
      if (event.event_type === 'page_view' && typeof path === 'string') {
        counts[path] = (counts[path] ?? 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [events]);

  const eventCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of events) {
      counts[event.event_type] = (counts[event.event_type] ?? 0) + 1;
    }
    return counts;
  }, [events]);

  const eventLabels: Record<string, { label: string; icon: typeof BarChart3 }> = {
    page_view: { label: 'مشاهدات الصفحة', icon: Eye },
    user_visit: { label: 'زيارات المستخدمين', icon: Users },
    post_click: { label: 'نقرات المنشورات', icon: TrendingUp },
    post_view: { label: 'مشاهدات المنشورات', icon: TrendingUp },
  };

  const totalEvents = Object.values(eventCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-brass-lt" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-ruqaa text-xl text-sand">لوحة الإحصائيات</h3>
            <p className="text-sm text-sand-dim">نظرة عامة على أداء الموقع</p>
          </div>
        </div>
        <div className="relative">
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-dim" aria-hidden="true" />
          <select
            value={periodDays}
            onChange={(e) => setPeriodDays(Number(e.target.value))}
            className="rounded-lg border border-brass/20 bg-ink/70 pr-9 pl-3 py-2 text-sm text-sand focus:outline-none focus:border-brass/50 appearance-none"
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm font-kufi text-sand-dim py-8 text-center">جارٍ تحميل الإحصائيات...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-emerald-lt" aria-hidden="true" />
                <span className="text-sm text-sand-dim">الزوار الفريدين</span>
              </div>
              <p className="font-ruqaa text-3xl text-sand">{uniqueVisitors}</p>
              <p className="text-xs text-sand-dim mt-1">{PERIOD_OPTIONS.find((o) => o.value === periodDays)?.label}</p>
            </div>

            <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-5 h-5 text-brass-lt" aria-hidden="true" />
                <span className="text-sm text-sand-dim">إجمالي الأحداث</span>
              </div>
              <p className="font-ruqaa text-3xl text-sand">{totalEvents}</p>
              <p className="text-xs text-sand-dim mt-1">جميع الأنواع</p>
            </div>

            <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-sunset-lt" aria-hidden="true" />
                <span className="text-sm text-sand-dim">أنواع الأحداث</span>
              </div>
              <p className="font-ruqaa text-3xl text-sand">{Object.keys(eventCounts).length}</p>
              <p className="text-xs text-sand-dim mt-1">مختلفة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
              <h4 className="font-kufi text-lg text-brass-lt mb-4">تفاصيل الأحداث</h4>
              {Object.keys(eventCounts).length === 0 ? (
                <p className="text-sm text-sand-dim">لا توجد بيانات إحصائية حالياً.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(eventCounts).map(([eventType, count]) => {
                    const eventInfo = eventLabels[eventType] || {
                      label: 'نشاط آخر',
                      icon: BarChart3,
                    };
                    const Icon = eventInfo.icon;
                    const percentage = totalEvents > 0 ? (count / totalEvents) * 100 : 0;

                    return (
                      <div key={eventType} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-brass-lt" aria-hidden="true" />
                            <span className="text-sm text-sand">{eventInfo.label}</span>
                          </div>
                          <span className="text-sm font-kufi text-sand-dim">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-ink rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brass/50 to-brass transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
              <h4 className="font-kufi text-lg text-brass-lt mb-4">أكثر المنشورات زيارة</h4>
              {topPosts.length === 0 ? (
                <p className="text-sm text-sand-dim">لا توجد مشاهدات منشورات في هذه الفترة.</p>
              ) : (
                <div className="space-y-3">
                  {topPosts.map(([postSlug, count]) => (
                    <div
                      key={postSlug}
                      className="flex items-center justify-between p-3 rounded-xl border border-brass/10 bg-ink/50"
                    >
                      <span className="text-sm text-sand truncate" dir="ltr">
                        /news/{postSlug}
                      </span>
                      <span className="text-sm font-kufi text-sand-dim">{count} مشاهدة</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <section className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
            <h4 className="font-kufi text-lg text-brass-lt mb-4">الصفحات الأكثر مشاهدة</h4>
            {topPages.length === 0 ? (
              <p className="text-sm text-sand-dim">لا توجد مشاهدات صفحات في هذه الفترة.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {topPages.map(([path, count]) => (
                  <div key={path} className="flex items-center justify-between rounded-xl border border-brass/10 bg-ink/50 p-3">
                    <span className="truncate text-sm text-sand" dir="ltr">{path}</span>
                    <span className="text-xs font-kufi text-sand-dim">{count} مشاهدة</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
            <h4 className="font-kufi text-lg text-brass-lt mb-4">آخر النشاطات المسجلة</h4>
            {events.length === 0 ? (
              <p className="text-sm text-sand-dim">لا توجد نشاطات مسجلة في هذه الفترة.</p>
            ) : (
              <div className="divide-y divide-brass/10">
                {events.slice(0, 15).map((event) => {
                  const path = typeof event.event_data?.path === 'string' ? event.event_data.path : '/';
                  return (
                    <div key={event.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                      <div>
                        <p className="text-sm text-sand">{eventLabels[event.event_type]?.label ?? 'نشاط آخر'}</p>
                        <p className="mt-1 text-xs text-sand-dim" dir="ltr">{path}</p>
                      </div>
                      <time className="text-xs text-sand-dim" dateTime={event.created_at}>
                        {new Date(event.created_at).toLocaleString('ar-SA')}
                      </time>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
