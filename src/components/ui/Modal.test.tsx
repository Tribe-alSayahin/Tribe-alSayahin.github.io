import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

describe('النافذة المنبثقة على الجوال', () => {
  it('تُعرض خارج الحاويات المتحركة وتبقى ضمن ارتفاع الشاشة', async () => {
    document.body.style.overflow = 'clip';
    const { unmount } = render(
      <div data-testid="transformed-container">
        <Modal isOpen onClose={vi.fn()} title="قصة الديار">
          <button type="button">إجراء أخير</button>
        </Modal>
      </div>,
    );

    const dialog = await screen.findByRole('dialog', { name: 'قصة الديار' });
    const overlay = dialog.parentElement;

    expect(overlay?.parentElement).toBe(document.body);
    expect(dialog.className).toContain('max-h-[calc(100dvh-2rem)]');
    expect(dialog.className).toContain('min-h-0');
    const closeButton = screen.getByRole('button', { name: 'إغلاق النافذة' });
    expect(closeButton.className).toContain('min-h-11');
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'إجراء أخير' }));
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(closeButton);

    unmount();
    expect(document.body.style.overflow).toBe('clip');
  });
});
