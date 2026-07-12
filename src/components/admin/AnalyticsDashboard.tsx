'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart3, Users, Eye, TrendingUp, Calendar } from 'lucide-react';
import {
  fetchEventCounts,
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
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [periodDays, setPeriodDays] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = useCallback(async (days: number) => {
    setIsLoading(true);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [countsResult, visitorsResult, rangeResult] = await Promise.all([
      fetchEventCounts(),
      fetchUniqueVisitors(days),
      fetchAnalyticsByDateRange(startDate, endDate),
    ]);

    if (countsResult.data) {
      setEventCounts(countsResult.data);
    }

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
      const postId = event.event_data?.post_id;
      if (event.event_type === 'post_click' && typeof postId === 'string') {
        counts[postId] = (counts[postId] ?? 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [events]);

  const eventLabels: Record<string, { label: string; icon: typeof BarChart3 }> = {
    page_view: { label: 'مشاهدات الصفحة', icon: Eye },
    user_visit: { label: 'زيارات المستخدمين', icon: Users },
    post_click: { label: 'نقرات المنشورات', icon: TrendingUp },
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
                      label: eventType,
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
                <p className="text-sm text-sand-dim">لا توجد نقرات منشورات في هذه الفترة.</p>
              ) : (
                <div className="space-y-3">
                  {topPosts.map(([postId, count]) => (
                    <div
                      key={postId}
                      className="flex items-center justify-between p-3 rounded-xl border border-brass/10 bg-ink/50"
                    >
                      <span className="text-sm text-sand truncate" dir="ltr">
                        #{postId.slice(0, 8)}
                      </span>
                      <span className="text-sm font-kufi text-sand-dim">{count} نقر</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
