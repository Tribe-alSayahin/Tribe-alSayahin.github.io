import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { NEWS_EVENTS_DATA, type NewsEntry, type NewsEntryType, type SupabaseNewsRow } from './NewsEvents.data';

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

const mapSupabaseToEntry = (item: SupabaseNewsRow): NewsEntry => ({
  id: item.id,
  type: 'news',
  title: item.title,
  date: item.published_at || '',
  summary: item.summary || '',
  details: item.content || undefined,
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
        const { data: supabaseData } = await supabase
          .from('news')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

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
            className={`font-kufi text-xs md:text-sm px-4 py-2 rounded-lg border transition-all duration-300 ${
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
                className="group relative rounded-2xl border border-brass/10 bg-ink-2/40 p-6 hover:border-brass/30 transition-all duration-300"
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
    </div>
  );
}
