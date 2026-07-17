'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Camera, Save, UserCircle } from 'lucide-react';

import { saveVisitorProfile } from '../../lib/visitor-profile-editor';
import type { StoredVisitorProfile } from '../../lib/visitor-directory';

interface VisitorProfileEditorProps {
  userId: string;
  initialName: string;
  avatarUrl: string;
  onSaved: (profile: StoredVisitorProfile) => void;
}

export default function VisitorProfileEditor({
  userId,
  initialName,
  avatarUrl,
  onSaved,
}: VisitorProfileEditorProps) {
  const [name, setName] = useState(initialName);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(avatarUrl);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl(avatarUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile, avatarUrl]);

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    setAvatarFile(file);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await saveVisitorProfile(userId, name, avatarFile, avatarUrl);
      if (result.error || !result.data) {
        setError(result.error || 'تعذر حفظ الملف التعريفي.');
        return;
      }

      setAvatarFile(null);
      setSuccess('تم حفظ الاسم والصورة بنجاح.');
      onSaved(result.data);
    } catch {
      setError('تعذر الاتصال بخدمة الملفات. تحقق من اتصالك ثم حاول مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-brass/30 bg-ink/45 text-brass-lt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          aria-label="اختيار صورة شخصية"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="معاينة الصورة الشخصية" className="h-full w-full object-cover" />
          ) : (
            <UserCircle className="h-full w-full p-2" aria-hidden="true" />
          )}
          <span className="absolute inset-x-0 bottom-0 flex justify-center bg-ink/80 py-1 text-sand transition-colors group-hover:text-brass-lt" aria-hidden="true">
            <Camera className="h-4 w-4" />
          </span>
        </button>
        <div>
          <p className="font-kufi text-sm text-sand">الصورة الشخصية</p>
          <p className="mt-1 text-xs text-sand-dim">JPG أو PNG أو WebP، بحد أقصى ٢ ميجابايت.</p>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 text-xs font-kufi text-brass-lt underline-offset-4 hover:underline">
            اختيار صورة
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => handleFileChange(event.target.files?.[0])}
        />
      </div>

      <div>
        <label htmlFor="visitor-display-name" className="mb-2 block font-kufi text-sm text-sand">اسم العرض</label>
        <input
          id="visitor-display-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          autoComplete="name"
          className="w-full rounded-lg border border-brass/20 bg-ink/45 px-3 py-2.5 text-sand outline-none placeholder:text-sand-dim focus:border-brass/50 focus:ring-2 focus:ring-brass/30"
          placeholder="اكتب الاسم الذي سيظهر للزوار"
        />
      </div>

      {error && <p className="text-xs font-kufi text-copper" role="alert">{error}</p>}
      {success && <p className="text-xs font-kufi text-emerald-lt" role="status">{success}</p>}

      <button
        type="submit"
        disabled={isSaving}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brass px-4 py-2.5 text-sm font-kufi text-ink transition-colors hover:bg-brass-lt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass disabled:cursor-wait disabled:opacity-60"
      >
        <Save className="h-4 w-4" aria-hidden="true" />
        {isSaving ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
      </button>
    </form>
  );
}
