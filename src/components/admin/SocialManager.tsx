import { useEffect, useState, type ReactNode, type FormEvent, type ChangeEvent } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/Button';

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  is_active: boolean;
}

export default function SocialManager() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ platform: '', label: '', url: '', is_active: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadSocial();
  }, []);

  const loadSocial = async () => {
    const { data } = await supabase.from('social_links').select('*').order('platform');
    if (data) setItems(data);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.platform || !form.url) return;
    if (editingId) {
      await supabase.from('social_links').update(form).eq('id', editingId);
    } else {
      await supabase.from('social_links').insert([form]);
    }
    setForm({ platform: '', label: '', url: '', is_active: true });
    setEditingId(null);
    loadSocial();
  };

  const handleEdit = (item: SocialLink) => {
    setForm({ platform: item.platform, label: item.label, url: item.url, is_active: item.is_active });
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا الرابط؟')) return;
    await supabase.from('social_links').delete().eq('id', id);
    loadSocial();
  };

  return (
    <AdminLayout currentPage="social" onNavigate={() => {}} onBack={() => window.location.reload()}>
      <h1 className="font-serif text-3xl font-bold text-sand mb-8">إدارة روابط التواصل</h1>

      <form onSubmit={handleSubmit} className="bg-ink-2/50 border border-brass/15 rounded-xl p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="المنصة (مثال: whatsapp)"
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
            required
            className="bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
          />
          <input
            type="text"
            placeholder="الاسم الظاهر"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
          />
        </div>
        <input
          type="url"
          placeholder="الرابط"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          required
          className="w-full bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-sand">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="rounded"
            />
            مفعل
          </label>
          <Button type="submit" variant="primary">{editingId ? 'تحديث' : 'إضافة'}</Button>
          {editingId && <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm({ platform: '', label: '', url: '', is_active: true }); }}>إلغاء</Button>}
        </div>
      </form>

      {loading ? (
        <p className="text-sand-dim">جارٍ التحميل...</p>
      ) : (
        <div className="bg-ink-2/50 border border-brass/15 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brass/10">
              <tr>
                <th className="text-right p-4 text-brass-lt">المنصة</th>
                <th className="text-right p-4 text-brass-lt">الاسم</th>
                <th className="text-right p-4 text-brass-lt">الرابط</th>
                <th className="text-right p-4 text-brass-lt">الحالة</th>
                <th className="text-right p-4 text-brass-lt">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-brass/10">
                  <td className="p-4 text-sand">{item.platform}</td>
                  <td className="p-4 text-sand">{item.label}</td>
                  <td className="p-4 text-sand-dim text-xs">{item.url}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${item.is_active ? 'bg-olive-lt/20 text-olive-lt' : 'bg-red-500/20 text-red-400'}`}>
                      {item.is_active ? 'مفعل' : 'معطل'}
                    </span>
                  </td>
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
