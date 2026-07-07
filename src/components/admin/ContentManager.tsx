import { useEffect, useState, type ReactNode, type FormEvent, type ChangeEvent } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/Button';

interface SiteContent {
  id: string;
  section_key: string;
  title: string;
  content: string;
}

export default function ContentManager() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SiteContent | null>(null);
  const [form, setForm] = useState({ section_key: '', title: '', content: '' });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase.from('site_content').select('*').order('section_key');
    if (data) setItems(data);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.section_key || !form.title) return;
    if (editingItem) {
      await supabase.from('site_content').update(form).eq('id', editingItem.id);
    } else {
      await supabase.from('site_content').insert([form]);
    }
    setForm({ section_key: '', title: '', content: '' });
    setEditingItem(null);
    loadContent();
  };

  const handleEdit = (item: SiteContent) => {
    setForm({ section_key: item.section_key, title: item.title, content: item.content });
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا القسم؟')) return;
    await supabase.from('site_content').delete().eq('id', id);
    loadContent();
  };

  return (
    <AdminLayout currentPage="content" onNavigate={() => {}} onBack={() => window.location.reload()}>
      <h1 className="font-serif text-3xl font-bold text-sand mb-8">إدارة محتوى الموقع</h1>

      <form onSubmit={handleSubmit} className="bg-ink-2/50 border border-brass/15 rounded-xl p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-sand-dim mb-2">مفتاح القسم (فريد)</label>
            <input
              type="text"
              value={form.section_key}
              onChange={(e) => setForm({ ...form, section_key: e.target.value })}
              required
              disabled={!!editingItem}
              placeholder="مثال: about"
              className="w-full bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs text-sand-dim mb-2">العنوان</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
            />
          </div>
        </div>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={4}
          placeholder="المحتوى"
          className="w-full bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
        />
        <div className="flex gap-3">
          <Button type="submit" variant="primary">{editingItem ? 'تحديث' : 'إضافة'}</Button>
          {editingItem && <Button type="button" variant="secondary" onClick={() => { setEditingItem(null); setForm({ section_key: '', title: '', content: '' }); }}>إلغاء</Button>}
        </div>
      </form>

      {loading ? (
        <p className="text-sand-dim">جارٍ التحميل...</p>
      ) : (
        <div className="bg-ink-2/50 border border-brass/15 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brass/10">
              <tr>
                <th className="text-right p-4 text-brass-lt">المفتاح</th>
                <th className="text-right p-4 text-brass-lt">العنوان</th>
                <th className="text-right p-4 text-brass-lt">المحتوى</th>
                <th className="text-right p-4 text-brass-lt">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-brass/10">
                  <td className="p-4 text-sand font-mono text-xs">{item.section_key}</td>
                  <td className="p-4 text-sand">{item.title}</td>
                  <td className="p-4 text-sand-dim line-clamp-1 max-w-xs">{item.content}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-xs text-brass-lt hover:underline">تعديل</button>
                      <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 hover:underline">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
