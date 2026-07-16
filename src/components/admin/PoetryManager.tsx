'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { fetchAllPoetryEntries, type PoetryEntry } from '../../lib/poetry';
import { supabase } from '../../lib/supabase';
import { ConfirmModal } from './ConfirmModal';
import {
  EMPTY_POETRY_FORM,
  PoetryEntryForm,
  type PoetryFormState,
} from './PoetryEntryForm';
import { PoetryEntryList } from './PoetryEntryList';

interface PoetryManagerProps {
  onNotify: (message: string, type: 'success' | 'error') => void;
  userId: string | null;
}

export function PoetryManager({ onNotify, userId }: PoetryManagerProps) {
  const [entries, setEntries] = useState<PoetryEntry[]>([]);
  const [form, setForm] = useState<PoetryFormState>(EMPTY_POETRY_FORM);
  const [editingEntry, setEditingEntry] = useState<PoetryEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PoetryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadEntries = useCallback(async () => {
    setLoading(true);
    const result = await fetchAllPoetryEntries();
    if (result.error) {
      onNotify('تعذر تحميل قصائد الديوان.', 'error');
    } else {
      setEntries(result.data ?? []);
    }
    setLoading(false);
  }, [onNotify]);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const resetForm = () => {
    setForm(EMPTY_POETRY_FORM);
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
      : await supabase.from('poetry_entries').insert({ ...payload, created_by: userId });

    if (result.error) {
      setFormError('تعذر حفظ القصيدة. تحقق من البيانات ثم حاول مرة أخرى.');
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
      onNotify('تعذر حذف القصيدة. حاول مرة أخرى.', 'error');
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

      <PoetryEntryForm
        editingEntry={editingEntry}
        error={formError}
        form={form}
        submitting={submitting}
        onCancel={resetForm}
        onChange={setForm}
        onSubmit={(event) => { void handleSubmit(event); }}
      />
      <PoetryEntryList
        entries={entries}
        loading={loading}
        onDelete={setDeleteTarget}
        onEdit={startEdit}
      />
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="تأكيد حذف القصيدة"
        message={`هل تريد حذف "${deleteTarget?.title}" من ديوان الشعر؟`}
        confirmLabel="حذف"
        onConfirm={() => { void handleDelete(); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
