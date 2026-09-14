import { describe, expect, it } from 'vitest';
import { mergeSiteSection, validateSiteSectionGallery } from './site-sections-shared';

const image = { src: '/images/test.png', alt: 'وثيقة', caption: 'شاهد تاريخي' };

describe('section gallery validation', () => {
  it('accepts safe uploaded and local images and explicit empty galleries', () => {
    expect(validateSiteSectionGallery([image, { ...image, src: 'https://example.com/image.webp' }])).toBeNull();
    expect(validateSiteSectionGallery([])).toBeNull();
    expect(validateSiteSectionGallery(null)).toBeNull();
  });
  it.each(['javascript:alert(1)', '//evil.example/a', '/\\evil.example/a', 'http://example.com/a', '/a\nb', 'https://user:pass@example.com/a'])('rejects unsafe URL %s', (src) => {
    expect(validateSiteSectionGallery([{ ...image, src }])).not.toBeNull();
  });
  it('rejects malformed galleries and excessive content', () => {
    for (const value of [{}, [null], [{ ...image, alt: '' }], [{ ...image, caption: 'x'.repeat(2001) }], Array.from({ length: 31 }, () => image), [{ ...image, width: -1 }]]) {
      expect(validateSiteSectionGallery(value)).not.toBeNull();
    }
  });
  it('keeps intentional empty galleries and discards invalid stored links', () => {
    expect(mergeSiteSection('sheikhdom', { gallery_images: [] }).gallery_images).toEqual([]);
    expect(mergeSiteSection('sheikhdom', { gallery_images: [{ ...image, src: 'javascript:alert(1)' }] }).gallery_images).toBeNull();
  });
});
