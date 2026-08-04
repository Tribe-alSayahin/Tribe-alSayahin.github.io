import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import WasmGallery from './WasmGallery';

afterEach(cleanup);

describe('معرض وسم الإبل', () => {
  it('يغيّر لوحة الوسم عند اختيار تباين آخر', () => {
    render(<WasmGallery />);

    const classicOption = screen.getByRole('button', { name: 'عرض وسم الباب الأصيل' });
    const mutraqOption = screen.getByRole('button', { name: 'عرض وسم الباب والمطرق' });

    expect(classicOption.tagName).toBe('BUTTON');
    expect(mutraqOption.tagName).toBe('BUTTON');
    mutraqOption.focus();
    expect(document.activeElement).toBe(mutraqOption);
    expect(classicOption.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('img', { name: 'رسم وسم الباب الأصيل' })).toBeTruthy();
    expect(screen.getByText(/يُعرف وسم الباب ببساطة تكوينه/)).toBeTruthy();

    fireEvent.click(mutraqOption);

    expect(mutraqOption.getAttribute('aria-pressed')).toBe('true');
    expect(classicOption.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('img', { name: 'رسم وسم الباب والمطرق' })).toBeTruthy();
    expect(screen.queryByRole('img', { name: 'رسم وسم الباب الأصيل' })).toBeNull();
    expect(screen.getByText(/توارثت العوائل هذا الميسم/)).toBeTruthy();
    expect(screen.queryByText(/يُعرف وسم الباب ببساطة تكوينه/)).toBeNull();
  });
});
