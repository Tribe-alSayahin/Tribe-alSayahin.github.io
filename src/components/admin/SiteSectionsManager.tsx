'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Eye, EyeOff, LayoutTemplate, Save } from 'lucide-react';
import {
  fetchSiteSections,
  updateSiteSection,
  type SiteSectionRecord,
} from '../../lib/site-sections';
import {
  SITE_SECTION_DEFINITIONS,
  mergeSiteSection,
  type SiteSectionContent,
  type SiteSectionKey,
} from '../../lib/site-sections-shared';
import { AdminImageUploader } from './AdminImageUploader';

interface SiteSectionsManagerProps {
  onNotify: (message: string, type: 'success' | 'error') => void;
  userId: string | null;
}

type EditableSection = SiteSectionContent & { id?: string };

export function SiteSectionsManager({ onNotify, userId }: SiteSectionsManagerProps) {
  const [records, setRecords] = useState<SiteSectionRecord[]>([]);
  const [selectedKey, setSelectedKey] = useState<SiteSectionKey>('home');
  const [form, setForm] = useState<EditableSection>(mergeSiteSection('home'));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const loadSections = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchSiteSections();
    if (result.error) {
      setError('تعذر تحميل أقسام الموقع. تأكد من تطبيق ترحيل قاعدة البيانات الجديد.');
      onNotify('تعذر تحميل أقسام الموقع.', 'error');
    } else {
      setRecords(result.data ?? []);
      setError('');
    }
    setIsLoading(false);
  }, [onNotify]);

  useEffect(() => {
    void loadSections();
  }, [loadSections]);

  const sections = useMemo(
    () =>
      SITE_SECTION_DEFINITIONS.map((definition) => {
        const stored = records.find((item) => item.section_key === definition.key);
        return {
          definition,
          content: mergeSiteSection(
            definition.key,
            stored ? (stored as SiteSectionRecord & SiteSectionContent) : undefined,
          ),
          id: stored?.id,
        };
      }),
    [records],
  );

  useEffect(() => {
    const selected = sections.find((item) => item.definition.key === selectedKey);
    if (selected) setForm({ ...selected.content, id: selected.id });
  }, [sections, selectedKey]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('العنوان والوصف حقول مطلوبة.');
      return;
    }
    if (form.image_url && !form.image_alt?.trim()) {
      setError('اكتب وصفاً بديلاً للصورة لضمان إمكانية الوصول.');
      return;
    }

    setIsSaving(true);
    const result = await updateSiteSection(selectedKey, {
      title: form.title.trim(),
      description: form.description.trim(),
      image_url: form.image_url?.trim() || null,
      image_alt: form.image_url ? form.image_alt?.trim() || null : null,
      status: form.status,
      updated_by: userId,
    });

    if (result.error) {
      setError(result.error.message);
      onNotify('تعذر حفظ القسم.', 'error');
    } else {
      onNotify('تم حفظ القسم. سيظهر التعديل بعد إعادة بناء الموقع.', 'success');
      await loadSections();
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-8 text-center">
        <p className="font-kufi text-sm text-sand-dim">جارٍ تحميل أقسام الموقع...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
          <LayoutTemplate className="w-5 h-5 text-brass-lt" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-ruqaa text-2xl text-sand">إدارة أقسام موقع القبيلة</h3>
          <p className="text-sm text-sand-dim">
            عدّل عناوين ووصف وصور المدخل والنسب والديار والهوية والتاريخ من مكان واحد.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)] gap-5 items-start">
        <nav
          aria-label="أقسام الموقع القابلة للتحرير"
          className="rounded-2xl border border-brass/20 bg-ink-2/60 p-3 space-y-1"
        >
          {sections.map(({ definition, content }) => (
            <button
              key={definition.key}
              type="button"
              onClick={() => setSelectedKey(definition.key)}
              className={`w-full rounded-xl px-3 py-3 text-right transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                selectedKey === definition.key
                  ? 'border border-brass/30 bg-brass/15 text-brass-lt'
                  : 'border border-transparent text-sand-dim hover:bg-brass/5 hover:text-sand'
              }`}
            >
              <span className="block text-[10px] font-kufi opacity-70">{definition.page}</span>
              <span className="mt-1 flex items-center justify-between gap-2 text-sm font-kufi">
                {definition.label}
                {content.status === 'published' ? (
                  <Eye className="w-3.5 h-3.5" aria-label="منشور" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" aria-label="مسودة" />
                )}
              </span>
            </button>
          ))}
        </nav>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brass/10 pb-4">
            <div>
              <p className="text-xs font-kufi text-brass-lt/80">
                {sections.find((item) => item.definition.key === selectedKey)?.definition.page}
              </p>
              <h4 className="font-ruqaa text-2xl text-sand">
                {sections.find((item) => item.definition.key === selectedKey)?.definition.label}
              </h4>
            </div>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as 'draft' | 'published',
                }))
              }
              className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sm text-sand focus:outline-none focus:border-brass/50"
              aria-label="حالة نشر القسم"
            >
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
            </select>
          </div>

          <div>
            <label htmlFor="site-section-title" className="block text-xs font-kufi text-sand-dim mb-1.5">
              عنوان القسم
            </label>
            <input
              id="site-section-title"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
              required
            />
          </div>

          <div>
            <label htmlFor="site-section-description" className="block text-xs font-kufi text-sand-dim mb-1.5">
              وصف القسم
            </label>
            <textarea
              id="site-section-description"
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand focus:outline-none focus:border-brass/50"
              required
            />
          </div>

          <AdminImageUploader
            value={form.image_url ?? ''}
            alt={form.image_alt ?? ''}
            folder={selectedKey}
            onChange={(imageUrl) =>
              setForm((current) => ({ ...current, image_url: imageUrl || null }))
            }
            onError={(message) => {
              setError(message);
              onNotify(message, 'error');
            }}
          />

          {form.image_url && (
            <div>
              <label htmlFor="site-section-image-alt" className="block text-xs font-kufi text-sand-dim mb-1.5">
                الوصف البديل للصورة
              </label>
              <input
                id="site-section-image-alt"
                value={form.image_alt ?? ''}
                onChange={(event) =>
                  setForm((current) => ({ ...current, image_alt: event.target.value }))
                }
                placeholder="صف الصورة ومحتواها بوضوح"
                className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
                required
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-copper/30 bg-copper/10 px-3 py-2 text-sm font-kufi text-copper-lt">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-sand-dim">
              لأن الموقع ثابت، تظهر التعديلات العامة بعد تشغيل إعادة بناء GitHub Pages.
            </p>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg border border-brass/35 bg-brass/20 px-5 py-2.5 text-sm font-kufi text-brass-lt hover:bg-brass/30 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              {isSaving ? 'جارٍ الحفظ...' : 'حفظ القسم'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
