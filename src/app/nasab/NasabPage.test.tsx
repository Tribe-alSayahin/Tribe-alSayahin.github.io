import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NasabPage from './page';

vi.mock('../../components/JathumMonument', () => ({
  default: () => <div data-testid="jathum-monument">أساس الديار</div>,
}));

vi.mock('../../components/LineageTree', () => ({
  default: () => <div data-testid="lineage-tree">شجرة النسب</div>,
}));

vi.mock('../../components/ConstellationDiagram', () => ({
  default: () => <div data-testid="constellation">الأنساب الكوكبية</div>,
}));

vi.mock('../../components/SheikhdomGallery', () => ({
  default: () => <div data-testid="sheikhdom-gallery">صور المشيخة</div>,
}));

vi.mock('../../components/layout/ChapterDivider', () => ({
  ChapterDivider: ({ description }: { description: string }) => <p>{description}</p>,
}));

vi.mock('../../components/layout/Section', () => ({
  Section: ({ children, title }: { children: ReactNode; title: string }) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

vi.mock('../../components/layout/SectionIndex', () => ({
  SectionIndex: ({ sections }: { sections: Array<{ id: string; title: string }> }) => (
    <nav>
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`}>
          {section.title}
        </a>
      ))}
    </nav>
  ),
}));

vi.mock('../../lib/site-sections-server', () => ({
  getPublishedSiteSections: vi.fn().mockResolvedValue({
    jathum: {
      title: 'أساس الديار — الجثوم',
      description: 'الجثوم أساس الديار',
      image_url: null,
      image_alt: null,
    },
    lineage: {
      title: 'نسب القبيلة الأصيل',
      description: 'عمود نسب القبيلة',
      image_url: null,
      image_alt: null,
    },
    constellation: {
      title: 'الخلاصة الكوكبية للأنساب',
      description: 'تمثيل كوكبي للأنساب',
      image_url: null,
      image_alt: null,
    },
  }),
}));

afterEach(cleanup);

describe('صفحة النسب', () => {
  it('تجعل فصل 1 لنسب القبيلة وتنقل الجثوم إلى الديار', async () => {
    render(await NasabPage());

    expect(screen.getByTestId('lineage-tree')).toBeTruthy();
    expect(screen.getByTestId('constellation')).toBeTruthy();
    expect(screen.getByTestId('sheikhdom-gallery')).toBeTruthy();
    expect(screen.queryByTestId('jathum-monument')).toBeNull();
    expect(screen.getByRole('link', { name: 'نسب القبيلة الأصيل' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'المشيخة' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'أساس الديار — الجثوم' })).toBeNull();
  });
});
