import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import HeritageGallery from './HeritageGallery';

afterEach(cleanup);

describe('معرض الديار', () => {
  it('يعرض العزيزية والهمجة والهواوية ضمن بطاقات الديار', () => {
    render(<HeritageGallery />);

    expect(screen.getByRole('heading', { name: 'تصفح شواهد الديار', level: 3 })).toBeTruthy();
    const settlementsFilter = screen.getByRole('button', { name: 'الحواضر والبلدات' });
    expect(settlementsFilter.className).toContain('min-h-11');
    fireEvent.click(settlementsFilter);

    for (const place of ['العزيزية', 'الهمجة', 'الهواوية']) {
      expect(screen.getByRole('heading', { name: place })).toBeTruthy();
      expect(screen.getByRole('button', { name: `قراءة قصة ${place}` }).className).toContain(
        'min-h-11',
      );
    }

    fireEvent.click(screen.getByRole('button', { name: 'قراءة قصة العزيزية' }));
    const dialog = screen.getByRole('dialog', { name: 'قصة العزيزية' });
    const storyText = screen.getByText(/تُعرض العزيزية هنا ضمن قائمة الديار/);

    expect(dialog).toBeTruthy();
    expect(storyText.closest('.grid')?.className).toContain('-m-4');
    expect(storyText.closest('.grid')?.className).toContain('sm:-m-space-6');
  });

  it('لا يعرض عالية نجد أو روابط الخريطة المحذوفة', () => {
    render(<HeritageGallery />);

    expect(screen.queryByText('عالية نجد (مواطن ورعي القبيلة)')).toBeNull();
    expect(screen.queryByRole('button', { name: /الخريطة/ })).toBeNull();
  });
});
