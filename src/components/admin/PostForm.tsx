import { useState, type FormEvent } from 'react';
import {
  AdminPostKind,
  AdminPostStatus,
  AdminPostInsert,
  AdminPostUpdate,
} from '../../lib/admin-posts';

interface PostFormProps {
  initial?: {
    kind?: AdminPostKind;
    status?: AdminPostStatus;
    title?: string;
    content?: string;
    event_date?: string | null;
    featured_image?: string | null;
  };
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit: (payload: AdminPostInsert | AdminPostUpdate) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string;
}

const KIND_OPTIONS: { value: AdminPostKind; label: string }[] = [
  { value: 'news', label: 'خبر' },
  { value: 'event', label: 'مناسبة' },
];

const STATUS_OPTIONS: { value: AdminPostStatus; label: string }[] = [
  { value: 'draft', label: 'مسودة' },
  { value: 'published', label: 'منشور' },
];

export function PostForm({
  initial = {},
  submitLabel = 'إضافة',
  cancelLabel = 'إلغاء',
  onSubmit,
  onCancel,
  isSubmitting = false,
  error,
}: PostFormProps) {
  const [kind, setKind] = useState<AdminPostKind>(initial.kind ?? 'news');
  const [status, setStatus] = useState<AdminPostStatus>(initial.status ?? 'published');
  const [title, setTitle] = useState(initial.title ?? '');
  const [content, setContent] = useState(initial.content ?? '');
  const [eventDate, setEventDate] = useState(initial.event_date ?? '');
  const [featuredImage, setFeaturedImage] = useState(initial.featured_image ?? '');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload: AdminPostInsert = {
      title: title.trim(),
      content: content.trim(),
      kind,
      status,
      featured_image: featuredImage.trim() || null,
      event_date: kind === 'event' && eventDate ? eventDate : null,
      updated_at: new Date().toISOString(),
    };
    void onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 text-right">
      {error && (
        <div className="p-3 rounded-lg border border-copper/30 bg-copper/10 text-copper-lt text-sm font-kufi">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-kufi text-sand-dim mb-1.5">النوع</label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as AdminPostKind)}
            className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
          >
            {KIND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-kufi text-sand-dim mb-1.5">الحالة</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AdminPostStatus)}
            className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {kind === 'event' && (
        <div>
          <label className="block text-xs font-kufi text-sand-dim mb-1.5">تاريخ المناسبة</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-kufi text-sand-dim mb-1.5">العنوان</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان الخبر أو المناسبة"
          className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-kufi text-sand-dim mb-1.5">رابط الصورة المميزة (اختياري)</label>
        <input
          type="url"
          value={featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50 ltr"
        />
      </div>

      <div>
        <label className="block text-xs font-kufi text-sand-dim mb-1.5">المحتوى</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="اكتب المحتوى هنا..."
          rows={6}
          className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
          required
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-brass/20 border border-brass/35 px-5 py-2.5 text-sm font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
        >
          {isSubmitting ? 'جارٍ الحفظ...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-sand/25 px-5 py-2.5 text-sm font-kufi text-sand-dim hover:bg-sand/10 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
        >
          {cancelLabel}
        </button>
      </div>
    </form>
  );
}
