'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search, UserCircle, Users } from 'lucide-react';
import {
  fetchVisitorDirectory,
  formatVisitorDate,
  type VisitorDirectoryEntry,
} from '../../lib/visitor-directory';

const REFRESH_INTERVAL_MS = 60_000;

export function VisitorDirectory() {
  const [visitors, setVisitors] = useState<VisitorDirectoryEntry[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadVisitors = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    const result = await fetchVisitorDirectory();
    if (result.error) {
      setError(result.error.message);
    } else {
      setVisitors(result.data ?? []);
      setError('');
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    void loadVisitors();
    const interval = window.setInterval(() => void loadVisitors(true), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [loadVisitors]);

  const filteredVisitors = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return visitors;

    return visitors.filter((visitor) =>
      visitor.fullName.toLowerCase().includes(term) ||
      visitor.email.toLowerCase().includes(term),
    );
  }, [search, visitors]);

  const onlineCount = visitors.filter((visitor) => visitor.isOnline).length;

  return (
    <section className="space-y-5" aria-labelledby="visitor-directory-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-brass/25 bg-brass/8">
            <Users className="h-5 w-5 text-brass-lt" aria-hidden="true" />
          </div>
          <div>
            <h2 id="visitor-directory-title" className="font-ruqaa text-2xl text-sand">الزوار المسجلون</h2>
            <p className="text-sm text-sand-dim">الحسابات المسجلة وحالة حضورها الحالية</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void loadVisitors(true)}
          disabled={isRefreshing}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-brass/25 text-brass-lt transition-colors hover:bg-brass/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass disabled:opacity-50"
          aria-label="تحديث قائمة الزوار"
          title="تحديث القائمة"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-emerald/25 bg-emerald/8 px-4 py-3">
          <p className="text-xs font-kufi text-emerald-lt/85">متواجدون الآن</p>
          <p className="mt-1 font-ruqaa text-3xl text-sand">{onlineCount}</p>
        </div>
        <div className="rounded-lg border border-brass/20 bg-ink-2/60 px-4 py-3">
          <p className="text-xs font-kufi text-sand-dim">إجمالي المسجلين</p>
          <p className="mt-1 font-ruqaa text-3xl text-sand">{visitors.length}</p>
        </div>
      </div>

      <div className="rounded-lg border border-brass/20 bg-ink-2/60 p-5">
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-dim" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث بالاسم أو البريد الإلكتروني"
            className="w-full rounded-lg border border-brass/20 bg-ink/70 py-2.5 pl-3 pr-10 text-sm text-sand placeholder:text-sand-dim/60 focus:border-brass/50 focus:outline-none"
          />
        </div>

        {error ? (
          <p className="py-8 text-center text-sm font-kufi text-copper" role="alert">{error}</p>
        ) : isLoading ? (
          <p className="py-8 text-center text-sm font-kufi text-sand-dim">جارٍ تحميل الزوار...</p>
        ) : filteredVisitors.length === 0 ? (
          <p className="py-8 text-center text-sm font-kufi text-sand-dim">لا توجد حسابات مطابقة.</p>
        ) : (
          <div className="divide-y divide-brass/10">
            {filteredVisitors.map((visitor) => (
              <article key={visitor.userId} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
                {visitor.avatarUrl ? (
                  <img
                    src={visitor.avatarUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-full border border-brass/20 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserCircle className="h-12 w-12 shrink-0 text-brass-lt/75" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg text-sand">{visitor.fullName || 'مستخدم مسجل'}</h3>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-kufi ${visitor.isOnline ? 'text-emerald-lt' : 'text-sand-dim'}`}>
                      <span className={`h-2 w-2 rounded-full ${visitor.isOnline ? 'bg-emerald' : 'bg-sand-dim/40'}`} aria-hidden="true" />
                      {visitor.isOnline ? 'متواجد الآن' : 'غير متواجد'}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-xs text-sand-dim" dir="ltr">{visitor.email || 'لا يوجد بريد'}</p>
                  <p className="mt-1 text-xs text-sand-dim">
                    آخر ظهور: {formatVisitorDate(visitor.lastSeenAt)}
                  </p>
                </div>
                <div className="text-left text-xs font-kufi text-sand-dim">
                  <p>{visitor.provider === 'google' ? 'حساب Google' : 'حساب مسجل'}</p>
                  <p className="mt-1">انضم: {formatVisitorDate(visitor.createdAt)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs leading-6 text-sand-dim">
        تظهر حالة «متواجد الآن» للحساب المسجل الذي أرسل نبضة حضور خلال آخر دقيقتين. لا تُسجل الصفحة التي يتصفحها المستخدم.
      </p>
    </section>
  );
}
