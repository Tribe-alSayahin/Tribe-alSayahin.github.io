import { describe, expect, it } from 'vitest';
import { buildSectionedWebPageJsonLd } from './section-indexing';

describe('section indexing structured data', () => {
  it('describes each visible section with its canonical fragment URL', () => {
    const result = buildSectionedWebPageJsonLd({
      path: '/nasab/',
      name: 'النسب والفخوذ',
      description: 'وصف الصفحة',
      sections: [
        {
          id: 'lineage',
          title: 'شجرة النسب',
          description: 'التسلسل الموثق لنسب القبيلة.',
        },
      ],
    });

    expect(result).toMatchObject({
      '@type': 'CollectionPage',
      '@id': 'https://alsaihani.com/nasab/#webpage',
      url: 'https://alsaihani.com/nasab/',
      inLanguage: 'ar-SA',
    });
    expect(result.hasPart).toEqual([
      expect.objectContaining({
        '@type': 'WebPageElement',
        '@id': 'https://alsaihani.com/nasab/#lineage',
        url: 'https://alsaihani.com/nasab/#lineage',
        name: 'شجرة النسب',
      }),
    ]);
  });
});
