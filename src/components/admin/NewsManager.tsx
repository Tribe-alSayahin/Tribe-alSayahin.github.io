import { useEffect, useState, type ReactNode, type FormEvent, type ChangeEvent } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/Button';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string | null;
  published_at: string;
  is_published: boolean;
}

export default function NewsManager() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    published_at: '',
    is_published: true,
    image_url: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ title: '', summary: '', content: '', published_at: '', is_published: true, image_url: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...form, published_at: form.published_at || null };
    if (editingId) {
      await supabase.from('news').update(payload).eq('id', editingId);
    } else {
      await supabase.from('news').insert([payload]);
    }
    resetForm();
    loadNews();
  };

  const handleEdit = (item: NewsItem) => {
    setForm({
      title: item.title,
      summary: item.summary || '',
      content: item.content || '',
      published_at: item.published_at || '',
      is_published: item.is_published,
      image_url: item.image_url || '',
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    await supabase.from('news').delete().eq('id', id);
    loadNews();
  };

  const togglePublish = async (item: NewsItem) => {
    await supabase.from('news').update({ is_published: !item.is_published }).eq('id', item.id);
    loadNews();
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('site-images').upload(`news/${fileName}`, file);
    if (error) {
      alert('خطأ في رفع الصورة');
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('site-images').getPublicUrl(`news/${fileName}`);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
  };

  return (
    <AdminLayout currentPage="news" onNavigate={() => {}} onBack={() => window.location.reload()}>
      <h1 className="font-serif text-3xl font-bold text-sand mb-8">إدارة الأخبار</h1>

      <form onSubmit={handleSubmit} className="bg-ink-2/50 border border-brass/15 rounded-xl p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="عنوان الخبر"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
          />
          <input
            type="date"
            value={form.published_at}
            onChange={(e) => setForm({ ...form, published_at: e.target.value })}
            className="bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
          />
        </div>
        <textarea
          placeholder="ملخص الخبر"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          rows={2}
          className="w-full bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
        />
        <textarea
          placeholder="محتوى الخبر"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={4}
          className="w-full bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
        />
        <div>
          <label className="block text-xs text-sand-dim mb-2">صورة الخبر</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
          {uploading && <p className="text-xs text-brass-lt">جارٍ الرفع...</p>}
          {form.image_url && (
            <img src={form.image_url} alt="preview" className="w-32 h-32 object-cover rounded-lg mt-2" />
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary">{editingId ? 'تحديث' : 'إضافة'}</Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>إلغاء</Button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-sand-dim">جارٍ التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-ink-2/50 border border-brass/15 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className={`text-[10px] font-kufi px-2 py-1 rounded-full border ${
                  item.is_published ? 'bg-olive-lt/20 text-olive-lt border-olive-lt/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {item.is_published ? 'منشور' : 'مخفي'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => togglePublish(item)} className="text-xs text-brass-lt hover:underline">
                    {item.is_published ? 'إخفاء' : 'نشر'}
                  </button>
                  <button onClick={() => handleEdit(item)} className="text-xs text-brass-lt hover:underline">تعديل</button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 hover:underline">حذف</button>
                </div>
              </div>
              <h3 className="font-serif font-bold text-sand mb-2">{item.title}</h3>
              <p className="text-xs text-sand-dim line-clamp-2">{item.summary}</p>
              {item.image_url && <img src={item.image_url} alt="" className="w-full h-40 object-cover rounded-lg mt-3" />}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
