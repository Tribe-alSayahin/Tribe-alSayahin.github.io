'use client';

import { useState, useEffect, useCallback } from 'react';
import { Activity } from 'lucide-react';
import { fetchAdminLogs, AdminLog, actionLabels, actionColors } from '../../lib/admin-logs';

export function ActivityLog() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchAdminLogs(50);
    if (result.error) {
      setLogs([]);
    } else {
      setLogs(result.data ?? []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
          <Activity className="w-5 h-5 text-brass-lt" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-ruqaa text-xl text-sand">سجل النشاطات</h3>
          <p className="text-sm text-sand-dim">تتبع عمليات المشرفين والمحررين</p>
        </div>
      </div>

      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
        {isLoading ? (
          <p className="text-sm font-kufi text-sand-dim py-8 text-center">جارٍ تحميل السجل...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm font-kufi text-sand-dim py-8 text-center">لا توجد نشاطات مسجلة.</p>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-xl border border-brass/10 bg-ink/50"
              >
                <span className={`text-[10px] font-kufi px-2 py-0.5 rounded-full border ${actionColors[log.action]}`}>
                  {actionLabels[log.action]}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-sand">
                    {log.target_type}
                    {log.target_id && (
                      <span className="text-sand-dim/70 text-xs mx-1" dir="ltr">
                        #{log.target_id.slice(0, 8)}
                      </span>
                    )}
                  </p>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <p className="text-xs text-sand-dim/70 mt-1 line-clamp-1">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                  <p className="text-xs text-sand-dim/60 mt-2">
                    {new Date(log.created_at).toLocaleString('ar-SA')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
