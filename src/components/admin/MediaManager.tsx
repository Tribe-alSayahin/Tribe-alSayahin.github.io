import { useState, useEffect, useCallback } from 'react';
import { Image, Upload, Trash2, Download } from 'lucide-react';
import {
  fetchMedia,
  createMedia,
  deleteMedia,
  uploadFile,
  getPublicUrl,
  type Media,
} from '../../lib/media';
import { supabase } from '../../lib/supabase';

export function MediaManager() {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadMedia = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchMedia();
    if (error) {
      setError(error.message);
    } else {
      setMedia(data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

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
      // الحصول على المستخدم الحالي
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session?.user) {
        setError('يجب تسجيل الدخول لرفع الملفات');
        setIsUploading(false);
        return;
      }

      const userId = sessionData.session.user.id;

      // رفع الملف إلى Supabase Storage
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await uploadFile('media', filePath, selectedFile);

      if (uploadError) {
        setError(uploadError.message);
        setIsUploading(false);
        return;
      }

      // الحصول على الرابط العام
      const { publicUrl } = getPublicUrl('media', filePath);

      // حفظ معلومات الملف في قاعدة البيانات
      const { error: insertError } = await createMedia({
        file_name: selectedFile.name,
        file_url: publicUrl,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        uploaded_by: userId,
      });

      if (insertError) {
        setError(insertError.message);
        setIsUploading(false);
        return;
      }

      setSelectedFile(null);
      await loadMedia();
    } catch {
      setError('حدث خطأ أثناء رفع الملف');
    }

    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      return;
    }

    const { error } = await deleteMedia(id);
    if (error) {
      setError(error.message);
    } else {
      await loadMedia();
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-5 h-5 text-brass-lt" />;
    }
    return <Download className="w-5 h-5 text-sand-dim" />;
  };

  return (
    <div className="space-y-6">
      {/* رأس القسم */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
          <Image className="w-5 h-5 text-brass-lt" />
        </div>
        <div>
          <h3 className="font-ruqaa text-xl text-sand">إدارة الوسائط</h3>
          <p className="text-sm text-sand-dim">رفع وإدارة الصور والملفات</p>
        </div>
      </div>

      {/* قسم الرفع */}
      <div className="rounded-xl border border-brass/20 bg-ink-2/60 p-5">
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
            className="flex items-center justify-center gap-2 rounded-lg bg-brass/20 border border-brass/35 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'جارٍ الرفع...' : 'رفع الملف'}
          </button>
        </div>
      </div>

      {/* قائمة الملفات */}
      {isLoading ? (
        <p className="text-sm font-kufi text-sand-dim">جارٍ تحميل الملفات...</p>
      ) : media.length === 0 ? (
        <p className="text-sm font-kufi text-sand-dim">لا توجد ملفات حالياً.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((item) => (
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
              <button
                onClick={() => { void handleDelete(item.id); }}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-copper/40 px-3 py-2 text-sm font-kufi text-copper hover:bg-copper/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                حذف
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs font-kufi text-copper">{error}</p>}
    </div>
  );
}
