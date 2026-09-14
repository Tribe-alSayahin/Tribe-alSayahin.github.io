import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SiteSectionsManager } from './SiteSectionsManager';
import { AdminSidebar } from './AdminSidebar';
import { fetchSiteSections, updateSiteSection, uploadSiteImage } from '../../lib/site-sections';

vi.mock('../../lib/site-sections', () => ({
  fetchSiteSections: vi.fn(), updateSiteSection: vi.fn(), uploadSiteImage: vi.fn(),
}));

afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchSiteSections).mockResolvedValue({ data: [], error: null });
  vi.mocked(updateSiteSection).mockResolvedValue({ data: null, error: null });
});

describe('إدارة المشيخة', () => {
  it('يوفر مدخلاً مباشراً للأدمن ويحجبه عن الزائر', () => {
    const onTabChange = vi.fn();
    const { rerender } = render(<AdminSidebar activeTab="dashboard" onTabChange={onTabChange} currentRole="admin" onSignOut={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'المشيخة' }));
    expect(onTabChange).toHaveBeenCalledWith('sheikhdom');
    rerender(<AdminSidebar activeTab="dashboard" onTabChange={onTabChange} currentRole={null} onSignOut={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'المشيخة' })).toBeNull();
  });

  it('يفتح المشيخة مباشرة ويحفظ النص والصور المرفوعة', async () => {
    const notify = vi.fn();
    vi.mocked(uploadSiteImage).mockResolvedValue({ publicUrl: 'https://example.com/photo.png', error: null });
    render(<SiteSectionsManager initialSectionKey="sheikhdom" userId="admin-id" onNotify={notify} />);
    const title = await screen.findByLabelText('عنوان القسم');
    expect((title as HTMLInputElement).value).toBe('المشيخة');
    fireEvent.change(screen.getByLabelText('وصف القسم'), { target: { value: 'نص المشيخة الجديد\nفقرة ثانية' } });
    fireEvent.change(screen.getByLabelText('إضافة صورة إلى معرض المشيخة'), {
      target: { files: [new File(['image'], 'photo.png', { type: 'image/png' })] },
    });
    const alt = await screen.findByLabelText('وصف الصورة ٥');
    fireEvent.change(alt, { target: { value: 'صورة توثيقية' } });
    fireEvent.change(screen.getByLabelText('تعليق الصورة ٥'), { target: { value: 'تعليق جديد' } });
    fireEvent.click(screen.getByRole('button', { name: 'حفظ القسم' }));
    await waitFor(() => expect(updateSiteSection).toHaveBeenCalledWith('sheikhdom', expect.objectContaining({
      description: 'نص المشيخة الجديد\nفقرة ثانية',
    })));
    expect(vi.mocked(updateSiteSection).mock.calls[0]?.[1].gallery_images).toContainEqual({ src: 'https://example.com/photo.png', alt: 'صورة توثيقية', caption: 'تعليق جديد' });
    expect(uploadSiteImage).toHaveBeenCalledWith('sheikhdom', expect.any(File));
  });

  it('يحتفظ بالنص عند فشل الحفظ ولا يعرض نجاحاً', async () => {
    const notify = vi.fn();
    vi.mocked(updateSiteSection).mockRejectedValue(new Error('network'));
    render(<SiteSectionsManager initialSectionKey="sheikhdom" userId="admin-id" onNotify={notify} />);
    fireEvent.change(await screen.findByLabelText('وصف القسم'), { target: { value: 'نص لم يحفظ' } });
    fireEvent.click(screen.getByRole('button', { name: 'حفظ القسم' }));
    await waitFor(() => expect(notify).toHaveBeenCalledWith('تعذر حفظ القسم. حاول مرة أخرى.', 'error'));
    expect(screen.getByLabelText<HTMLTextAreaElement>('وصف القسم').value).toBe('نص لم يحفظ');
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'حفظ القسم' }).disabled).toBe(false);
  });

  it('يمنع الحفظ وتبديل القسم أثناء الرفع ويتيح المحاولة بعد الفشل', async () => {
    let rejectUpload: (error: Error) => void = () => {};
    vi.mocked(uploadSiteImage).mockImplementation(() => new Promise((_, reject) => { rejectUpload = reject; }));
    render(<SiteSectionsManager initialSectionKey="sheikhdom" userId="admin-id" onNotify={vi.fn()} />);
    const input = await screen.findByLabelText('إضافة صورة إلى معرض المشيخة');
    fireEvent.change(input, { target: { files: [new File(['image'], 'photo.png', { type: 'image/png' })] } });
    expect(screen.getByRole('button', { name: 'حفظ القسم' }).closest('fieldset')?.disabled).toBe(true);
    expect(screen.getByRole<HTMLButtonElement>('button', { name: /مدخل الموقع/ }).disabled).toBe(true);
    await act(async () => { rejectUpload(new Error('network')); await Promise.resolve(); });
    expect(screen.getByRole('alert').textContent).toBe('تعذر رفع الصورة. حاول مرة أخرى.');
    expect(screen.getByRole('button', { name: 'حفظ القسم' }).closest('fieldset')?.disabled).toBe(false);
    expect(screen.queryByLabelText('وصف الصورة ٥')).toBeNull();
    expect(updateSiteSection).not.toHaveBeenCalled();
  });

  it('يشترط وصف الصورة ويحفظ إزالة كل الصور كمعرض فارغ', async () => {
    vi.mocked(uploadSiteImage).mockResolvedValue({ publicUrl: 'https://example.com/photo.png', error: null });
    render(<SiteSectionsManager initialSectionKey="sheikhdom" userId="admin-id" onNotify={vi.fn()} />);
    fireEvent.change(await screen.findByLabelText('إضافة صورة إلى معرض المشيخة'), {
      target: { files: [new File(['image'], 'photo.png', { type: 'image/png' })] },
    });
    const alt = await screen.findByLabelText('وصف الصورة ٥');
    expect((alt as HTMLInputElement).checkValidity()).toBe(false);
    fireEvent.submit(screen.getByRole('form', { name: 'تحرير القسم' }));
    expect(updateSiteSection).not.toHaveBeenCalled();
    for (let count = 0; count < 5; count++) {
      fireEvent.click(screen.getByRole('button', { name: 'إزالة الصورة ١ من المعرض' }));
    }
    fireEvent.click(screen.getByRole('button', { name: 'حفظ القسم' }));
    await waitFor(() => expect(updateSiteSection).toHaveBeenCalledWith('sheikhdom', expect.objectContaining({ gallery_images: [] })));
  });

  it('يمنع استبدال المحتوى الافتراضي بالمحفوظ عند فشل تحميل البيانات', async () => {
    vi.mocked(fetchSiteSections).mockRejectedValue(new Error('network'));
    render(<SiteSectionsManager initialSectionKey="sheikhdom" userId="admin-id" onNotify={vi.fn()} />);
    await screen.findByRole('button', { name: 'إعادة محاولة التحميل' });
    fireEvent.submit(screen.getByRole('form', { name: 'تحرير القسم' }));
    expect(updateSiteSection).not.toHaveBeenCalled();
  });
});
