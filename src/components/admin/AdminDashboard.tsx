import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';

interface Stats {
  newsCount: number;
  galleryCount: number;
  contentCount: number;
  socialCount: number;
}

interface RecentNews {
  id: string;
  title: string;
  created_at: string;
}

interface RecentGallery {
  id: string;
  title: string;
  created_at: string;
}

export default function AdminDashboard({ onBack }: { onBack?: () => void }) {
  const [stats, setStats] = useState<Stats>({
    newsCount: 0,
    galleryCount: 0,
    contentCount: 0,
    socialCount: 0,
  });
  const [recentNews, setRecentNews] = useState<RecentNews[]>([]);
  const [recentGallery, setRecentGallery] = useState<RecentGallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [newsCount, galleryCount, contentCount, socialCount, recentNewsData, recentGalleryData] =
      await Promise.all([
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('site_content').select('*', { count: 'exact', head: true }),
        supabase.from('social_links').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('gallery').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

    setStats({
      newsCount: newsCount.count || 0,
      galleryCount: galleryCount.count || 0,
      contentCount: contentCount.count || 0,
      socialCount: socialCount.count || 0,
    });
    setRecentNews(recentNewsData.data || []);
    setRecentGallery(recentGalleryData.data || []);
    setLoading(false);
  };

  const statCards = [
    { label: 'الأخبار', value: stats.newsCount, color: 'bg-olive-lt/20 text-olive-lt' },
    { label: 'الصور', value: stats.galleryCount, color: 'bg-copper/20 text-copper' },
    { label: 'أقسام المحتوى', value: stats.contentCount, color: 'bg-brass/20 text-brass-lt' },
    { label: 'روابط التواصل', value: stats.socialCount, color: 'bg-indigo/20 text-indigo' },
  ];

  return (
    <AdminLayout currentPage="dashboard" onNavigate={() => {}} onBack={onBack}>
      <h1 className="font-serif text-3xl font-bold text-sand mb-8">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-ink-2/50 border border-brass/15 rounded-xl p-6">
            <p className="text-sm text-sand-dim mb-2">{card.label}</p>
            <p className={`text-3xl font-bold font-serif ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-ink-2/50 border border-brass/15 rounded-xl p-6">
          <h3 className="font-serif text-xl font-bold text-sand mb-4">أحدث الأخبار</h3>
          {recentNews.length === 0 ? (
            <p className="text-sand-dim text-sm">لا توجد أخبار بعد</p>
          ) : (
            <ul className="space-y-3">
              {recentNews.map((item) => (
                <li key={item.id} className="text-sm text-sand-dim border-b border-brass/10 pb-2">
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-ink-2/50 border border-brass/15 rounded-xl p-6">
          <h3 className="font-serif text-xl font-bold text-sand mb-4">آخر الصور المضافة</h3>
          {recentGallery.length === 0 ? (
            <p className="text-sand-dim text-sm">لا توجد صور بعد</p>
          ) : (
            <ul className="space-y-3">
              {recentGallery.map((item) => (
                <li key={item.id} className="text-sm text-sand-dim border-b border-brass/10 pb-2">
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
