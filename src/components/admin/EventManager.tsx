'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';
import { CalendarDays, Plus, X } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import EventEditorForm from './EventManagerParts/EventEditorForm';
import EventImageAlbum from './EventManagerParts/EventImageAlbum';
import EventList from './EventManagerParts/EventList';
import type { EventFormState } from './EventManagerParts/types';
import { createSlug } from '../../lib/slug';
import {
  type AdminEventImage,
  type AdminEventRecord,
  type AdminEventStatus,
  deleteAdminEvent,
  deleteEventImage,
  fetchAdminEventImages,
  fetchAdminEvents,
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

const emptyForm: EventFormState = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  event_date_gregorian: '',
  event_date_hijri: '',
  location: '',
  status: 'draft',
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

    setImages(result.data ?? []);
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
      const firstImage = (imagesResult.data ?? [])[0];
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

      <EventList
        events={events}
        isLoading={isLoading}
        onEdit={(event) => { void openEdit(event); }}
        onToggleStatus={(event) => { void handleToggleStatus(event); }}
        onDelete={setDeleteTarget}
      />

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

          <EventEditorForm
            form={form}
            formError={formError}
            isSaving={isSaving}
            onChange={onFormChange}
            onSubmit={(event) => { void handleSaveEvent(event); }}
          />

          <EventImageAlbum
            eventExists={Boolean(editingEvent)}
            images={orderedImages}
            pendingFiles={pendingFiles}
            isDropActive={isDropActive}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            inputRef={fileInputRef}
            onInputFiles={handleInputFiles}
            onDropFiles={handleDrop}
            onDropActiveChange={setIsDropActive}
            onRemovePendingFile={removePendingFile}
            onUpload={() => { void handleUpload(); }}
            onDraggingImageChange={setDraggingImageId}
            onImageDrop={(id) => { void onImageDrop(id); }}
            onSetCover={(image) => { void handleSetCover(image); }}
            onDeleteImage={setDeleteImageTarget}
          />
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
