'use client';

import { useEffect, useState } from 'react';
import {
  Newspaper,
  Calendar,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Eye,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { fetchAdminPosts, type AdminPostRecord } from '../../lib/admin-posts';
import { fetchAdminUsers } from '../../lib/admin-users';
import { fetchAllComments, type Comment } from '../../lib/comments';
import { fetchMedia } from '../../lib/media';
import { fetchUniqueVisitors, fetchEventCounts } from '../../lib/analytics';

interface DashboardOverviewProps {
  onTabChange: (tab: 'posts' | 'comments' | 'users' | 'media' | 'analytics') => void;
}

interface Stats {
  posts: number;
  events: number;
  users: number;
  pendingComments: number;
  media: number;
  visitors: number;
  totalEvents: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  onClick,
  tone = 'brass',
}: {
  icon: typeof Newspaper;
  label: string;
  value: number | string;
  onClick?: () => void;
  tone?: 'brass' | 'emerald' | 'copper' | 'sunset';
}) {
  const toneClasses = {
    brass: 'border-brass/20 bg-brass/5 text-brass-lt',
    emerald: 'border-emerald/20 bg-emerald/5 text-emerald-lt',
    copper: 'border-copper/20 bg-copper/5 text-copper-lt',
    sunset: 'border-sunset/20 bg-sunset/5 text-sunset-lt',
  };

  return (
    <motion.button
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`text-right rounded-2xl border p-5 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-elev-2' : ''
      } ${toneClasses[tone]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-kufi text-sm opacity-90">{label}</span>
        <Icon className="w-5 h-5 opacity-80" aria-hidden="true" />
      </div>
      <p className="font-ruqaa text-3xl text-sand">{value}</p>
    </motion.button>
  );
}

export function DashboardOverview({ onTabChange }: DashboardOverviewProps) {
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    events: 0,
    users: 0,
    pendingComments: 0,
    media: 0,
    visitors: 0,
    totalEvents: 0,
  });
  const [recentPosts, setRecentPosts] = useState<AdminPostRecord[]>([]);
  const [pendingCommentsList, setPendingCommentsList] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const [postsResult, usersResult, commentsResult, mediaResult, visitorsResult, eventsResult] =
        await Promise.all([
          fetchAdminPosts(),
          fetchAdminUsers(),
          fetchAllComments(),
          fetchMedia(),
          fetchUniqueVisitors(30),
          fetchEventCounts(),
        ]);

      const posts = postsResult.data ?? [];
      const users = usersResult.data ?? [];
      const comments = commentsResult.data ?? [];
      const media = mediaResult.data ?? [];
      const visitors = visitorsResult.data ?? 0;
      const eventCounts = eventsResult.data ?? {};

      setStats({
        posts: posts.filter((p) => p.kind === 'news').length,
        events: posts.filter((p) => p.kind === 'event').length,
        users: users.length,
        pendingComments: comments.filter((c) => c.status === 'pending').length,
        media: media.length,
        visitors,
        totalEvents: Object.values(eventCounts).reduce((a, b) => a + b, 0),
      });

      setRecentPosts(posts.slice(0, 5));
      setPendingCommentsList(comments.filter((c) => c.status === 'pending').slice(0, 3));
      setIsLoading(false);
    };

    void load();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-8 text-center">
        <p className="font-kufi text-sm text-sand-dim">جارٍ تحميل لوحة النظرة العامة...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Newspaper}
          label="الأخبار"
          value={stats.posts}
          onClick={() => onTabChange('posts')}
        />
        <StatCard
          icon={Calendar}
          label="المناسبات"
          value={stats.events}
          onClick={() => onTabChange('posts')}
          tone="emerald"
        />
        <StatCard
          icon={Users}
          label="المستخدمين"
          value={stats.users}
          onClick={() => onTabChange('users')}
        />
        <StatCard
          icon={MessageSquare}
          label="تعليقات قيد المراجعة"
          value={stats.pendingComments}
          onClick={() => onTabChange('comments')}
          tone="copper"
        />
        <StatCard
          icon={ImageIcon}
          label="ملفات الوسائط"
          value={stats.media}
          onClick={() => onTabChange('media')}
          tone="sunset"
        />
        <StatCard
          icon={Eye}
          label="زوار 30 يوم"
          value={stats.visitors}
          onClick={() => onTabChange('analytics')}
          tone="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-ruqaa text-xl text-sand">آخر المنشورات</h3>
            <button
              onClick={() => onTabChange('posts')}
              className="text-xs font-kufi text-brass-lt hover:text-brass transition-colors"
            >
              عرض الكل
            </button>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-sand-dim">لا توجد منشورات حالياً.</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-brass/10 bg-ink/50"
                >
                  <div>
                    <p className="font-serif text-sm text-sand">{post.title}</p>
                    <p className="text-xs text-sand-dim mt-1">
                      {post.kind === 'event' ? 'مناسبة' : 'خبر'} • {new Date(post.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-ruqaa text-xl text-sand">تحتاج مراجعة</h3>
            <button
              onClick={() => onTabChange('comments')}
              className="text-xs font-kufi text-brass-lt hover:text-brass transition-colors"
            >
              عرض الكل
            </button>
          </div>
          {pendingCommentsList.length === 0 ? (
            <p className="text-sm text-sand-dim">لا توجد تعليقات قيد المراجعة.</p>
          ) : (
            <div className="space-y-3">
              {pendingCommentsList.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-copper/10 bg-copper/5"
                >
                  <AlertCircle className="w-4 h-4 text-copper-lt shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-serif text-sm text-sand">{comment.author_name || 'مستخدم مجهول'}</p>
                    <p className="text-xs text-sand-dim mt-1 line-clamp-2">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-brass-lt" aria-hidden="true" />
          <h3 className="font-ruqaa text-xl text-sand">ملخص النشاط</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl border border-brass/10 bg-ink/50">
            <p className="font-ruqaa text-2xl text-sand">{stats.totalEvents}</p>
            <p className="text-xs font-kufi text-sand-dim">إجمالي الأحداث</p>
          </div>
          <div className="text-center p-4 rounded-xl border border-brass/10 bg-ink/50">
            <p className="font-ruqaa text-2xl text-sand">{stats.posts + stats.events}</p>
            <p className="text-xs font-kufi text-sand-dim">إجمالي المنشورات</p>
          </div>
          <div className="text-center p-4 rounded-xl border border-brass/10 bg-ink/50">
            <p className="font-ruqaa text-2xl text-sand">{stats.visitors}</p>
            <p className="text-xs font-kufi text-sand-dim">زيارات فريدة</p>
          </div>
        </div>
      </div>
    </div>
  );
}
