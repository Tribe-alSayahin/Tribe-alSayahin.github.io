import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BadgeCheck } from 'lucide-react';
import { NEWS_EVENTS_DATA, type NewsEntry, type NewsEntryType } from './NewsEvents.data';
import { fetchAdminPosts, formatGregorianDateArabic, type AdminPostRecord } from '../lib/admin-posts';
import { isSupabaseConfigured } from '../lib/supabase';

type FilterType = 'all' | NewsEntryType;

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'news', label: 'أخبار' },
  { key: 'event', label: 'مناسبات' },
];

const TYPE_STYLES: Record<NewsEntryType, { badge: string; dot: string; label: string }> = {
  news: {
    badge: 'bg-olive-lt/20 text-olive-lt border-olive-lt/30',
    dot: 'bg-olive-lt',
    label: 'خبر',
  },
  event: {
    badge: 'bg-copper/20 text-copper border-copper/30',
    dot: 'bg-copper',
    label: 'مناسبة',
  },
};

const mapSupabaseToEntry = (item: AdminPostRecord): NewsEntry => ({
  id: item.id,
  type: item.kind,
  title: item.title,
  date: formatGregorianDateArabic(item.kind === 'event' ? item.event_date : item.created_at),
  summary: item.content,
  publisherName: 'حسين بن علي بن بعاج ابن مسيلم',
  isVerified: true,
});

export default function NewsEvents() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [data, setData] = useState<NewsEntry[]>(NEWS_EVENTS_DATA);

  useEffect(() => {
    const load = async () => {
      if (!isSupabaseConfigured()) {
        return;
      }
      try {
        const { data: supabaseData } = await fetchAdminPosts();

        if (supabaseData && supabaseData.length > 0) {
          setData(supabaseData.map(mapSupabaseToEntry));
        }
      } catch {
        // keep fallback data
      }
    };
    load();
  }, []);

  const filtered = filter === 'all'
    ? data
    : data.filter((item) => item.type === filter);

  return (
    <div className="mt-space-12">
      <div className="flex items-center gap-3 mb-space-8">
        {FILTER_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`font-kufi text-xs md:text-sm px-4 py-2 rounded-xl border transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
              filter === key
                ? 'bg-brass/15 border-brass/40 text-brass-lt'
                : 'bg-transparent border-brass/10 text-sand-dim hover:border-brass/25 hover:text-sand'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((entry) => {
            const style = TYPE_STYLES[entry.type];
            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="editorial-card interactive-lift group relative rounded-2xl p-6"
              >
                {/* Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-kufi font-semibold px-3 py-1 rounded-full border ${style.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {style.label}
                  </span>
                  {entry.tag && (
                    <span className="text-[10px] font-kufi text-brass-lt/60 bg-brass/5 px-2 py-0.5 rounded">
                      {entry.tag}
                    </span>
                  )}
                </div>

                {/* Date */}
                <time className="block font-serif text-sm text-brass-lt/80 mb-2">
                  {entry.date}
                </time>
                {entry.publisherName && (
                  <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-brass/25 bg-brass/8 px-2.5 py-1 text-[11px] font-kufi text-brass-lt">
                    <span>{entry.publisherName}</span>
                    {entry.isVerified && (
                      <BadgeCheck
                        aria-label="موثق"
                        className="w-3.5 h-3.5 text-azure shrink-0"
                      />
                    )}
                  </p>
                )}

                {/* Title */}
                <h3 className="font-serif text-xl font-bold text-sand leading-relaxed mb-3 group-hover:text-brass-lt transition-colors">
                  {entry.title}
                </h3>

                {/* Summary */}
                <p className="font-sans text-sm text-sand-dim leading-relaxed">
                  {entry.summary}
                </p>

                {/* Details */}
                {entry.details && (
                  <p className="font-sans text-xs text-sand-dim/70 leading-relaxed mt-3 border-t border-brass/8 pt-3">
                    {entry.details}
                  </p>
                )}

                {/* Decorative corner accent */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-brass/10 rounded-tl-2xl pointer-events-none" aria-hidden="true" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 rounded-xl border border-brass/15 bg-ink-2/30 px-4 py-5 text-center text-sm font-kufi text-sand-dim">
          لا توجد عناصر منشورة حالياً في قسم الإدارة.
        </div>
      )}
    </div>
  );
}
