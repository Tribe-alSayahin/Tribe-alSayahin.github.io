import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import DiyarPage from './page';

vi.mock('../../components/HeritageGallery', () => ({
  default: () => <div data-testid="heritage-gallery">معرض الديار</div>,
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
    map: {
      title: 'خريطة مواطن وديار القبيلة',
      description: 'الخريطة التفاعلية',
      image_url: null,
      image_alt: null,
    },
    gallery: {
      title: 'شواهد الديار',
      description: 'معرض التراث البصري',
      image_url: null,
      image_alt: null,
    },
  }),
}));

afterEach(cleanup);

describe('صفحة الديار', () => {
  it('تعرض معرض الديار من دون قسم الخريطة', async () => {
    render(await DiyarPage());

    expect(screen.getByTestId('heritage-gallery')).toBeTruthy();
    expect(screen.queryByText('خريطة مواطن وديار القبيلة')).toBeNull();
  });
});
