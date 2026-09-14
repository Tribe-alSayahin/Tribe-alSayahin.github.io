import { beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted((): {
  result: { data: unknown; error: unknown };
  saved: unknown;
  from: ReturnType<typeof vi.fn>;
} => ({
  result: { data: null, error: null },
  saved: null,
  from: vi.fn(),
}));
vi.mock('./supabase', () => ({ supabase: { from: db.from } }));
import { updateSiteSection } from './site-sections';

beforeEach(() => {
  db.saved = null;
  db.result = { data: null, error: null };
  db.from.mockReset();
  db.from.mockImplementation(() => ({
    update: () => ({ eq: () => ({ select: () => ({ maybeSingle: () => Promise.resolve(db.result) }) }) }),
    upsert: (payload: unknown) => {
      db.saved = payload;
      return { select: () => ({ single: () => Promise.resolve({ data: payload, error: null }) }) };
    },
  }));
});

describe('section save', () => {
  it('creates a missing sheikhdom record with defaults and confirms the saved data', async () => {
    const result = await updateSiteSection('sheikhdom', { description: 'نص الإدارة', gallery_images: [] });
    expect(result.error).toBeNull();
    expect(result.data).toMatchObject({ section_key: 'sheikhdom', title: 'المشيخة', description: 'نص الإدارة', gallery_images: [] });
  });
  it('returns a safe error for a denied write', async () => {
    db.result = { data: null, error: { message: 'private database details' } };
    const result = await updateSiteSection('sheikhdom', { title: 'عنوان' });
    expect(result.error).toBeTruthy();
    expect(result.error?.message).not.toContain('private database details');
  });
  it('returns an existing saved record without replacing omitted fields with defaults', async () => {
    db.result = { data: { section_key: 'sheikhdom', title: 'عنوان محفوظ', description: 'نص جديد', gallery_images: [] }, error: null };
    const result = await updateSiteSection('sheikhdom', { description: 'نص جديد' });
    expect(result.data).toMatchObject({ title: 'عنوان محفوظ', gallery_images: [] });
    expect(db.saved).toBeNull();
  });
  it('does not report success when an insert returns no confirmed record', async () => {
    db.from.mockImplementation(() => ({
      update: () => ({ eq: () => ({ select: () => ({ maybeSingle: () => Promise.resolve(db.result) }) }) }),
      upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    }));
    expect((await updateSiteSection('sheikhdom', { title: 'عنوان' })).error).toBeTruthy();
  });
  it('rejects invalid images before accessing the database', async () => {
    const result = await updateSiteSection('sheikhdom', { gallery_images: [{ src: 'javascript:alert(1)', alt: 'صورة', caption: '' }] });
    expect(result.error).toBeTruthy();
    expect(db.from).not.toHaveBeenCalled();
  });
});
