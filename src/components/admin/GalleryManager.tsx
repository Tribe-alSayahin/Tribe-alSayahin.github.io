import { useEffect, useState, type ReactNode, type FormEvent, type ChangeEvent } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/Button';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', image_url: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image_url) return;
    await supabase.from('gallery').insert([form]);
    setForm({ title: '', description: '', image_url: '' });
    loadGallery();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذه الصورة؟')) return;
    await supabase.from('gallery').delete().eq('id', id);
    loadGallery();
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('site-images').upload(`gallery/${fileName}`, file);
    if (error) {
      alert('خطأ في رفع الصورة');
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('site-images').getPublicUrl(`gallery/${fileName}`);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
  };

  return (
    <AdminLayout currentPage="gallery" onNavigate={() => {}} onBack={() => window.location.reload()}>
      <h1 className="font-serif text-3xl font-bold text-sand mb-8">إدارة معرض الصور</h1>

      <form onSubmit={handleSubmit} className="bg-ink-2/50 border border-brass/15 rounded-xl p-6 mb-8 space-y-4">
        <div>
          <label className="block text-xs text-sand-dim mb-2">عنوان الصورة</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
          />
        </div>
        <div>
          <label className="block text-xs text-sand-dim mb-2">وصف (اختياري)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
          />
        </div>
        <div>
          <label className="block text-xs text-sand-dim mb-2">رفع صورة</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
          {uploading && <p className="text-xs text-brass-lt">جارٍ الرفع...</p>}
          {form.image_url && <img src={form.image_url} alt="preview" className="w-32 h-32 object-cover rounded-lg mt-2" />}
        </div>
        <Button type="submit" variant="primary">إضافة للConveyor</Button>
      </form>

      {loading ? (
        <p className="text-sand-dim">جارٍ التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-ink-2/50 border border-brass/15 rounded-xl overflow-hidden">
              <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-serif font-bold text-sand mb-1">{item.title}</h3>
                <p className="text-xs text-sand-dim mb-3">{item.description}</p>
                <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 hover:underline">
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
