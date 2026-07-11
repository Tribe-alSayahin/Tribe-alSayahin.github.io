import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Users, Eye, TrendingUp } from 'lucide-react';
import {
  fetchEventCounts,
  fetchUniqueVisitors,
  fetchAnalyticsByEventType,
} from '../../lib/analytics';

export function AnalyticsDashboard() {
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    const [countsResult, visitorsResult] = await Promise.all([
      fetchEventCounts(),
      fetchUniqueVisitors(30),
    ]);

    if (countsResult.data) {
      setEventCounts(countsResult.data);
    }

    if (visitorsResult.data !== null) {
      setUniqueVisitors(visitorsResult.data);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const eventLabels: Record<string, { label: string; icon: typeof BarChart3 }> = {
    page_view: { label: 'مشاهدات الصفحة', icon: Eye },
    user_visit: { label: 'زيارات المستخدمين', icon: Users },
    post_click: { label: 'نقرات المنشورات', icon: TrendingUp },
  };

  const totalEvents = Object.values(eventCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      {/* رأس القسم */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-brass-lt" />
        </div>
        <div>
          <h3 className="font-ruqaa text-xl text-sand">لوحة الإحصائيات</h3>
          <p className="text-sm text-sand-dim">نظرة عامة على أداء الموقع</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm font-kufi text-sand-dim">جارٍ تحميل الإحصائيات...</p>
      ) : (
        <>
          {/* بطاقات الملخص */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-brass/20 bg-ink-2/60 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-emerald-lt" />
                <span className="text-sm text-sand-dim">الزوار الفريدين</span>
              </div>
              <p className="font-ruqaa text-3xl text-sand">{uniqueVisitors}</p>
              <p className="text-xs text-sand-dim mt-1">آخر 30 يوم</p>
            </div>

            <div className="rounded-xl border border-brass/20 bg-ink-2/60 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-5 h-5 text-brass-lt" />
                <span className="text-sm text-sand-dim">إجمالي الأحداث</span>
              </div>
              <p className="font-ruqaa text-3xl text-sand">{totalEvents}</p>
              <p className="text-xs text-sand-dim mt-1">جميع الأنواع</p>
            </div>

            <div className="rounded-xl border border-brass/20 bg-ink-2/60 p-5">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-sunset-lt" />
                <span className="text-sm text-sand-dim">أنواع الأحداث</span>
              </div>
              <p className="font-ruqaa text-3xl text-sand">{Object.keys(eventCounts).length}</p>
              <p className="text-xs text-sand-dim mt-1">مختلفة</p>
            </div>
          </div>

          {/* تفاصيل الأحداث */}
          <div className="rounded-xl border border-brass/20 bg-ink-2/60 p-5">
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
                          <Icon className="w-4 h-4 text-brass-lt" />
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
        </>
      )}
    </div>
  );
}
