import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { AdminEventRecord } from '../../../lib/events';
import EventList from './EventList';

const event: AdminEventRecord = {
  id: 'event-1',
  title: 'مناسبة اختبارية',
  slug: 'test-event',
  summary: 'وصف مختصر للمناسبة',
  description: 'الوصف الكامل للمناسبة',
  event_date_gregorian: '2026-07-18',
  event_date_hijri: '٣ محرّم ١٤٤٨هـ',
  location: 'جاثوم',
  status: 'draft',
  cover_image_url: null,
  cover_thumbnail_url: null,
  created_at: '2026-07-18T00:00:00Z',
  updated_at: '2026-07-18T00:00:00Z',
  created_by: null,
  image_count: 2,
};

describe('EventList', () => {
  it('renders event details and delegates management actions', () => {
    const onEdit = vi.fn();
    const onToggleStatus = vi.fn();
    const onDelete = vi.fn();

    render(
      <EventList
        events={[event]}
        isLoading={false}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('مناسبة اختبارية')).toBeTruthy();
    expect(screen.getByText('عدد الصور: 2')).toBeTruthy();
    expect(screen.getByText('بدون غلاف')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'تعديل المناسبة' }));
    fireEvent.click(screen.getByRole('button', { name: 'نشر' }));
    fireEvent.click(screen.getByRole('button', { name: 'حذف المناسبة' }));

    expect(onEdit).toHaveBeenCalledWith(event);
    expect(onToggleStatus).toHaveBeenCalledWith(event);
    expect(onDelete).toHaveBeenCalledWith(event);
  });

  it('shows loading and empty states in Arabic', () => {
    const props = {
      events: [],
      onEdit: vi.fn(),
      onToggleStatus: vi.fn(),
      onDelete: vi.fn(),
    };

    const { rerender } = render(<EventList {...props} isLoading />);
    expect(screen.getByText('جارٍ تحميل المناسبات...')).toBeTruthy();

    rerender(<EventList {...props} isLoading={false} />);
    expect(screen.getByText('لا توجد مناسبات حالياً.')).toBeTruthy();
  });
});
