import { supabase } from './supabase';
import type { Tables, TablesInsert, TablesUpdate } from './database.types';

export type AdminEventStatus = 'draft' | 'published';

export type AdminEventRecord = Omit<Tables<'admin_events'>, 'status'> & {
  status: AdminEventStatus;
  image_count?: number;
};

export type AdminEventImage = Tables<'admin_event_images'>;

export type AdminEventInsert = Omit<TablesInsert<'admin_events'>, 'status'> & {
  status?: AdminEventStatus;
};

export type AdminEventUpdate = Omit<TablesUpdate<'admin_events'>, 'status'> & {
  status?: AdminEventStatus;
};

export const EVENTS_BUCKET = 'events';
export const MAX_EVENT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_EVENT_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

const IMAGE_EXT_BY_MIME: Record<(typeof ALLOWED_EVENT_IMAGE_MIME_TYPES)[number], string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const SAFE_FILE_NAME_REGEX = /[^\p{L}\p{N}\-_.]/gu;

export const sanitizeFileName = (name: string): string => {
  const [rawBase, rawExt] = name.split(/\.(?=[^.]+$)/);
  const base = (rawBase || 'image')
    .trim()
    .replace(SAFE_FILE_NAME_REGEX, '-')
    .replace(/-+/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '')
    .slice(0, 60);
  const ext = (rawExt || 'jpg').trim().replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 8);
  return `${base || 'image'}.${ext || 'jpg'}`;
};

export const validateEventImageFile = (file: File): string | null => {
  if (!ALLOWED_EVENT_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_EVENT_IMAGE_MIME_TYPES)[number])) {
    return `صيغة غير مدعومة: ${file.name}. المسموح JPG/PNG/WEBP فقط.`;
  }

  if (file.size > MAX_EVENT_IMAGE_SIZE_BYTES) {
    return `حجم الملف أكبر من 5MB: ${file.name}.`;
  }

  return null;
};

async function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('تعذر قراءة الصورة.'));
    reader.readAsDataURL(file);
  });
}

async function loadImageFromBlob(file: Blob): Promise<HTMLImageElement> {
  const src = await readFileAsDataUrl(file);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('تعذر معالجة الصورة.'));
    image.src = src;
  });
}

async function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.88): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('فشل توليد الصورة المضغوطة.'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      quality,
    );
  });
}

const fitDimensions = (width: number, height: number, maxWidth: number) => {
  if (width <= maxWidth) {
    return { width, height };
  }
  const ratio = maxWidth / width;
  return {
    width: maxWidth,
    height: Math.round(height * ratio),
  };
};

export async function optimizeEventImage(file: File): Promise<{ main: Blob; thumb: Blob }> {
  const image = await loadImageFromBlob(file);

  const mainDimensions = fitDimensions(image.width, image.height, 1600);
  const mainCanvas = document.createElement('canvas');
  mainCanvas.width = mainDimensions.width;
  mainCanvas.height = mainDimensions.height;
  const mainContext = mainCanvas.getContext('2d');

  if (!mainContext) {
    throw new Error('تعذر تهيئة معالج الصور.');
  }

  mainContext.drawImage(image, 0, 0, mainDimensions.width, mainDimensions.height);

  const thumbDimensions = fitDimensions(image.width, image.height, 560);
  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = thumbDimensions.width;
  thumbCanvas.height = thumbDimensions.height;
  const thumbContext = thumbCanvas.getContext('2d');

  if (!thumbContext) {
    throw new Error('تعذر تهيئة الصورة المصغرة.');
  }

  thumbContext.drawImage(image, 0, 0, thumbDimensions.width, thumbDimensions.height);

  const main = await canvasToBlob(mainCanvas, 0.9);
  const thumb = await canvasToBlob(thumbCanvas, 0.78);

  return { main, thumb };
}

export async function fetchAdminEvents(): Promise<{ data: AdminEventRecord[]; error: null } | { data: null; error: { message: string } }> {
  const eventsResult = await supabase
    .from('admin_events')
    .select('id,title,slug,summary,description,event_date_gregorian,event_date_hijri,location,status,cover_image_url,cover_thumbnail_url,created_at,updated_at,created_by')
    .order('event_date_gregorian', { ascending: false });

  if (eventsResult.error) {
    return { data: null, error: eventsResult.error };
  }

  const events = (eventsResult.data ?? []) as AdminEventRecord[];

  if (events.length === 0) {
    return { data: [], error: null };
  }

  const ids = events.map((event) => event.id);
  const imagesResult = await supabase
    .from('admin_event_images')
    .select('event_id')
    .in('event_id', ids);

  if (imagesResult.error) {
    return { data: events, error: null };
  }

  const counts = new Map<string, number>();
  for (const row of imagesResult.data ?? []) {
    const eventId = row.event_id;
    counts.set(eventId, (counts.get(eventId) ?? 0) + 1);
  }

  return {
    data: events.map((event) => ({
      ...event,
      image_count: counts.get(event.id) ?? 0,
    })),
    error: null,
  };
}

export async function fetchAdminEventById(id: string) {
  return supabase
    .from('admin_events')
    .select('id,title,slug,summary,description,event_date_gregorian,event_date_hijri,location,status,cover_image_url,cover_thumbnail_url,created_at,updated_at,created_by')
    .eq('id', id)
    .single();
}

