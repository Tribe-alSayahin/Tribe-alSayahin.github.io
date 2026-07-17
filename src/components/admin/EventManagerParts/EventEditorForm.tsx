import { Save } from 'lucide-react';
import type { FormEventHandler } from 'react';

import type { AdminEventStatus } from '../../../lib/events';
import type { EventFormState } from './types';

interface EventEditorFormProps {
  form: EventFormState;
  formError: string;
  isSaving: boolean;
  onChange: (key: keyof EventFormState, value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const STATUS_OPTIONS: Array<{ value: AdminEventStatus; label: string }> = [
  { value: 'draft', label: 'مسودة' },
  { value: 'published', label: 'منشور' },
];

export default function EventEditorForm({
  form,
  formError,
  isSaving,
  onChange: onFormChange,
  onSubmit,
}: EventEditorFormProps) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {formError && (
        <p className="rounded-lg border border-copper/30 bg-copper/10 px-3 py-2 text-sm font-kufi text-copper-lt">
          {formError}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-kufi text-sand-dim mb-1.5">عنوان المناسبة</label>
          <input
            value={form.title}
            onChange={(event) => onFormChange('title', event.target.value)}
            className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-kufi text-sand-dim mb-1.5">Slug (اختياري)</label>
          <input
            value={form.slug}
            onChange={(event) => onFormChange('slug', event.target.value)}
            placeholder="يولد تلقائياً عند تركه فارغاً"
            className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50 ltr"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-kufi text-sand-dim mb-1.5">التاريخ الميلادي</label>
          <input
            type="date"
            value={form.event_date_gregorian}
            onChange={(event) => onFormChange('event_date_gregorian', event.target.value)}
            className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-kufi text-sand-dim mb-1.5">التاريخ الهجري</label>
          <input
            value={form.event_date_hijri}
            onChange={(event) => onFormChange('event_date_hijri', event.target.value)}
            placeholder="مثال: ١٥ محرّم ١٤٤٨هـ"
            className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-kufi text-sand-dim mb-1.5">حالة النشر</label>
          <select
            value={form.status}
            onChange={(event) => onFormChange('status', event.target.value)}
            className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-kufi text-sand-dim mb-1.5">الموقع/المكان (اختياري)</label>
        <input
          value={form.location}
          onChange={(event) => onFormChange('location', event.target.value)}
          className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
        />
      </div>

      <div>
        <label className="block text-xs font-kufi text-sand-dim mb-1.5">وصف مختصر</label>
        <textarea
          rows={3}
          value={form.summary}
          onChange={(event) => onFormChange('summary', event.target.value)}
          className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-kufi text-sand-dim mb-1.5">الوصف الكامل</label>
        <textarea
          rows={6}
          value={form.description}
          onChange={(event) => onFormChange('description', event.target.value)}
          className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-brass/20 border border-brass/35 px-5 py-2.5 text-sm font-kufi text-brass-lt hover:bg-brass/30 disabled:opacity-60 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'جارٍ الحفظ...' : 'حفظ المناسبة'}
        </button>
      </div>
    </form>
  );
}
