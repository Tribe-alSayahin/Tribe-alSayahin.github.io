'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { BookOpen, Edit, Plus, Trash2 } from 'lucide-react';
import { fetchAllPoetryEntries, type PoetryEntry, type PoetryStatus } from '../../lib/poetry';
import { supabase } from '../../lib/supabase';
import { ConfirmModal } from './ConfirmModal';

interface PoetryManagerProps {
  onNotify: (message: string, type: 'success' | 'error') => void;
  userId: string | null;
}

interface PoetryFormState {
  title: string;
  poet_name: string;
  story: string;
  poem_text: string;
  source: string;
  status: PoetryStatus;
}

const emptyForm: PoetryFormState = {
  title: '',
  poet_name: '',
  story: '',
  poem_text: '',
  source: '',
  status: 'draft',
};

const statusLabels: Record<PoetryStatus, string> = {
  draft: 'مسودة',
  published: 'منشور',
};

export function PoetryManager({ onNotify, userId }: PoetryManagerProps) {
  const [entries, setEntries] = useState<PoetryEntry[]>([]);
  const [form, setForm] = useState<PoetryFormState>(emptyForm);
  const [editingEntry, setEditingEntry] = useState<PoetryEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PoetryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadEntries = useCallback(async () => {
    setLoading(true);
    const result = await fetchAllPoetryEntries();
    if (result.error) {
      onNotify(result.error.message, 'error');
    } else {
      setEntries(result.data ?? []);
    }
    setLoading(false);
  }, [onNotify]);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingEntry(null);
    setFormError('');
  };

  const startEdit = (entry: PoetryEntry) => {
    setEditingEntry(entry);
    setForm({
      title: entry.title,
      poet_name: entry.poet_name,
      story: entry.story ?? '',
      poem_text: entry.poem_text,
      source: entry.source ?? '',
      status: entry.status,
    });
    setFormError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    if (!form.title.trim() || !form.poet_name.trim() || !form.poem_text.trim()) {
      setFormError('العنوان واسم الشاعر ونص القصيدة حقول مطلوبة.');
      return;
    }

    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      poet_name: form.poet_name.trim(),
      story: form.story.trim() || null,
      poem_text: form.poem_text.trim(),
      source: form.source.trim() || null,
      status: form.status,
      updated_at: new Date().toISOString(),
    };

    const result = editingEntry
      ? await supabase.from('poetry_entries').update(payload).eq('id', editingEntry.id)
      : await supabase.from('poetry_entries').insert({
          ...payload,
          created_by: userId,
        });

    if (result.error) {
      setFormError(result.error.message);
      onNotify(editingEntry ? 'فشل تحديث القصيدة' : 'فشل إضافة القصيدة', 'error');
      setSubmitting(false);
      return;
    }

    onNotify(editingEntry ? 'تم تحديث القصيدة' : 'تمت إضافة القصيدة', 'success');
    resetForm();
    await loadEntries();
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const { error } = await supabase.from('poetry_entries').delete().eq('id', deleteTarget.id);
    if (error) {
      onNotify(error.message, 'error');
    } else {
      onNotify('تم حذف القصيدة', 'success');
      await loadEntries();
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-brass-lt" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-ruqaa text-xl text-sand">إدارة ديوان الشعر النبطي</h3>
            <p className="text-sm text-sand-dim">إضافة القصائد وتوثيق قصصها ومصادرها ونشرها في قسم الهوية.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="flex items-center gap-2 rounded-lg bg-brass/20 border border-brass/35 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/30 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
        >
          <Plus className="w-4 h-4" />
          قصيدة جديدة
        </button>
      </div>

      <form onSubmit={(event) => { void handleSubmit(event); }} className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5 space-y-4">
        <h4 className="font-kufi text-lg text-brass-lt">{editingEntry ? 'تعديل قصيدة' : 'إضافة قصيدة'}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="عنوان القصيدة"
            className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
          />
          <input
            value={form.poet_name}
            onChange={(event) => setForm((prev) => ({ ...prev, poet_name: event.target.value }))}
            placeholder="اسم الشاعر"
            className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
          />
        </div>
        <textarea
          value={form.story}
          onChange={(event) => setForm((prev) => ({ ...prev, story: event.target.value }))}
          rows={5}
          placeholder="القصة أو التوثيق المرتبط بالقصيدة"
          className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
        />
        <textarea
          value={form.poem_text}
          onChange={(event) => setForm((prev) => ({ ...prev, poem_text: event.target.value }))}
          rows={8}
          placeholder="نص القصيدة، كل بيت في سطر مستقل"
          className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.source}
            onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
            placeholder="المصدر أو الراوي"
            className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
          />
          <select
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as PoetryStatus }))}
            className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
          >
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
          </select>
        </div>
        {formError && <p className="text-xs font-kufi text-copper">{formError}</p>}
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
              onClick={resetForm}
              className="rounded-lg border border-brass/20 px-4 py-2.5 text-sm font-kufi text-sand-dim hover:text-sand hover:bg-brass/5 transition-colors"
            >
              إلغاء التعديل
            </button>
          )}
        </div>
      </form>

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
                      onClick={() => startEdit(entry)}
                      className="p-2 rounded-lg border border-brass/35 text-brass-lt hover:bg-brass/10 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
                      aria-label="تعديل القصيدة"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(entry)}
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

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="تأكيد حذف القصيدة"
        message={`هل تريد حذف "${deleteTarget?.title}" من ديوان الشعر؟`}
        confirmLabel="حذف"
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
