import { useState, useEffect, useCallback, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';

import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { setSeoMeta } from '../../lib/seo';
import { logAdminAction } from '../../lib/admin-logs';
import { AdminSidebar, type AdminTab } from './AdminSidebar';
import { DashboardOverview } from './DashboardOverview';
import { PostManager } from './PostManager';
import { UserManagement } from './UserManagement';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { MediaManager } from './MediaManager';
import { CommentManager } from './CommentManager';
import { ActivityLog } from './ActivityLog';
import { ToastContainer, type Toast } from './Toast';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!isSupabaseConfigured()) {
        setAuthError('إعداد Supabase غير مكتمل في متغيرات البيئة.');
        setIsAuthLoading(false);
        return;
      }

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(currentSession);
        setIsAuthLoading(false);
      }
    };

    void init();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setSeoMeta('لوحة الإدارة | الموقع الرسمي لقبيلة السياحين', 'noindex, nofollow');
  }, []);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setEmail('');
      setPassword('');
      if (data.user) {
        void logAdminAction({
          user_id: data.user.id,
          action: 'sign_in',
          target_type: 'session',
          details: { email: data.user.email },
        });
      }
    }

    setIsSubmitting(false);
  };

  const handleSignOut = async () => {
    setAuthError('');
    if (session?.user) {
      void logAdminAction({
        user_id: session.user.id,
        action: 'sign_out',
        target_type: 'session',
      });
    }
    await supabase.auth.signOut();
    setActiveTab('dashboard');
  };

  const canManage = Boolean(session?.user);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onTabChange={setActiveTab} />;
      case 'posts':
        return <PostManager onNotify={addToast} />;
      case 'users':
        return <UserManagement onNotify={addToast} />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'media':
        return <MediaManager onNotify={addToast} />;
      case 'comments':
        return <CommentManager onNotify={addToast} />;
      case 'activity':
        return <ActivityLog />;
      default:
        return <DashboardOverview onTabChange={setActiveTab} />;
    }
  };

  if (isAuthLoading) {
    return (
      <div data-app-ready="true" className="min-h-screen bg-ink text-sand font-sans flex items-center justify-center p-8">
        <p className="font-kufi text-sand-dim">جارٍ التحقق من جلسة الدخول...</p>
      </div>
    );
  }

  return (
    <div data-app-ready="true" className="min-h-screen bg-ink text-sand font-sans p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto">
        <header className="rounded-2xl border border-brass/20 bg-ink-2/70 p-6 mb-6">
          <p className="font-kufi text-xs text-brass-lt/80 mb-2">الموقع الرسمي لقبيلة السياحين</p>
          <h1 className="font-ruqaa text-4xl md:text-5xl text-brass-lt mb-2">لوحة الإدارة الشاملة</h1>
          <p className="text-sm text-sand-dim">
            مركز إدارة محتوى الموقع الرسمي لقبيلة السياحين — الأخبار والمناسبات والمستخدمين والتعليقات والوسائط والإحصائيات.
          </p>
        </header>

        {!canManage ? (
          <section className="max-w-md mx-auto rounded-2xl border border-brass/20 bg-ink-2/60 p-6">
            <h2 className="font-kufi text-xl text-brass-lt mb-4">تسجيل دخول المشرف</h2>
            <form onSubmit={(event) => { void handleSignIn(event); }} className="grid gap-4">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="البريد الإلكتروني"
                className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50 focus-visible:ring-2 focus-visible:ring-brass"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="كلمة المرور"
                className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2.5 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50 focus-visible:ring-2 focus-visible:ring-brass"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-brass/20 border border-brass/35 px-4 py-2.5 text-base font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
              >
                {isSubmitting ? 'جارٍ تسجيل الدخول...' : 'دخول'}
              </button>
              {authError && (
                <p className="text-xs font-kufi text-copper">{authError}</p>
              )}
            </form>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-3">
              <AdminSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                userEmail={session?.user?.email}
                onSignOut={() => void handleSignOut()}
              />
            </div>
            <main className="lg:col-span-9">
              {renderContent()}
            </main>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
