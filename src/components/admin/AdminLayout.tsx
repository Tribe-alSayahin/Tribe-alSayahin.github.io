import { useState, type ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import AdminShell from './AdminShell';

interface AdminLayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onBack?: () => void;
  children: ReactNode;
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: '◈' },
  { id: 'news', label: 'إدارة الأخبار', icon: '◉' },
  { id: 'gallery', label: 'إدارة الصور', icon: '◐' },
  { id: 'content', label: 'محتوى الموقع', icon: '◑' },
  { id: 'social', label: 'روابط التواصل', icon: '◒' },
  { id: 'settings', label: 'الإعدادات', icon: '◓' },
];

export default function AdminLayout({ currentPage, onNavigate, onBack, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <AdminShell>
      <div className="min-h-screen bg-ink text-sand" dir="rtl">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 right-4 z-50 lg:hidden bg-brass text-ink p-2 rounded-lg"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        <div className="flex">
          <aside
            className={`fixed inset-y-0 right-0 w-64 bg-ink-2 border-l border-brass/15 transform transition-transform duration-300 z-40 lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-6">
              <h2 className="font-serif text-xl font-bold text-brass mb-8">لوحة الإدارة</h2>
              <nav className="space-y-2">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-right px-4 py-3 rounded-lg transition-all ${
                      currentPage === item.id
                        ? 'bg-brass/15 text-brass-lt border border-brass/25'
                        : 'text-sand-dim hover:bg-brass/10 hover:text-sand'
                    }`}
                  >
                    <span className="ml-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="mt-8 pt-8 border-t border-brass/15 flex flex-col gap-2">
                {onBack && (
                  <button onClick={onBack} className="w-full text-right px-4 py-3 rounded-lg text-sand-dim hover:bg-brass/10 transition-all">
                    العودة للموقع
                  </button>
                )}
                <button onClick={handleLogout} className="w-full text-right px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 mr-0 lg:mr-64 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AdminShell>
  );
}
