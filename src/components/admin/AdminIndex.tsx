import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import NewsManager from './NewsManager';
import GalleryManager from './GalleryManager';
import ContentManager from './ContentManager';
import SocialManager from './SocialManager';
import SettingsManager from './SettingsManager';

type AdminPage = 'dashboard' | 'news' | 'gallery' | 'content' | 'social' | 'settings';

export default function AdminIndex() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthed(!!session);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sand">جارٍ التحميل...</div>;

  if (!isAuthed) return <AdminLogin onLoginSuccess={() => setIsAuthed(true)} />;

  const handleNavigate = (next: string) => setPage(next as AdminPage);

  switch (page) {
    case 'news':
      return <AdminLayout currentPage={page} onNavigate={handleNavigate} onBack={() => setPage('dashboard')}><NewsManager /></AdminLayout>;
    case 'gallery':
      return <AdminLayout currentPage={page} onNavigate={handleNavigate} onBack={() => setPage('dashboard')}><GalleryManager /></AdminLayout>;
    case 'content':
      return <AdminLayout currentPage={page} onNavigate={handleNavigate} onBack={() => setPage('dashboard')}><ContentManager /></AdminLayout>;
    case 'social':
      return <AdminLayout currentPage={page} onNavigate={handleNavigate} onBack={() => setPage('dashboard')}><SocialManager /></AdminLayout>;
    case 'settings':
      return <AdminLayout currentPage={page} onNavigate={handleNavigate} onBack={() => setPage('dashboard')}><SettingsManager /></AdminLayout>;
    default:
      return <AdminLayout currentPage={page} onNavigate={handleNavigate}><AdminDashboard /></AdminLayout>;
  }
}
