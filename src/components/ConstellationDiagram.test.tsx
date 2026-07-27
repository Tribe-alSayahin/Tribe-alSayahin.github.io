import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import ConstellationDiagram from './ConstellationDiagram';

afterEach(cleanup);

describe('ConstellationDiagram', () => {
  it('يبدّل قراءة المرصد عند اختيار محطة نسب أخرى', async () => {
    render(<ConstellationDiagram />);

    const siyahinButton = screen.getByRole('button', { name: /عرض نسب السياحين/ });
    const adnanButton = screen.getByRole('button', { name: /عرض نسب عدنان/ });

    expect(siyahinButton.getAttribute('aria-pressed')).toBe('true');
    expect(adnanButton.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(adnanButton);

    expect(adnanButton.getAttribute('aria-pressed')).toBe('true');
    expect(siyahinButton.getAttribute('aria-pressed')).toBe('false');
    expect(await screen.findByRole('region', { name: 'تفاصيل عدنان' })).toBeTruthy();
  });
});
