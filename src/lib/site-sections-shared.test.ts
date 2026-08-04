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
      'lineage',
      'constellation',
      'jathum',
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
      title: 'نسب القبيلة الأصيل',
      status: 'published',
    });
    expect(
      SITE_SECTION_DEFINITIONS.find(({ key }) => key === 'jathum'),
    ).toMatchObject({
      page: 'الديار والهجرات',
      title: 'أساس الديار — الجثوم',
      sortOrder: 40,
    });
    expect(
      SITE_SECTION_DEFINITIONS.find(({ key }) => key === 'gallery'),
    ).toMatchObject({
      page: 'الديار والهجرات',
      label: 'ديار القبيلة',
      title: 'الديار التابعة للقبيلة',
      sortOrder: 50,
    });
  });

  it('merges stored content without allowing the section key to drift', () => {
    expect(
      mergeSiteSection('gallery', {
        section_key: 'archive',
        title: 'عنوان محدث',
        image_url: 'https://example.com/gallery.webp',
      }),
    ).toMatchObject({
      section_key: 'gallery',
      title: 'عنوان محدث',
      image_url: 'https://example.com/gallery.webp',
    });
  });

  it('normalizes legacy stored titles to the canonical panel titles', () => {
    expect(
      mergeSiteSection('lineage', {
        title: 'ديوان نسب القبيلة الأصيل',
      }),
    ).toMatchObject({ title: 'نسب القبيلة الأصيل' });

    expect(
      mergeSiteSection('jathum', {
        title: 'هجرة الجثوم — أساس الديار',
      }),
    ).toMatchObject({ title: 'أساس الديار — الجثوم' });

    expect(
      mergeSiteSection('gallery', {
        title: 'معرض التراث والمقتنيات',
      }),
    ).toMatchObject({ title: 'الديار التابعة للقبيلة' });

    expect(
      mergeSiteSection('lineage', {
        title: 'عنوان مخصص من لوحة الإدارة',
      }),
    ).toMatchObject({ title: 'عنوان مخصص من لوحة الإدارة' });
  });
});
