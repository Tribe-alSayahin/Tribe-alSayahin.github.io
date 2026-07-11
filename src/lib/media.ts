/**
 * إدارة الوسائط (الصور والملفات)
 */

import { supabase } from './supabase';

export interface Media {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  uploaded_by: string;
  created_at: string;
}

export interface MediaInsert {
  file_name: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  uploaded_by: string;
}

/**
 * جلب جميع الوسائط
 */
export async function fetchMedia() {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * جلب وسائط حسب النوع
 */
export async function fetchMediaByType(fileType: string) {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('file_type', fileType)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * إضافة وسائط جديدة
 */
export async function createMedia(media: MediaInsert) {
  const { error } = await supabase
    .from('media')
    .insert(media);

  if (error) {
    return { data: null, error };
  }

  return { data: media as Media, error: null };
}

/**
 * حذف وسائط
 */
export async function deleteMedia(id: string) {
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id);

  return { error };
}

/**
 * رفع ملف إلى Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * الحصول على رابط عام للملف
 */
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return { publicUrl: data.publicUrl };
}
