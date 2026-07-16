import type { FormEvent } from 'react';
import type { PoetryEntry, PoetryStatus } from '../../lib/poetry';

export interface PoetryFormState {
  title: string;
  poet_name: string;
  story: string;
  poem_text: string;
  source: string;
  status: PoetryStatus;
}

export const EMPTY_POETRY_FORM: PoetryFormState = {
  title: '',
  poet_name: '',
  story: '',
  poem_text: '',
  source: '',
  status: 'draft',
};

interface PoetryEntryFormProps {
  editingEntry: PoetryEntry | null;
  error: string;
  form: PoetryFormState;
  submitting: boolean;
  onCancel: () => void;
  onChange: (form: PoetryFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function PoetryEntryForm({
  editingEntry,
  error,
  form,
  submitting,
  onCancel,
  onChange,
  onSubmit,
}: PoetryEntryFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5 space-y-4">
      <h4 className="font-kufi text-lg text-brass-lt">{editingEntry ? 'تعديل قصيدة' : 'إضافة قصيدة'}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={form.title}
          onChange={(event) => onChange({ ...form, title: event.target.value })}
          placeholder="عنوان القصيدة"
          className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
        />
        <input
          value={form.poet_name}
          onChange={(event) => onChange({ ...form, poet_name: event.target.value })}
          placeholder="اسم الشاعر"
          className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
        />
      </div>
      <textarea
        value={form.story}
        onChange={(event) => onChange({ ...form, story: event.target.value })}
        rows={5}
        placeholder="القصة أو التوثيق المرتبط بالقصيدة"
        className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
      />
      <textarea
        value={form.poem_text}
        onChange={(event) => onChange({ ...form, poem_text: event.target.value })}
        rows={8}
        placeholder="نص القصيدة، كل بيت في سطر مستقل"
        className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={form.source}
          onChange={(event) => onChange({ ...form, source: event.target.value })}
          placeholder="المصدر أو الراوي"
          className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
        />
        <select
          value={form.status}
          onChange={(event) => onChange({ ...form, status: event.target.value as PoetryStatus })}
          className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
        >
          <option value="draft">مسودة</option>
          <option value="published">منشور</option>
        </select>
      </div>
      {error && <p className="text-xs font-kufi text-copper">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brass/20 border border-brass/35 px-4 py-2.5 text-sm font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
        >
          {submitting ? 'جارٍ الحفظ...' : editingEntry ? 'حفظ التعديل' : 'إضافة القصيدة'}
        </button>
        {editingEntry && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-brass/20 px-4 py-2.5 text-sm font-kufi text-sand-dim hover:text-sand hover:bg-brass/5 transition-colors"
          >
            إلغاء التعديل
          </button>
        )}
      </div>
    </form>
  );
}
