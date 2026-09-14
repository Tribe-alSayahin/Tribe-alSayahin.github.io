import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import HomePage from './HomePage';
import { mergeSiteSection } from '../lib/site-sections-shared';

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
      [/الأصول.*نسب القبيلة الأصيل/, '/nasab/'],
      [/الديار.*معرض التراث/, '/diyar/'],
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

  it('يعرض قسم المشيخة وصوره في الصفحة الرئيسية', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { name: 'المشيخة' })).toBeTruthy();
    expect(screen.getAllByRole('img').filter((image) => image.getAttribute('src')?.includes('/images/sheikhdom/'))).toHaveLength(4);
  });
});

describe('saved sheikhdom content', () => {
  it('renders saved text and gallery instead of the fallback images', () => {
    render(<HomePage sheikhdom={mergeSiteSection('sheikhdom', {
      title: 'عنوان المشيخة المحفوظ', description: 'نص المشيخة المحفوظ',
      gallery_images: [{ src: 'https://example.com/saved.webp', alt: 'صورة محفوظة', caption: 'تعليق محفوظ' }],
    })} />);
    expect(screen.getByRole('heading', { name: 'عنوان المشيخة المحفوظ' })).toBeTruthy();
    expect(screen.getByText('نص المشيخة المحفوظ')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'صورة محفوظة' }).getAttribute('src')).toBe('https://example.com/saved.webp');
    expect(screen.getAllByRole('img').filter((image) => image.getAttribute('src')?.includes('/images/sheikhdom/'))).toHaveLength(0);
  });
});