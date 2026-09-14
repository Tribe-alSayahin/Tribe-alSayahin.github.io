import { SHEIKHDOM_IMAGES } from './SheikhdomGallery.data';
import type { SiteSectionGalleryImage } from '../lib/site-sections-shared';

export default function SheikhdomGallery({ images }: { images?: readonly SiteSectionGalleryImage[] | null }) {
  const gallery: readonly SiteSectionGalleryImage[] = images ?? SHEIKHDOM_IMAGES;
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {gallery.map((image, index) => (
        <figure
          key={`${image.src}-${index}`}
          className="overflow-hidden rounded-2xl border border-brass/20 bg-ink shadow-glow-sm"
        >
          <a
            href={image.src}
            target="_blank"
            rel="noreferrer"
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brass"
            aria-label={`عرض الصورة كاملة في علامة تبويب جديدة: ${image.caption}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              className="h-auto w-full object-contain transition-transform duration-base hover:scale-[1.01]"
            />
          </a>
          <figcaption className="border-t border-brass/15 px-5 py-4 font-sans text-sm leading-7 text-sand-dim">
            {image.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
