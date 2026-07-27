'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { ImagePlus, LoaderCircle, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { uploadSiteImage } from '../../lib/site-sections';
import type { SiteSectionKey } from '../../lib/site-sections-shared';

interface AdminImageUploaderProps {
  value: string;
  alt: string;
  folder: SiteSectionKey | 'posts';
  onChange: (url: string) => void;
  onError?: (message: string) => void;
}

export function AdminImageUploader({
  value,
  alt,
  folder,
  onChange,
  onError,
}: AdminImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadError('');
    setIsUploading(true);
    const result = await uploadSiteImage(folder, file);
    setIsUploading(false);

    if (result.error || !result.publicUrl) {
      const message = result.error?.message ?? 'تعذر رفع الصورة.';
      setUploadError(message);
      onError?.(message);
      return;
    }

    onChange(result.publicUrl);
  };

  return (
    <div className="rounded-xl border border-brass/20 bg-ink/55 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-kufi text-sm text-sand">صورة القسم</p>
          <p className="text-xs text-sand-dim mt-1">JPG أو PNG أو WebP، بحد أقصى 5 ميجابايت.</p>
        </div>
        <ImagePlus className="w-5 h-5 text-brass-lt" aria-hidden="true" />
      </div>

      {value && (
        <div className="relative overflow-hidden rounded-xl border border-brass/15 bg-ink aspect-[16/7]">
          <Image
            src={value}
            alt={alt || 'معاينة الصورة المختارة'}
            fill
            sizes="(min-width: 1280px) 700px, 90vw"
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" aria-hidden="true" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => void handleFile(event)}
        className="sr-only"
        aria-label="اختيار صورة من الجهاز"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-2 rounded-lg border border-brass/35 bg-brass/10 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/20 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        >
          {isUploading ? (
            <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="w-4 h-4" aria-hidden="true" />
          )}
          {isUploading ? 'جارٍ رفع الصورة...' : value ? 'استبدال الصورة' : 'إضافة صورة'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-2 rounded-lg border border-copper/35 px-4 py-2 text-sm font-kufi text-copper-lt hover:bg-copper/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            إزالة من القسم
          </button>
        )}
      </div>
      {uploadError && <p className="text-xs font-kufi text-copper-lt">{uploadError}</p>}
    </div>
  );
}
