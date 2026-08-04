import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import HeritageGallery from './HeritageGallery';

afterEach(cleanup);

describe('معرض الديار', () => {
  it('يعرض العزيزية والهمجة والهواوية ضمن بطاقات الديار', () => {
    render(<HeritageGallery />);

    fireEvent.click(screen.getByRole('button', { name: 'الحواضر والبلدات' }));

    for (const place of ['العزيزية', 'الهمجة', 'الهواوية']) {
      expect(screen.getByRole('heading', { name: place })).toBeTruthy();
      expect(screen.getByRole('button', { name: `قراءة قصة ${place}` })).toBeTruthy();
    }

    fireEvent.click(screen.getByRole('button', { name: 'قراءة قصة العزيزية' }));
    expect(screen.getByText(/تُعرض العزيزية هنا ضمن قائمة الديار/)).toBeTruthy();
  });

  it('لا يعرض عالية نجد أو روابط الخريطة المحذوفة', () => {
    render(<HeritageGallery />);

    expect(screen.queryByText('عالية نجد (مواطن ورعي القبيلة)')).toBeNull();
    expect(screen.queryByRole('button', { name: /الخريطة/ })).toBeNull();
  });
});
