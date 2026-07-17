import { supabase } from './supabase';
import { syncCurrentVisitorProfile, type StoredVisitorProfile } from './visitor-directory';

const AVATAR_BUCKET = 'visitor-avatars';
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

export const validateVisitorName = (name: string): { value: string; error: string } => {
  const value = name.trim();
  if (!value) return { value, error: 'اكتب اسم العرض أولاً.' };
  if (value.length > 60) return { value, error: 'يجب ألا يتجاوز الاسم ٦٠ حرفًا.' };
  return { value, error: '' };
};

export const validateAvatarFile = (file: File): string => {
  if (!ALLOWED_AVATAR_TYPES.has(file.type)) return 'اختر صورة بصيغة JPG أو PNG أو WebP.';
  if (file.size > MAX_AVATAR_SIZE) return 'يجب ألا يتجاوز حجم الصورة ٢ ميجابايت.';
  return '';
};

export const getAvatarExtension = (file: File): string =>
  ALLOWED_AVATAR_TYPES.get(file.type) ?? '';

type SaveProfileResult = {
  data: StoredVisitorProfile | null;
  error: string;
};

export async function saveVisitorProfile(
  userId: string,
  name: string,
  avatarFile: File | null,
  currentAvatarUrl: string,
): Promise<SaveProfileResult> {
  const nameResult = validateVisitorName(name);
  if (nameResult.error) return { data: null, error: nameResult.error };

  let avatarUrl = currentAvatarUrl;
  if (avatarFile) {
    const fileError = validateAvatarFile(avatarFile);
    if (fileError) return { data: null, error: fileError };

    const path = `${userId}/avatar.${getAvatarExtension(avatarFile)}`;
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, avatarFile, { contentType: avatarFile.type, upsert: true });
    if (uploadError) return { data: null, error: 'تعذر رفع الصورة. حاول مرة أخرى.' };

    const publicUrl = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
    avatarUrl = `${publicUrl}?v=${Date.now()}`;
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: { full_name: nameResult.value, name: nameResult.value, avatar_url: avatarUrl },
  });
  if (updateError) return { data: null, error: 'تعذر حفظ الملف التعريفي. حاول مرة أخرى.' };

  const synced = await syncCurrentVisitorProfile();
  return synced.error
    ? { data: null, error: 'حُفظت البيانات، لكن تعذر تحديث عرض الملف الآن.' }
    : { data: synced.data, error: '' };
}
