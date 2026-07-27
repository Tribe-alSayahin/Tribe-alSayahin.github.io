'use client';

import { supabase } from './supabase';
import type { Tables, TablesUpdate } from './database.types';
import type { SiteSectionKey } from './site-sections-shared';

export type SiteSectionRecord = Tables<'site_sections'>;
export type SiteSectionUpdate = Omit<TablesUpdate<'site_sections'>, 'status'> & {
  status?: 'draft' | 'published';
};

type ApiError = { message: string };

export async function fetchSiteSections(): Promise<{
  data: SiteSectionRecord[] | null;
  error: ApiError | null;
}> {
  const { data, error } = await supabase
    .from('site_sections')
    .select('*')
    .order('sort_order', { ascending: true });

  return { data, error };
}

export async function updateSiteSection(
  key: SiteSectionKey,
  payload: SiteSectionUpdate,
): Promise<{ error: ApiError | null }> {
  const { error } = await supabase
    .from('site_sections')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('section_key', key);

  return { error };
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateSiteImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return 'صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WebP.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'حجم الصورة يتجاوز 5 ميجابايت.';
  }
  return null;
}

export async function uploadSiteImage(
  sectionKey: SiteSectionKey | 'posts',
  file: File,
): Promise<{ publicUrl: string | null; error: ApiError | null }> {
  const validationError = validateSiteImage(file);
  if (validationError) {
    return { publicUrl: null, error: { message: validationError } };
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${sectionKey}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from('site-media')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { publicUrl: null, error };

  const publicUrl = supabase.storage.from('site-media').getPublicUrl(path).data.publicUrl;
  return { publicUrl, error: null };
}
