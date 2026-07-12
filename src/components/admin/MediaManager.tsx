'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Image, Upload, Trash2, Download, Copy, Search, Filter } from 'lucide-react';
import {
  fetchMedia,
  createMedia,
  deleteMedia,
  uploadFile,
  getPublicUrl,
  type Media,
} from '../../lib/media';
import { supabase } from '../../lib/supabase';
import { ConfirmModal } from './ConfirmModal';

interface MediaManagerProps {
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

export function MediaManager({ onNotify }: MediaManagerProps = {}) {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'document'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null);

  const loadMedia = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchMedia();
    if (error) {
      setError(error.message);
      onNotify?.(error.message, 'error');
    } else {
      setMedia(data || []);
      setError('');
    }
    setIsLoading(false);
  }, [onNotify]);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const filteredMedia = useMemo(() => {
    let items = media;
    const term = search.trim().toLowerCase();
    if (term) {
      items = items.filter((item) => item.file_name.toLowerCase().includes(term));
    }
    if (typeFilter !== 'all') {
      items = items.filter((item) =>
        typeFilter === 'image' ? item.file_type.startsWith('image/') : !item.file_type.startsWith('image/')
      );
    }
    return items;
  }, [media, search, typeFilter]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('يرجى اختيار ملف أولاً');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session?.user) {
        setError('يجب تسجيل الدخول لرفع الملفات');
        setIsUploading(false);
        return;
      }

      const userId = sessionData.session.user.id;
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await uploadFile('media', filePath, selectedFile);

      if (uploadError) {
        setError(uploadError.message);
        onNotify?.(uploadError.message, 'error');
        setIsUploading(false);
        return;
      }

      const { publicUrl } = getPublicUrl('media', filePath);

      const { error: insertError } = await createMedia({
        file_name: selectedFile.name,
        file_url: publicUrl,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        uploaded_by: userId,
      });

      if (insertError) {
        setError(insertError.message);
        onNotify?.(insertError.message, 'error');
        setIsUploading(false);
        return;
      }

      setSelectedFile(null);
      onNotify?.('تم رفع الملف بنجاح', 'success');
      await loadMedia();
    } catch {
      setError('حدث خطأ أثناء رفع الملف');
      onNotify?.('حدث خطأ أثناء رفع الملف', 'error');
    }

    setIsUploading(false);
  };

  const handleDelete = async (item: Media) => {
    const { error } = await deleteMedia(item.id);
    if (error) {
      setError(error.message);
      onNotify?.(error.message, 'error');
    } else {
      onNotify?.('تم حذف الملف بنجاح', 'success');
      await loadMedia();
    }
    setDeleteTarget(null);
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      onNotify?.('تم نسخ الرابط', 'success');
    } catch {
      onNotify?.('تعذر نسخ الرابط', 'error');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-5 h-5 text-brass-lt" aria-hidden="true" />;
    }
    return <Download className="w-5 h-5 text-sand-dim" aria-hidden="true" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
          <Image className="w-5 h-5 text-brass-lt" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-ruqaa text-xl text-sand">إدارة الوسائط</h3>
          <p className="text-sm text-sand-dim">رفع وإدارة الصور والملفات</p>
        </div>
      </div>

      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
        <h4 className="font-kufi text-lg text-brass-lt mb-4">رفع ملف جديد</h4>
        <div className="grid gap-3">
          <input
            type="file"
            onChange={handleFileSelect}
            className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand focus:outline-none focus:border-brass/50"
            accept="image/*,.pdf,.doc,.docx"
          />
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-ink/50 rounded-lg">
              <span className="text-sm text-sand">{selectedFile.name}</span>
              <span className="text-xs text-sand-dim">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </span>
            </div>
          )}
          <button
            onClick={() => { void handleUpload(); }}
            disabled={!selectedFile || isUploading}
            className="flex items-center justify-center gap-2 rounded-lg bg-brass/20 border border-brass/35 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
          >
            <Upload className="w-4 h-4" aria-hidden="true" />
            {isUploading ? 'جارٍ الرفع...' : 'رفع الملف'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-dim" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث باسم الملف"
              className="w-full rounded-lg border border-brass/20 bg-ink/70 pr-9 pl-3 py-2 text-sm text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-dim" aria-hidden="true" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'image' | 'document')}
              className="w-full rounded-lg border border-brass/20 bg-ink/70 pr-9 pl-3 py-2 text-sm text-sand focus:outline-none focus:border-brass/50 appearance-none"
            >
              <option value="all">كل الأنواع</option>
              <option value="image">صور</option>
              <option value="document">مستندات</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm font-kufi text-sand-dim py-8 text-center">جارٍ تحميل الملفات...</p>
        ) : filteredMedia.length === 0 ? (
          <p className="text-sm font-kufi text-sand-dim py-8 text-center">لا توجد ملفات مطابقة.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-brass/15 bg-ink/50 p-4 space-y-3"
              >
                <div className="aspect-video bg-ink/30 rounded-lg overflow-hidden flex items-center justify-center">
                  {item.file_type.startsWith('image/') ? (
                    <img
                      src={item.file_url}
                      alt={item.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      {getFileIcon(item.file_type)}
                      <span className="text-xs text-sand-dim">{item.file_type}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-sand truncate">{item.file_name}</p>
                  <p className="text-xs text-sand-dim">
                    {item.file_size ? `${(item.file_size / 1024).toFixed(2)} KB` : '-'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => void copyUrl(item.file_url)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-brass/35 px-3 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/10 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
                  >
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    نسخ الرابط
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 rounded-lg border border-copper/40 text-copper hover:bg-copper/10 transition-colors focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
                    aria-label="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-xs font-kufi text-copper">{error}</p>}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="تأكيد حذف الملف"
        message={`هل أنت متأكد من حذف الملف "${deleteTarget?.file_name}"؟`}
        confirmLabel="حذف"
        onConfirm={() => deleteTarget && void handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
