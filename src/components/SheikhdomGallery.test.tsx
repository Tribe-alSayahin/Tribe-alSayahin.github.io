import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import SheikhdomGallery from './SheikhdomGallery';

afterEach(cleanup);

describe('معرض المشيخة', () => {
  it('يعرض صور الإدارة ويحتفظ باختيار حذف جميع الصور', () => {
    const { rerender } = render(<SheikhdomGallery images={[{ src: '/images/new.png', alt: 'صورة جديدة', caption: 'وصف جديد' }]} />);
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByText('وصف جديد')).toBeTruthy();
    rerender(<SheikhdomGallery images={[]} />);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });
  it('يعرض الصور الأربع المرفقة بروابطها وبدائلها النصية', () => {
    render(<SheikhdomGallery />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);
    expect(images.map((image) => image.getAttribute('src'))).toEqual([
      '/images/sheikhdom/participation-statement.png',
      '/images/sheikhdom/al-badu-page-140.png',
      '/images/sheikhdom/sheikh-faraj-post.png',
      '/images/sheikhdom/ibn-musailim-statement-page.png',
    ]);
    expect(images.every((image) => Boolean(image.getAttribute('alt')))).toBe(true);
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });
});
