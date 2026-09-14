'use client';

import { supabase } from './supabase';
import type { Tables, TablesUpdate } from './database.types';
import {
  getDefaultSiteSection,
  SITE_SECTION_KEYS,
  validateSiteSectionGallery,
  type SiteSectionGalleryImage,
  type SiteSectionKey,
} from './site-sections-shared';

export type SiteSectionRecord = Omit<Tables<'site_sections'>, 'gallery_images'> & {
  gallery_images?: SiteSectionGalleryImage[] | null;
};
export type SiteSectionUpdate = Omit<TablesUpdate<'site_sections'>, 'status' | 'gallery_images'> & {
  status?: 'draft' | 'published';
  gallery_images?: SiteSectionGalleryImage[] | null;
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

  return {
    data: data?.map((row) => ({
      ...row,
      gallery_images: validateSiteSectionGallery(row.gallery_images)
        ? null
        : row.gallery_images as SiteSectionGalleryImage[] | null,
    })) ?? null,
    error,
  };
}

export async function updateSiteSection(
  key: SiteSectionKey,
  payload: SiteSectionUpdate,
): Promise<{ data: SiteSectionRecord | null; error: ApiError | null }> {
  const validationError = validateSiteSectionGallery(payload.gallery_images);
  if (!SITE_SECTION_KEYS.includes(key) || validationError) {
    return { data: null, error: { message: validationError || 'القسم غير معروف.' } };
  }
  const failure = { data: null, error: { message: 'تعذر حفظ القسم. تحقق من صلاحياتك واتصالك وتجهيز قاعدة البيانات ثم حاول مجدداً.' } };
  try {
    const changes = { ...payload, section_key: key, updated_at: new Date().toISOString() };
    const updated = await supabase.from('site_sections').update(changes)
      .eq('section_key', key).select('*').maybeSingle();
    if (updated.error) return failure;
    if (updated.data) return { data: updated.data as SiteSectionRecord, error: null };
    const inserted = await supabase.from('site_sections')
      .upsert({ ...getDefaultSiteSection(key), ...changes }, { onConflict: 'section_key', ignoreDuplicates: true })
      .select('*').single();
    if (inserted.error || !inserted.data) return failure;
    return { data: inserted.data as SiteSectionRecord, error: null };
  } catch {
    return failure;
  }
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
