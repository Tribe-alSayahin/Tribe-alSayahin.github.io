import { describe, expect, it } from 'vitest';
import { STATIC_ROUTE_PATHS } from './navigation';
import { buildPublicPageMetadata, SITE_URL } from './site-metadata';

describe('public search metadata', () => {
  it('builds canonical, language and social preview metadata', () => {
    const metadata = buildPublicPageMetadata({
      title: 'صفحة اختبار',
      description: 'وصف عربي واضح لصفحة الاختبار.',
      path: '/test/',
    });

    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/test/`);
    expect(metadata.alternates?.languages).toEqual({
      'ar-SA': `${SITE_URL}/test/`,
      'x-default': `${SITE_URL}/test/`,
    });
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/test/`);
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('keeps private administration routes out of the public sitemap source', () => {
    expect(STATIC_ROUTE_PATHS).toContain('/hussain/');
    expect(STATIC_ROUTE_PATHS).not.toContain('/admin/');
    expect(STATIC_ROUTE_PATHS).not.toContain('/preview/');
  });
});
