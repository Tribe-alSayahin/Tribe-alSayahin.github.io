import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import JathumWeatherCard from './JathumWeatherCard';

vi.mock('../hooks/useJathumWeather', () => ({
  useJathumWeather: () => ({ weather: null, isLoading: false, error: null }),
}));

afterEach(cleanup);

describe('JathumWeatherCard', () => {
  it('يحافظ على تسلسل عنوان البطاقة داخل قسم الجثوم', () => {
    render(<JathumWeatherCard />);

    expect(
      screen.getByRole('heading', { name: 'رصد مباشر لهواء الهجرة اليوم', level: 4 }),
    ).toBeTruthy();
  });
});
