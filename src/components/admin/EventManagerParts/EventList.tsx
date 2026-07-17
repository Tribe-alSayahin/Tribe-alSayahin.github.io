import { MapPin, Pencil, Trash2 } from 'lucide-react';

import { formatEventDateArabic, type AdminEventRecord } from '../../../lib/events';

interface EventListProps {
  events: AdminEventRecord[];
  isLoading: boolean;
  onEdit: (event: AdminEventRecord) => void;
  onToggleStatus: (event: AdminEventRecord) => void;
  onDelete: (event: AdminEventRecord) => void;
}

export default function EventList({
  events,
  isLoading,
  onEdit,
  onToggleStatus,
  onDelete,
}: EventListProps) {
  return (
    <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
      {isLoading ? (
        <p className="text-sm font-kufi text-sand-dim py-8 text-center">جارٍ تحميل المناسبات...</p>
      ) : events.length === 0 ? (
        <p className="text-sm font-kufi text-sand-dim py-8 text-center">لا توجد مناسبات حالياً.</p>
      ) : (
        <div className="grid gap-3">
          {events.map((event) => (
            <article key={event.id} className="rounded-xl border border-brass/15 bg-ink/45 p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-full md:w-40 h-24 rounded-lg overflow-hidden border border-brass/15 bg-ink/50">
                  {event.cover_thumbnail_url ? (
                    <img src={event.cover_thumbnail_url} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-kufi text-sand-dim">بدون غلاف</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-base text-sand truncate">{event.title}</h4>
                  <p className="text-xs font-kufi text-brass-lt mt-1">
                    {formatEventDateArabic(event.event_date_gregorian)} • {event.event_date_hijri}
                  </p>
                  {event.location && (
                    <p className="text-xs text-sand-dim mt-1 inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      {event.location}
                    </p>
                  )}
                  <p className="text-sm text-sand-dim mt-2 line-clamp-2">{event.summary}</p>
                  <p className="text-xs font-kufi text-sand-dim/80 mt-2">عدد الصور: {event.image_count ?? 0}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEdit(event)}
                    className="p-2 rounded-lg border border-brass/35 text-brass-lt hover:bg-brass/10 transition-colors"
                    aria-label="تعديل المناسبة"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleStatus(event)}
                    className="px-3 py-2 rounded-lg border border-emerald/35 text-xs font-kufi text-emerald-lt hover:bg-emerald/10 transition-colors"
                  >
                    {event.status === 'published' ? 'إخفاء' : 'نشر'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(event)}
                    className="p-2 rounded-lg border border-copper/40 text-copper hover:bg-copper/10 transition-colors"
                    aria-label="حذف المناسبة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