export async function createAdminEvent(payload: AdminEventInsert) {
  return supabase
    .from('admin_events')
    .insert(payload)
    .select('id,title,slug,summary,description,event_date_gregorian,event_date_hijri,location,status,cover_image_url,cover_thumbnail_url,created_at,updated_at,created_by')
    .single();
}

export async function updateAdminEvent(id: string, payload: AdminEventUpdate) {
  return supabase
    .from('admin_events')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id,title,slug,summary,description,event_date_gregorian,event_date_hijri,location,status,cover_image_url,cover_thumbnail_url,created_at,updated_at,created_by')
    .single();
}

export async function deleteAdminEvent(id: string) {
  const imagesResult = await fetchAdminEventImages(id);

  if (!imagesResult.error && imagesResult.data.length > 0) {
    const removeTargets = imagesResult.data.flatMap((image) => [image.storage_path, image.thumbnail_path]);
    const { error: storageError } = await supabase.storage.from(EVENTS_BUCKET).remove(removeTargets);
    if (storageError) {
      return { error: storageError };
    }
  }

  return supabase.from('admin_events').delete().eq('id', id);
}

export async function fetchAdminEventImages(eventId: string) {
  return supabase
    .from('admin_event_images')
    .select('id,event_id,file_name,storage_path,public_url,thumbnail_path,thumbnail_url,mime_type,size_bytes,sort_order,is_cover,uploaded_by,created_at')
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true });
}

export async function uploadEventImage(
  eventId: string,
  originalFile: File,
  processed: { main: Blob; thumb: Blob },
  userId: string,
  order: number,
) {
  const sanitized = sanitizeFileName(originalFile.name);
  const baseName = sanitized.replace(/\.[^.]+$/, '');
  const now = Date.now();
  const uniqueKey = `${now}-${Math.round(Math.random() * 1_000_000)}`;
  const mainPath = `${eventId}/${baseName}-${uniqueKey}.webp`;
  const thumbPath = `${eventId}/thumb-${baseName}-${uniqueKey}.webp`;

  const uploadMain = await supabase.storage
    .from(EVENTS_BUCKET)
    .upload(mainPath, processed.main, { contentType: 'image/webp', upsert: false });

  if (uploadMain.error) {
    return { data: null, error: uploadMain.error };
  }

  const uploadThumb = await supabase.storage
    .from(EVENTS_BUCKET)
    .upload(thumbPath, processed.thumb, { contentType: 'image/webp', upsert: false });

  if (uploadThumb.error) {
    await supabase.storage.from(EVENTS_BUCKET).remove([mainPath]);
    return { data: null, error: uploadThumb.error };
  }

  const { data: mainPublic } = supabase.storage.from(EVENTS_BUCKET).getPublicUrl(mainPath);
  const { data: thumbPublic } = supabase.storage.from(EVENTS_BUCKET).getPublicUrl(thumbPath);

  const insert = await supabase
    .from('admin_event_images')
    .insert({
      event_id: eventId,
      file_name: sanitized,
      storage_path: mainPath,
      public_url: mainPublic.publicUrl,
      thumbnail_path: thumbPath,
      thumbnail_url: thumbPublic.publicUrl,
      mime_type: 'image/webp',
      size_bytes: processed.main.size,
      sort_order: order,
      is_cover: false,
      uploaded_by: userId,
    })
    .select('id,event_id,file_name,storage_path,public_url,thumbnail_path,thumbnail_url,mime_type,size_bytes,sort_order,is_cover,uploaded_by,created_at')
    .single();

  if (insert.error) {
    await supabase.storage.from(EVENTS_BUCKET).remove([mainPath, thumbPath]);
    return { data: null, error: insert.error };
  }

  return insert;
}

export async function deleteEventImage(image: AdminEventImage) {
  const removeResult = await supabase.storage
    .from(EVENTS_BUCKET)
    .remove([image.storage_path, image.thumbnail_path]);

  if (removeResult.error) {
    return { error: removeResult.error };
  }

  const deleteResult = await supabase
    .from('admin_event_images')
    .delete()
    .eq('id', image.id)
    .eq('event_id', image.event_id);

  if (deleteResult.error) {
    return { error: deleteResult.error };
  }

  return { error: null };
}

export async function reorderEventImages(eventId: string, images: AdminEventImage[]) {
  for (let index = 0; index < images.length; index += 1) {
    const row = images[index];
    const { error } = await supabase
      .from('admin_event_images')
      .update({ sort_order: index })
      .eq('id', row.id)
      .eq('event_id', eventId);

    if (error) {
      return { error };
    }
  }

  return { error: null };
}

export async function setCoverImage(event: AdminEventRecord, image: AdminEventImage) {
  const resetResult = await supabase
    .from('admin_event_images')
    .update({ is_cover: false })
    .eq('event_id', event.id)
    .neq('id', image.id);

  if (resetResult.error) {
    return { error: resetResult.error };
  }

  const setResult = await supabase
    .from('admin_event_images')
    .update({ is_cover: true })
    .eq('id', image.id)
    .eq('event_id', event.id);

  if (setResult.error) {
    return { error: setResult.error };
  }

  return updateAdminEvent(event.id, {
    cover_image_url: image.public_url,
    cover_thumbnail_url: image.thumbnail_url,
  });
}

export const formatEventDateArabic = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ar-SA-u-nu-arab', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const resolveImageExtension = (mimeType: string): string => {
  if (mimeType in IMAGE_EXT_BY_MIME) {
    return IMAGE_EXT_BY_MIME[mimeType as keyof typeof IMAGE_EXT_BY_MIME];
  }
  return 'webp';
};
