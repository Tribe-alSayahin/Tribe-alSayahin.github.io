'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';
import { CalendarDays, ImagePlus, MapPin, Pencil, Plus, Save, Trash2, UploadCloud, X } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { createSlug } from '../../lib/slug';
import {
  type AdminEventImage,
  type AdminEventRecord,
  type AdminEventStatus,
  deleteAdminEvent,
  deleteEventImage,
  fetchAdminEventImages,
  fetchAdminEvents,
  formatEventDateArabic,
  optimizeEventImage,
  reorderEventImages,
  setCoverImage,
  updateAdminEvent,
  uploadEventImage,
  validateEventImageFile,
  createAdminEvent,
} from '../../lib/events';

interface EventManagerProps {
  onNotify: (message: string, type: 'success' | 'error') => void;
  canManage: boolean;
  userId: string | null;
}

const STATUS_OPTIONS: Array<{ value: AdminEventStatus; label: string }> = [
  { value: 'draft', label: 'مسودة' },
  { value: 'published', label: 'منشور' },
];

const emptyForm = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  event_date_gregorian: '',
  event_date_hijri: '',
  location: '',
  status: 'draft' as AdminEventStatus,
};

export function EventManager({ onNotify, canManage, userId }: EventManagerProps) {
  const [events, setEvents] = useState<AdminEventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formError, setFormError] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEventRecord | null>(null);
  const [images, setImages] = useState<AdminEventImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isDropActive, setIsDropActive] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminEventRecord | null>(null);
  const [deleteImageTarget, setDeleteImageTarget] = useState<AdminEventImage | null>(null);
  const [draggingImageId, setDraggingImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState(emptyForm);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchAdminEvents();
    if (result.error) {
      onNotify(result.error.message, 'error');
    } else {
      setEvents(result.data ?? []);
    }
    setIsLoading(false);
  }, [onNotify]);

  const loadImages = useCallback(async (eventId: string) => {
    const result = await fetchAdminEventImages(eventId);
    if (result.error) {
      onNotify(result.error.message, 'error');
      return;
    }

    setImages((result.data ?? []) as AdminEventImage[]);
  }, [onNotify]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const resetEditor = () => {
    setForm(emptyForm);
    setEditingEvent(null);
    setImages([]);
    setPendingFiles([]);
    setUploadProgress(0);
    setFormError('');
  };

  const openCreate = () => {
    resetEditor();
    setShowEditor(true);
  };

  const openEdit = async (event: AdminEventRecord) => {
    setForm({
      title: event.title,
      slug: event.slug,
      summary: event.summary,
      description: event.description,
      event_date_gregorian: event.event_date_gregorian,
      event_date_hijri: event.event_date_hijri,
      location: event.location ?? '',
      status: event.status,
    });
    setEditingEvent(event);
    setShowEditor(true);
    setFormError('');
    setPendingFiles([]);
    setUploadProgress(0);
    await loadImages(event.id);
  };

  const onFormChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveEvent = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    setIsSaving(true);

    const slug = createSlug(form.slug || form.title);

    const payload = {
      title: form.title.trim(),
      slug,
      summary: form.summary.trim(),
      description: form.description.trim(),
      event_date_gregorian: form.event_date_gregorian,
      event_date_hijri: form.event_date_hijri.trim(),
      location: form.location.trim() || null,
      status: form.status,
    };

    if (!payload.title || !payload.summary || !payload.description || !payload.event_date_gregorian || !payload.event_date_hijri) {
      setFormError('الرجاء تعبئة الحقول الإلزامية.');
      setIsSaving(false);
      return;
    }

    const result = editingEvent
      ? await updateAdminEvent(editingEvent.id, payload)
      : await createAdminEvent({ ...payload, created_by: userId ?? null });

    if (result.error) {
      setFormError(result.error.message);
      onNotify('تعذر حفظ بيانات المناسبة.', 'error');
      setIsSaving(false);
      return;
    }

    const savedEvent = result.data as AdminEventRecord;
    setEditingEvent(savedEvent);
    onNotify(editingEvent ? 'تم تحديث المناسبة بنجاح.' : 'تمت إضافة المناسبة بنجاح. يمكنك الآن رفع الصور.', 'success');
    await loadEvents();
    await loadImages(savedEvent.id);
    setIsSaving(false);
  };

  const addFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    const valid: File[] = [];

    for (const file of list) {
      const error = validateEventImageFile(file);
      if (error) {
        onNotify(error, 'error');
      } else {
        valid.push(file);
      }
    }

    if (valid.length > 0) {
      setPendingFiles((prev) => [...prev, ...valid]);
    }
  };

  const handleInputFiles = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    addFiles(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDropActive(false);
    if (event.dataTransfer.files.length > 0) {
      addFiles(event.dataTransfer.files);
    }
  };

  const removePendingFile = (target: File) => {
    setPendingFiles((prev) => prev.filter((item) => item !== target));
  };

  const handleUpload = async () => {
    if (!editingEvent || !userId) {
      onNotify('احفظ المناسبة أولاً قبل رفع الصور.', 'error');
      return;
    }

    if (pendingFiles.length === 0) {
      onNotify('اختر صوراً للرفع أولاً.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    let uploaded = 0;
    let hasError = false;

    for (let index = 0; index < pendingFiles.length; index += 1) {
      const file = pendingFiles[index];

      try {
        const optimized = await optimizeEventImage(file);
        const result = await uploadEventImage(editingEvent.id, file, optimized, userId, images.length + index);

        if (result.error) {
          hasError = true;
          onNotify(`فشل رفع ${file.name}: ${result.error.message}`, 'error');
          continue;
        }

        uploaded += 1;
        setUploadProgress(Math.round(((index + 1) / pendingFiles.length) * 100));
      } catch (error) {
        hasError = true;
        const message = error instanceof Error ? error.message : 'تعذر معالجة الصورة قبل الرفع.';
        onNotify(`فشل رفع ${file.name}: ${message}`, 'error');
      }
    }

    await loadImages(editingEvent.id);
    await loadEvents();

    if (uploaded > 0 && !editingEvent.cover_image_url) {
      const imagesResult = await fetchAdminEventImages(editingEvent.id);
      const firstImage = (imagesResult.data ?? [])[0] as AdminEventImage | undefined;
      if (firstImage) {
        await setCoverImage(editingEvent, firstImage);
        await loadEvents();
        await loadImages(editingEvent.id);
      }
    }

    setPendingFiles([]);
    setIsUploading(false);

    if (!hasError) {
      onNotify('تم رفع الصور بنجاح.', 'success');
    }
  };

  const handleDeleteEvent = async () => {
    if (!deleteTarget) {
      return;
    }

    const result = await deleteAdminEvent(deleteTarget.id);
    if (result.error) {
      onNotify(result.error.message, 'error');
    } else {
      onNotify('تم حذف المناسبة بالكامل.', 'success');
      if (editingEvent?.id === deleteTarget.id) {
        resetEditor();
        setShowEditor(false);
      }
      await loadEvents();
    }

    setDeleteTarget(null);
  };

  const handleDeleteImage = async () => {
    if (!deleteImageTarget || !editingEvent) {
      return;
    }

    const result = await deleteEventImage(deleteImageTarget);
    if (result.error) {
      onNotify(result.error.message, 'error');
      return;
    }

    onNotify('تم حذف الصورة.', 'success');
    await loadImages(editingEvent.id);
    await loadEvents();
    setDeleteImageTarget(null);
  };

  const handleToggleStatus = async (event: AdminEventRecord) => {
    const status: AdminEventStatus = event.status === 'published' ? 'draft' : 'published';
    const result = await updateAdminEvent(event.id, { status });
    if (result.error) {
      onNotify(result.error.message, 'error');
      return;
    }

    onNotify(status === 'published' ? 'تم نشر المناسبة.' : 'تم تحويل المناسبة إلى مسودة.', 'success');
    await loadEvents();
  };

  const handleSetCover = async (image: AdminEventImage) => {
    if (!editingEvent) {
      return;
    }

    const result = await setCoverImage(editingEvent, image);
    if (result.error) {
      onNotify(result.error.message, 'error');
      return;
    }

    onNotify('تم تعيين صورة الغلاف.', 'success');
    await loadImages(editingEvent.id);
    await loadEvents();
  };

  const orderedImages = useMemo(() => [...images].sort((a, b) => a.sort_order - b.sort_order), [images]);

  const onImageDrop = async (targetId: string) => {
    if (!editingEvent || !draggingImageId || draggingImageId === targetId) {
      return;
    }

    const startIndex = orderedImages.findIndex((item) => item.id === draggingImageId);
    const targetIndex = orderedImages.findIndex((item) => item.id === targetId);

    if (startIndex === -1 || targetIndex === -1) {
      return;
    }

    const next = [...orderedImages];
    const [moved] = next.splice(startIndex, 1);
    next.splice(targetIndex, 0, moved);
    const normalized = next.map((item, index) => ({ ...item, sort_order: index }));

    setImages(normalized);
    const result = await reorderEventImages(editingEvent.id, normalized);
    if (result.error) {
      onNotify(result.error.message, 'error');
      await loadImages(editingEvent.id);
      return;
    }

    onNotify('تم حفظ ترتيب الصور.', 'success');
  };

  if (!canManage) {
    return (
      <section className="rounded-2xl border border-copper/35 bg-copper/10 p-5">
        <h3 className="font-kufi text-lg text-copper-lt mb-2">صلاحية غير كافية</h3>
        <p className="text-sm text-sand-dim">
          إدارة المناسبات والأحداث متاحة فقط لحسابات الأدمن. يرجى التواصل مع المشرف الرئيسي لمنح الصلاحية.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-brass-lt" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-ruqaa text-xl text-sand">إدارة المناسبات والأحداث</h3>
            <p className="text-sm text-sand-dim">إضافة المناسبات وإدارة ألبومات الصور وتحديد الغلاف</p>
          </div>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-brass/20 border border-brass/35 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/30 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          إضافة مناسبة جديدة
        </button>
      </div>

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
                    <p className="text-xs font-kufi text-brass-lt mt-1">{formatEventDateArabic(event.event_date_gregorian)} • {event.event_date_hijri}</p>
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
                      onClick={() => void openEdit(event)}
                      className="p-2 rounded-lg border border-brass/35 text-brass-lt hover:bg-brass/10 transition-colors"
                      aria-label="تعديل المناسبة"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => void handleToggleStatus(event)}
                      className="px-3 py-2 rounded-lg border border-emerald/35 text-xs font-kufi text-emerald-lt hover:bg-emerald/10 transition-colors"
                    >
                      {event.status === 'published' ? 'إخفاء' : 'نشر'}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(event)}
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

      {showEditor && (
        <section className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-kufi text-lg text-brass-lt">
              {editingEvent ? `تعديل المناسبة: ${editingEvent.title}` : 'إضافة مناسبة جديدة'}
            </h4>
            <button
              onClick={() => { setShowEditor(false); resetEditor(); }}
              className="p-2 rounded-lg border border-sand/25 text-sand-dim hover:bg-sand/10 transition-colors"
              aria-label="إغلاق المحرر"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveEvent} className="grid gap-4">
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
                  onChange={(event) => onFormChange('status', event.target.value as AdminEventStatus)}
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

          {!editingEvent ? (
            <p className="text-xs font-kufi text-sand-dim rounded-lg border border-brass/15 bg-ink/40 px-3 py-2">
              بعد حفظ المناسبة لأول مرة سيظهر قسم ألبوم الصور.
            </p>
          ) : (
            <div className="space-y-4 border-t border-brass/15 pt-4">
              <h5 className="font-kufi text-base text-sand">ألبوم الصور</h5>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleInputFiles}
                className="hidden"
              />

              <div
                onDragOver={(event) => { event.preventDefault(); setIsDropActive(true); }}
                onDragLeave={() => setIsDropActive(false)}
                onDrop={handleDrop}
                className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
                  isDropActive ? 'border-brass/60 bg-brass/8' : 'border-brass/25 bg-ink/40'
                }`}
              >
                <UploadCloud className="w-6 h-6 text-brass-lt mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-kufi text-sand">اسحب الصور هنا أو اخترها من جهازك</p>
                <p className="text-xs text-sand-dim mt-1">JPG / PNG / WEBP — الحد الأقصى 5MB لكل صورة</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-brass/30 px-4 py-2 text-xs font-kufi text-brass-lt hover:bg-brass/10 transition-colors"
                >
                  <ImagePlus className="w-4 h-4" />
                  اختيار صور متعددة
                </button>
              </div>

              {pendingFiles.length > 0 && (
                <div className="rounded-xl border border-brass/15 bg-ink/40 p-4 space-y-3">
                  <p className="text-xs font-kufi text-sand-dim">ملفات جاهزة للرفع: {pendingFiles.length}</p>
                  <div className="grid gap-2">
                    {pendingFiles.map((file) => (
                      <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between rounded-lg border border-brass/10 bg-ink/50 px-3 py-2">
                        <span className="text-xs text-sand truncate max-w-[70%]">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removePendingFile(file)}
                          className="text-copper text-xs font-kufi hover:text-copper-lt transition-colors"
                        >
                          إزالة
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleUpload()}
                    disabled={isUploading}
                    className="rounded-lg bg-brass/20 border border-brass/35 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/30 disabled:opacity-60 transition-colors"
                  >
                    {isUploading ? 'جارٍ رفع الصور...' : 'رفع الصور'}
                  </button>

                  {isUploading && (
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-ink overflow-hidden">
                        <div className="h-full bg-brass transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <p className="text-xs text-sand-dim">نسبة التقدّم: {uploadProgress}%</p>
                    </div>
                  )}
                </div>
              )}

              {orderedImages.length === 0 ? (
                <p className="text-sm font-kufi text-sand-dim py-4 text-center border border-brass/10 rounded-xl bg-ink/40">
                  لا توجد صور مرفوعة لهذه المناسبة.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {orderedImages.map((image) => (
                    <article
                      key={image.id}
                      draggable
                      onDragStart={() => setDraggingImageId(image.id)}
                      onDragEnd={() => setDraggingImageId(null)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => { void onImageDrop(image.id); }}
                      className="rounded-xl border border-brass/15 bg-ink/45 p-3 space-y-3"
                    >
                      <img
                        src={image.thumbnail_url}
                        alt={image.file_name}
                        className="w-full h-36 object-cover rounded-lg border border-brass/10"
                        loading="lazy"
                      />
                      <p className="text-xs text-sand truncate" title={image.file_name}>{image.file_name}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void handleSetCover(image)}
                          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-kufi transition-colors ${
                            image.is_cover
                              ? 'border-emerald/40 text-emerald-lt bg-emerald/10'
                              : 'border-brass/25 text-brass-lt hover:bg-brass/10'
                          }`}
                        >
                          {image.is_cover ? 'صورة الغلاف' : 'تعيين كغلاف'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteImageTarget(image)}
                          className="rounded-lg border border-copper/35 px-2 py-1.5 text-copper hover:bg-copper/10 transition-colors"
                          aria-label="حذف الصورة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="تأكيد حذف المناسبة"
        message={`هل أنت متأكد من حذف المناسبة "${deleteTarget?.title}" مع جميع صورها؟ لا يمكن التراجع.`}
        confirmLabel="حذف المناسبة"
        onConfirm={() => void handleDeleteEvent()}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        isOpen={!!deleteImageTarget}
        title="تأكيد حذف الصورة"
        message="هل تريد حذف هذه الصورة من الألبوم؟"
        confirmLabel="حذف الصورة"
        onConfirm={() => void handleDeleteImage()}
        onCancel={() => setDeleteImageTarget(null)}
      />
    </div>
  );
}
