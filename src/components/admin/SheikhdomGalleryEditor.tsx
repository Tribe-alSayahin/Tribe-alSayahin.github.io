'use client';

import { MAX_SITE_GALLERY_IMAGES, type SiteSectionGalleryImage } from '../../lib/site-sections-shared';
import { AdminImageUploader } from './AdminImageUploader';

interface SheikhdomGalleryEditorProps {
  images: SiteSectionGalleryImage[];
  onChange: (images: SiteSectionGalleryImage[]) => void;
  onError: (message: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export default function SheikhdomGalleryEditor({ images, onChange, onError, onUploadingChange }: SheikhdomGalleryEditorProps) {
  const updateImage = (index: number, changes: Partial<SiteSectionGalleryImage>) =>
    onChange(images.map((image, currentIndex) => currentIndex === index ? { ...image, ...changes } : image));
  const inputClass = 'w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass';

  return (
    <section aria-label="معرض صور المشيخة" className="space-y-4">
      <h5 className="font-serif text-xl text-sand">صور المشيخة</h5>
      <p className="text-sm text-sand-dim">أضف الصور واكتب وصفها وتعليقها، ثم اضغط حفظ القسم لاعتماد التغييرات.</p>
      {images.length === 0 && <p role="status" className="text-sm text-sand-dim">لا توجد صور في المعرض.</p>}
      {images.map((image, index) => {
        const number = (index + 1).toLocaleString('ar-SA');
        return (
          <div key={`${index}-${image.src}`} className="rounded-xl border border-brass/20 p-4 space-y-3">
            <img src={image.src} alt={image.alt || 'معاينة صورة المشيخة'} loading="lazy" className="max-h-64 w-full object-contain" />
            <label className="block space-y-1 text-sm text-sand-dim">
              <span>وصف الصورة {number}</span>
              <input value={image.alt} onChange={(event) => updateImage(index, { alt: event.target.value })} maxLength={500} required className={inputClass} />
            </label>
            <label className="block space-y-1 text-sm text-sand-dim">
              <span>تعليق الصورة {number}</span>
              <textarea value={image.caption} onChange={(event) => updateImage(index, { caption: event.target.value })} maxLength={2000} rows={2} className={inputClass} />
            </label>
            <button type="button" onClick={() => onChange(images.filter((_, currentIndex) => currentIndex !== index))} className="rounded-lg border border-copper/35 px-3 py-2 font-kufi text-sm text-copper-lt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass">
              إزالة الصورة {number} من المعرض
            </button>
          </div>
        );
      })}
      {images.length < MAX_SITE_GALLERY_IMAGES ? (
        <AdminImageUploader
          value="" alt="" folder="sheikhdom" inputLabel="إضافة صورة إلى معرض المشيخة"
          onChange={(src) => onChange([...images, { src, alt: '', caption: '' }])}
          onError={onError} onUploadingChange={onUploadingChange}
        />
      ) : <p role="status" className="text-sm text-sand-dim">وصلت إلى الحد الأقصى: ٣٠ صورة.</p>}
    </section>
  );
}
