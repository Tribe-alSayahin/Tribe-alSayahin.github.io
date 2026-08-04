import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MobileMenu } from './MobileMenu';

vi.mock('next/navigation', () => ({
  usePathname: () => '/diyar/',
}));

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

describe('التنقل السريع على الجوال', () => {
  it('يبقى داخل ارتفاع الشاشة ويوفر أهدافاً لمسية مناسبة', () => {
    const { rerender } = render(<MobileMenu isOpen={false} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { hidden: true });
    dialog.scrollTop = 120;
    rerender(<MobileMenu isOpen onClose={vi.fn()} />);

    expect(dialog.className).toContain('fixed');
    expect(dialog.className).toContain('max-h-[calc(100dvh-92px)]');
    expect(dialog.className).toContain('overflow-y-auto');
    expect(screen.getByRole('link', { name: 'الديار التابعة للقبيلة' }).className).toContain(
      'min-h-11',
    );
    expect(screen.getByRole('link', { name: 'قسم الإدارة' }).className).toContain('min-h-11');
    expect(screen.getByRole('heading', { name: 'التنقل السريع' }).className).toContain('sticky');
    expect(dialog.scrollTop).toBe(0);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<MobileMenu isOpen={false} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('');
  });
});
