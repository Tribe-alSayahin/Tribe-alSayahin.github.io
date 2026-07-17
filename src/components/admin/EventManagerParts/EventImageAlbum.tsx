import { ImagePlus, Trash2, UploadCloud } from 'lucide-react';
import type { ChangeEvent, DragEvent, RefObject } from 'react';

import type { AdminEventImage } from '../../../lib/events';

interface EventImageAlbumProps {
  eventExists: boolean;
  images: AdminEventImage[];
  pendingFiles: File[];
  isDropActive: boolean;
  isUploading: boolean;
  uploadProgress: number;
  inputRef: RefObject<HTMLInputElement | null>;
  onInputFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  onDropFiles: (event: DragEvent<HTMLDivElement>) => void;
  onDropActiveChange: (active: boolean) => void;
  onRemovePendingFile: (file: File) => void;
  onUpload: () => void;
  onDraggingImageChange: (id: string | null) => void;
  onImageDrop: (id: string) => void;
  onSetCover: (image: AdminEventImage) => void;
  onDeleteImage: (image: AdminEventImage) => void;
}

export default function EventImageAlbum(props: EventImageAlbumProps) {
  const {
    eventExists, images: orderedImages, pendingFiles, isDropActive, isUploading,
    uploadProgress, inputRef, onInputFiles, onDropFiles, onDropActiveChange,
    onRemovePendingFile, onUpload, onDraggingImageChange, onImageDrop,
    onSetCover, onDeleteImage,
  } = props;

  return (
    <>
      {!eventExists ? (
      <p className="text-xs font-kufi text-sand-dim rounded-lg border border-brass/15 bg-ink/40 px-3 py-2">
        بعد حفظ المناسبة لأول مرة سيظهر قسم ألبوم الصور.
      </p>
    ) : (
      <div className="space-y-4 border-t border-brass/15 pt-4">
        <h5 className="font-kufi text-base text-sand">ألبوم الصور</h5>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onInputFiles}
          className="hidden"
        />

        <div
          onDragOver={(event) => { event.preventDefault(); onDropActiveChange(true); }}
          onDragLeave={() => onDropActiveChange(false)}
          onDrop={onDropFiles}
          className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
            isDropActive ? 'border-brass/60 bg-brass/8' : 'border-brass/25 bg-ink/40'
          }`}
        >
          <UploadCloud className="w-6 h-6 text-brass-lt mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-kufi text-sand">اسحب الصور هنا أو اخترها من جهازك</p>
          <p className="text-xs text-sand-dim mt-1">JPG / PNG / WEBP — الحد الأقصى 5MB لكل صورة</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
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
                    onClick={() => onRemovePendingFile(file)}
                    className="text-copper text-xs font-kufi hover:text-copper-lt transition-colors"
                  >
                    إزالة
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onUpload}
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
                onDragStart={() => onDraggingImageChange(image.id)}
                onDragEnd={() => onDraggingImageChange(null)}
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
                    onClick={() => onSetCover(image)}
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
                    onClick={() => onDeleteImage(image)}
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
    </>
  );
}
