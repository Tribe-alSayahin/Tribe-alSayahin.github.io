import { describe, expect, it } from 'vitest';
import { isSupabaseConfigured, supabase } from './supabase';

describe('Supabase fallback client', () => {
  it('keeps read queries safe when browser configuration is absent', async () => {
    if (isSupabaseConfigured()) return;

    const result = await supabase.from('admin_posts').select('*');

    expect(result).toEqual({ data: [], error: null });
  });

  it('never reports an unconfigured database write as successful', async () => {
    if (isSupabaseConfigured()) return;

    const result = await supabase.from('admin_posts').insert({
      title: 'اختبار',
      slug: 'fallback-test',
      content: 'محتوى اختباري',
      kind: 'news',
      status: 'draft',
    });

    expect(result.data).toBeNull();
    expect(result.error?.message).toBe('Supabase is not configured');
  });

  it('fails chained mutations and storage removals explicitly', async () => {
    if (isSupabaseConfigured()) return;

    const updateResult = await supabase.from('admin_posts').update({ title: 'تعديل' }).eq('id', 'missing');
    const storageResult = await supabase.storage.from('visitor-avatars').remove(['missing/avatar.webp']);

    expect(updateResult.error?.message).toBe('Supabase is not configured');
    expect(storageResult.error?.message).toBe('Supabase is not configured');
  });
});
