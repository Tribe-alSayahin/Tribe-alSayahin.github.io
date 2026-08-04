import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import DiyarPage from './page';

vi.mock('../../components/HeritageGallery', () => ({
  default: () => <div data-testid="heritage-gallery">معرض الديار</div>,
}));

vi.mock('../../components/JathumMonument', () => ({
  default: () => <div data-testid="jathum-monument">أساس الديار</div>,
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
    gallery: {
      title: 'الديار التابعة للقبيلة',
      description: 'معرض التراث البصري',
      image_url: null,
      image_alt: null,
    },
  }),
}));

afterEach(cleanup);

describe('صفحة الديار', () => {
  it('تعرض أساس الديار ومعرض الديار من دون قسم الخريطة', async () => {
    render(await DiyarPage());

    expect(screen.getByTestId('jathum-monument')).toBeTruthy();
    expect(screen.getByTestId('heritage-gallery')).toBeTruthy();
    expect(screen.queryByText('خريطة مواطن وديار القبيلة')).toBeNull();
    expect(screen.getByRole('link', { name: 'أساس الديار — الجثوم' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'الديار التابعة للقبيلة' })).toBeTruthy();
  });
});
