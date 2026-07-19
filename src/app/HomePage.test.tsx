import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import HomePage from './HomePage';

afterEach(cleanup);

function normalizeRoute(href: string | null) {
  return href === '/' ? href : href?.replace(/\/$/, '');
}

describe('HomePage', () => {
  it('يعرض هوية الصفحة وروابط الديار والنسب الأساسية', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { level: 1, name: 'قبيلة السياحين' })).toBeTruthy();

    const diyarLinks = screen.getAllByRole('link', { name: /استكشف الديار/ });
    expect(diyarLinks.some((link) => normalizeRoute(link.getAttribute('href')) === '/diyar')).toBe(true);

    const nasabLinks = screen.getAllByRole('link', { name: /شجرة النسب/ });
    expect(nasabLinks.some((link) => normalizeRoute(link.getAttribute('href')) === '/nasab')).toBe(true);
  });

  it('يعرض مداخل السيرة التحريرية بمساراتها العامة', () => {
    render(<HomePage />);

    const editorialRoutes = [
      [/الأصول.*تعقّب الجذور/, '/nasab/'],
      [/الديار.*خريطة تفاعلية/, '/diyar/'],
      [/الهوية.*وسم الإبل/, '/hawiya/'],
      [/التاريخ.*الخط الزمني/, '/tarikh/'],
    ] as const;

    for (const [name, href] of editorialRoutes) {
      expect(normalizeRoute(screen.getByRole('link', { name }).getAttribute('href'))).toBe(
        normalizeRoute(href),
      );
    }
  });

  it('يعرض الصورة الأساسية ويحمي رابط مصدرها الخارجي', () => {
    render(<HomePage />);

    const image = screen.getByRole('img', { name: /هضب الجثوم والسهول المحيطة/ });
    expect(image.getAttribute('alt')?.trim()).toBeTruthy();

    const creditLink = screen.getByRole('link', { name: /الصورة: حسين علي بعاج/ });
    expect(creditLink.getAttribute('target')).toBe('_blank');
    expect(creditLink.getAttribute('rel')?.split(/\s+/)).toContain('noreferrer');
  });
});
