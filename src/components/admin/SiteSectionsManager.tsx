'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { ExternalLink, Eye, EyeOff, LayoutTemplate, Save } from 'lucide-react';
import {
  fetchSiteSections,
  updateSiteSection,
  type SiteSectionRecord,
} from '../../lib/site-sections';
import {
  SITE_SECTION_DEFINITIONS,
  mergeSiteSection,
  validateSiteSectionGallery,
  type SiteSectionContent,
  type SiteSectionKey,
  type SiteSectionGalleryImage,
} from '../../lib/site-sections-shared';
import { SECTION_TO_ROUTE } from '../../lib/navigation';
import { AdminImageUploader } from './AdminImageUploader';
import SheikhdomGalleryEditor from './SheikhdomGalleryEditor';
import { SHEIKHDOM_IMAGES } from '../SheikhdomGallery.data';

interface SiteSectionsManagerProps {
  onNotify: (message: string, type: 'success' | 'error') => void;
  userId: string | null;
  initialSectionKey?: SiteSectionKey;
}

type EditableSection = SiteSectionContent & { id?: string };

export function SiteSectionsManager({ onNotify, userId, initialSectionKey = 'home' }: SiteSectionsManagerProps) {
  const [records, setRecords] = useState<SiteSectionRecord[]>([]);
  const [selectedKey, setSelectedKey] = useState<SiteSectionKey>(initialSectionKey);
  const [form, setForm] = useState<EditableSection>(mergeSiteSection(initialSectionKey));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState('');

  const loadSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchSiteSections();
      if (result.error) throw new Error('load failed');
      setRecords(result.data ?? []);
      setLoadFailed(false);
      setError('');
    } catch {
      setLoadFailed(true);
      setError('تعذر تحميل أقسام الموقع. تأكد من تطبيق ترحيل قاعدة البيانات الجديد.');
      onNotify('تعذر تحميل أقسام الموقع.', 'error');
    } finally {
      setIsLoading(false);
    }
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
    if (isSaving || isUploading || loadFailed) return;
    setError('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('العنوان والوصف حقول مطلوبة.');
      return;
    }
    if (form.image_url && !form.image_alt?.trim()) {
      setError('اكتب وصفاً بديلاً للصورة لضمان إمكانية الوصول.');
      return;
    }

    const sourceGallery: readonly SiteSectionGalleryImage[] = form.gallery_images ?? SHEIKHDOM_IMAGES;
    const galleryImages = selectedKey === 'sheikhdom'
      ? sourceGallery.map((image) => ({ ...image, alt: image.alt.trim(), caption: image.caption.trim() }))
      : undefined;
    if (galleryImages) {
      const validationError = validateSiteSectionGallery(galleryImages);
      if (validationError) { setError(validationError); return; }
    }

    setIsSaving(true);
    try {
      const result = await updateSiteSection(selectedKey, {
        title: form.title.trim(),
        description: form.description.trim(),
        image_url: form.image_url?.trim() || null,
        image_alt: form.image_url ? form.image_alt?.trim() || null : null,
        status: form.status,
        updated_by: userId,
        ...(galleryImages ? { gallery_images: galleryImages } : {}),
      });

      if (result.error) {
        setError(result.error.message);
        onNotify('تعذر حفظ القسم.', 'error');
      } else {
        onNotify('تم حفظ القسم. سيظهر التعديل بعد إعادة بناء الموقع.', 'success');
        await loadSections();
      }
    } catch {
      const message = 'تعذر حفظ القسم. حاول مرة أخرى.';
      setError(message);
      onNotify(message, 'error');
    } finally {
      setIsSaving(false);
    }
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
          {sections.map(({ definition, content }) => {
            const publicHref = SECTION_TO_ROUTE[definition.key] ?? '/';

            return (
              <div
                key={definition.key}
                className={`rounded-xl border transition-colors ${
                  selectedKey === definition.key
                    ? 'border-brass/30 bg-brass/15 text-brass-lt'
                    : 'border-transparent text-sand-dim hover:bg-brass/5 hover:text-sand'
                }`}
              >
                <button
                  type="button"
                  disabled={isSaving || isUploading} onClick={() => { setSelectedKey(definition.key); setError(''); }}
                  className="w-full px-3 pb-2 pt-3 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
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
                <a
                  href={publicHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-3 mb-3 inline-flex items-center gap-1.5 rounded-lg border border-brass/15 px-2.5 py-1.5 text-[11px] font-kufi text-brass-lt/90 transition-colors hover:bg-brass/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  عرض القسم
                </a>
              </div>
            );
          })}
        </nav>

        <form
          aria-label="تحرير القسم"
          onSubmit={(event) => void handleSubmit(event)}
          className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5 space-y-5"
        >
          <fieldset disabled={isSaving || isUploading || loadFailed} className="space-y-5 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brass/10 pb-4">
            <div>
              <p className="text-xs font-kufi text-brass-lt/80">
                {sections.find((item) => item.definition.key === selectedKey)?.definition.page}
              </p>
              <h4 className="font-ruqaa text-2xl text-sand">
                {sections.find((item) => item.definition.key === selectedKey)?.definition.label}
              </h4>
              <a
                href={SECTION_TO_ROUTE[selectedKey] ?? '/'}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-kufi text-brass-lt hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                فتح موضع هذا القسم في الموقع
              </a>
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
            key={selectedKey}
            value={form.image_url ?? ''}
            alt={form.image_alt ?? ''}
            folder={selectedKey}
            onUploadingChange={setIsUploading}
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

          {selectedKey === 'sheikhdom' && (
            <SheikhdomGalleryEditor
              images={form.gallery_images ?? [...SHEIKHDOM_IMAGES]}
              onChange={(gallery_images) => setForm((current) => ({ ...current, gallery_images }))}
              onUploadingChange={setIsUploading}
              onError={(message) => { setError(message); onNotify(message, 'error'); }}
            />
          )}

          {error && (
            <p role="alert" className="rounded-lg border border-copper/30 bg-copper/10 px-3 py-2 text-sm font-kufi text-copper-lt">
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
          </fieldset>
          {loadFailed && <button type="button" onClick={() => void loadSections()} className="text-brass-lt underline focus-visible:ring-2 focus-visible:ring-brass">إعادة محاولة التحميل</button>}
        </form>
      </div>
    </div>
  );
}
