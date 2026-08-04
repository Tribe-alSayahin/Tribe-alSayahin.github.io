import { describe, expect, it } from 'vitest';

import { SITE_ROUTES } from './navigation';

describe('التنقل السريع', () => {
  it('يطابق أسماء لوحات فهرس كل فصل', () => {
    const sectionsByRoute = Object.fromEntries(
      SITE_ROUTES.map((route) => [
        route.id,
        route.sections?.map(({ label, href }) => ({ label, href })) ?? [],
      ]),
    );

    expect(sectionsByRoute.nasab).toEqual([
      { label: 'نسب القبيلة الأصيل', href: '/nasab/#lineage' },
      { label: 'الخلاصة الكوكبية للأنساب', href: '/nasab/#constellation' },
    ]);
    expect(sectionsByRoute.diyar).toEqual([
      { label: 'أساس الديار — الجثوم', href: '/diyar/#jathum' },
      { label: 'معرض التراث والمقتنيات', href: '/diyar/#gallery' },
    ]);
    expect(sectionsByRoute.hawiya).toEqual([
      { label: 'وسم الإبل وعلامة الباب', href: '/hawiya/#wasm' },
      { label: 'ديوان الشعر النبطي', href: '/hawiya/#poetry' },
    ]);
    expect(sectionsByRoute.tarikh).toEqual([
      { label: 'صفحات من مآثر وإرث القبيلة', href: '/tarikh/#timeline' },
      {
        label: 'التوثيق الاستشراقي والمدونات التاريخية',
        href: '/tarikh/#archive',
      },
    ]);
    expect(sectionsByRoute.news).toEqual([
      { label: 'الأخبار والمناسبات', href: '/news/' },
      { label: 'المناسبات', href: '/events/' },
      { label: 'داعمو وثيقة وإرث القبيلة', href: '/news/#supporters' },
      { label: 'تواصل معنا', href: '/news/#contact' },
      { label: 'الإدارة', href: '/admin/' },
    ]);
  });
});
