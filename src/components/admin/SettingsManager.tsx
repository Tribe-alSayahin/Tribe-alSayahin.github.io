import { useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/Button';

interface Setting {
  id: string;
  setting_key: string;
  setting_value: string;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').order('setting_key');
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleChange = (id: string, value: string) => {
    supabase.from('site_settings').update({ setting_value: value }).eq('id', id).then(() => {
      setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, setting_value: value } : s)));
    });
  };

  return (
    <AdminLayout currentPage="settings" onNavigate={() => {}} onBack={() => window.location.reload()}>
      <h1 className="font-serif text-3xl font-bold text-sand mb-8">إعدادات الموقع</h1>

      {loading ? (
        <p className="text-sand-dim">جارٍ التحميل...</p>
      ) : (
        <div className="bg-ink-2/50 border border-brass/15 rounded-xl p-6 space-y-6">
          {settings.map((setting) => (
            <div key={setting.id}>
              <label className="block text-xs font-kufi font-semibold text-brass-lt/85 mb-2">
                {setting.setting_key}
              </label>
              <input
                type="text"
                value={setting.setting_value}
                onChange={(e) => handleChange(setting.id, e.target.value)}
                className="w-full bg-ink/60 border border-brass/20 rounded-xl px-4 py-3 text-sm text-sand"
              />
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
