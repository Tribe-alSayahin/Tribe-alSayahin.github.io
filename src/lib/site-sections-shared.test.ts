import { describe, expect, it } from 'vitest';
import {
  SITE_SECTION_DEFINITIONS,
  getDefaultSiteSection,
  mergeSiteSection,
} from './site-sections-shared';

describe('site sections', () => {
  it('covers the home and all heritage sections without duplicate keys', () => {
    const keys = SITE_SECTION_DEFINITIONS.map(({ key }) => key);

    expect(keys).toEqual([
      'home',
      'jathum',
      'lineage',
      'constellation',
      'map',
      'gallery',
      'wasm',
      'poetry',
      'timeline',
      'archive',
    ]);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('uses the existing content as a safe build fallback', () => {
    expect(getDefaultSiteSection('lineage')).toMatchObject({
      section_key: 'lineage',
      title: 'ديوان نسب القبيلة الأصيل',
      status: 'published',
    });
  });

  it('merges stored content without allowing the section key to drift', () => {
    expect(
      mergeSiteSection('map', {
        section_key: 'archive',
        title: 'عنوان محدث',
        image_url: 'https://example.com/map.webp',
      }),
    ).toMatchObject({
      section_key: 'map',
      title: 'عنوان محدث',
      image_url: 'https://example.com/map.webp',
    });
  });
});
