import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Footer } from './Footer';

afterEach(cleanup);

describe('تسميات روابط التذييل', () => {
  it('تتضمن الأسماء القابلة للوصول النص الظاهر للمستخدم', () => {
    render(<Footer />);

    expect(
      screen.getByRole('link', { name: 'مراسلة إدارة الموقع: admin@alsaihani.com' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'حساب القبيلة على سناب شات: live.asya7een' }),
    ).toBeTruthy();
  });
});
