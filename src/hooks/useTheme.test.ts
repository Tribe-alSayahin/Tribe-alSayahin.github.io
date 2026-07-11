import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach((key) => delete store[key]); }),
  };
};

describe('useTheme', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage(), writable: true });
    document.documentElement.classList.remove('light');
    vi.clearAllMocks();
  });

  it('يبدأ بوضع داكن افتراضياً عند عدم وجود قيمة محفوظة', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('يسترجع الوضع الفاتح من localStorage عند وجوده', () => {
    const store: Record<string, string> = { 'siyahin-theme': 'light' };
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] ?? null,
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('يبدل بين الوضع الداكن والفاتح عند الاستدعاء', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');
  });

  it('يحفظ الوضع الجديد في localStorage عند التبديل', () => {
    const { result } = renderHook(() => useTheme());
    const storage = window.localStorage as unknown as ReturnType<typeof mockLocalStorage>;

    act(() => {
      result.current.toggleTheme();
    });
    expect(storage.setItem).toHaveBeenCalledWith('siyahin-theme', 'light');

    act(() => {
      result.current.toggleTheme();
    });
    expect(storage.setItem).toHaveBeenCalledWith('siyahin-theme', 'dark');
  });

  it('يضيف فئة light على عنصر html عند تفعيل الوضع الفاتح', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });
    expect(document.documentElement.classList.contains('light')).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });
});
