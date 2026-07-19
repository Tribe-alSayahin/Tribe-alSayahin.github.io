import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import JathumMonument from './JathumMonument';

const pushMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('./JathumWeatherCard', () => ({
  default: () => <div>بطاقة الطقس معزولة في هذا الاختبار</div>,
}));

class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];

  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('JathumMonument', () => {
  it('يعرض معلم الجثوم ومحتواه الأساسي بصورة وصفية', () => {
    render(<JathumMonument />);

    expect(screen.getByRole('heading', { name: /مِن هنا كانت البداية/ })).toBeTruthy();
    expect(screen.getByRole('img', { name: /هضاب الجثوم وهجرة الجثوم/ })).toBeTruthy();
    expect(screen.getByText('الشيخ فرج بن مسيلم السيحاني')).toBeTruthy();
    expect(screen.getByText(/هاري سانت جون فيلبي/)).toBeTruthy();
  });

  it('يفوض إجراءات الاستكشاف إلى scrollToSection عند توفيرها', () => {
    const scrollToSection = vi.fn();
    render(<JathumMonument scrollToSection={scrollToSection} />);

    fireEvent.click(screen.getByRole('button', { name: 'موقعها على خريطة الديار' }));
    fireEvent.click(screen.getByRole('button', { name: 'شواهدها في معرض التراث' }));

    expect(scrollToSection).toHaveBeenNthCalledWith(1, 'map');
    expect(scrollToSection).toHaveBeenNthCalledWith(2, 'gallery');
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('ينتقل إلى مسارات الديار الفعلية عند غياب scrollToSection', () => {
    render(<JathumMonument />);

    expect(pushMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'موقعها على خريطة الديار' }));
    fireEvent.click(screen.getByRole('button', { name: 'شواهدها في معرض التراث' }));

    expect(pushMock).toHaveBeenNthCalledWith(1, '/diyar/');
    expect(pushMock).toHaveBeenNthCalledWith(2, '/diyar/#gallery');
  });
});
