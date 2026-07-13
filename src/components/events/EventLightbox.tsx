'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface EventLightboxProps {
  images: Array<{ url: string; alt: string }>;
}

export function EventLightbox({ images }: EventLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
      } else if (event.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, images.length]);

  const open = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {images.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            onClick={() => open(index)}
            className="group relative rounded-xl overflow-hidden border border-brass/15 focus-visible:ring-2 focus-visible:ring-brass"
          >
            <img
              src={image.url}
              alt={image.alt}
              loading="lazy"
              className="w-full h-32 md:h-44 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center">
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 left-4 p-2 rounded-lg border border-brass/30 text-brass-lt hover:bg-brass/10"
            aria-label="إغلاق العارض"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length))}
            className="absolute right-4 md:right-8 p-2 rounded-lg border border-brass/30 text-brass-lt hover:bg-brass/10"
            aria-label="الصورة السابقة"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <img
            src={images[activeIndex].url}
            alt={images[activeIndex].alt}
            className="max-h-[85vh] w-auto max-w-[92vw] object-contain rounded-xl border border-brass/20"
          />

          <button
            onClick={() => setActiveIndex((prev) => (prev === null ? null : (prev + 1) % images.length))}
            className="absolute left-4 md:left-8 p-2 rounded-lg border border-brass/30 text-brass-lt hover:bg-brass/10"
            aria-label="الصورة التالية"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}
