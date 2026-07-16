import { Edit, Trash2 } from 'lucide-react';
import type { PoetryEntry, PoetryStatus } from '../../lib/poetry';

const statusLabels: Record<PoetryStatus, string> = {
  draft: 'مسودة',
  published: 'منشور',
};

interface PoetryEntryListProps {
  entries: PoetryEntry[];
  loading: boolean;
  onDelete: (entry: PoetryEntry) => void;
  onEdit: (entry: PoetryEntry) => void;
}

export function PoetryEntryList({ entries, loading, onDelete, onEdit }: PoetryEntryListProps) {
  return (
    <section className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
      {loading ? (
        <p className="text-sm font-kufi text-sand-dim py-8 text-center">جارٍ تحميل القصائد...</p>
      ) : entries.length === 0 ? (
        <p className="text-sm font-kufi text-sand-dim py-8 text-center">لا توجد قصائد مدخلة بعد.</p>
      ) : (
        <div className="grid gap-3">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-xl border border-brass/15 bg-ink/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[10px] font-kufi px-2 py-0.5 rounded-full border ${
                      entry.status === 'published'
                        ? 'bg-emerald/10 text-emerald-lt border-emerald/20'
                        : 'bg-sand-dim/10 text-sand-dim border-sand-dim/20'
                    }`}>
                      {statusLabels[entry.status]}
                    </span>
                    <span className="text-xs font-kufi text-sand-dim">{entry.poet_name}</span>
                  </div>
                  <h4 className="font-serif text-base text-sand">{entry.title}</h4>
                  <p className="text-sm text-sand-dim mt-1 line-clamp-2">{entry.poem_text}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEdit(entry)}
                    className="p-2 rounded-lg border border-brass/35 text-brass-lt hover:bg-brass/10 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
                    aria-label="تعديل القصيدة"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry)}
                    className="p-2 rounded-lg border border-copper/40 text-copper hover:bg-copper/10 transition-colors focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
                    aria-label="حذف القصيدة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
