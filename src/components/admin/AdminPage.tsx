'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';

import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { clearAuthCallbackParams, getAdminRedirectUrl, hasAuthCallbackParams } from '../../lib/auth-redirect';
import { setSeoMeta } from '../../lib/seo';
import { logAdminAction } from '../../lib/admin-logs';
import { fetchCurrentUserRole, type UserRole } from '../../lib/admin-users';
import { getAllowedAdminTabs, isAdminPanelRole, isAdminTabAllowed, type AdminTab } from '../../lib/admin-access';
import { AdminSidebar } from './AdminSidebar';
import { DashboardOverview } from './DashboardOverview';
import { PostManager } from './PostManager';
import { UserManagement } from './UserManagement';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { MediaManager } from './MediaManager';
import { CommentManager } from './CommentManager';
import { ActivityLog } from './ActivityLog';
import { ThanksLetterGenerator } from './ThanksLetterGenerator';
import { EventManager } from './EventManager';
import { ToastContainer, type Toast } from './Toast';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [roleError, setRoleError] = useState('');
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
    const isAuthCallback = hasAuthCallbackParams();
    let fallbackTimer: number | undefined;

    const finishAuth = (nextSession: Session | null) => {
      if (!mounted) return;
      setSession(nextSession);
      setIsAuthLoading(false);
      clearAuthCallbackParams();
    };

    const init = async () => {
      if (!isSupabaseConfigured()) {
        setAuthError('إعداد Supabase غير مكتمل في متغيرات البيئة.');
        setIsAuthLoading(false);
        return;
      }

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (currentSession || !isAuthCallback) {
        finishAuth(currentSession);
      }
    };

    void init();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      finishAuth(nextSession);
    });

    if (isAuthCallback) {
      fallbackTimer = window.setTimeout(() => finishAuth(null), 5000);
    }

    return () => {
      mounted = false;
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setSeoMeta('لوحة الإدارة | الموقع الرسمي لقبيلة السياحين', 'noindex, nofollow');
  }, []);

  useEffect(() => {
    const loadRole = async () => {
      if (!session?.user?.id) {
        setCurrentRole(null);
        setRoleError('');
        return;
      }

      setIsRoleLoading(true);
      const result = await fetchCurrentUserRole();
      if (result.error) {
        setCurrentRole(null);
        setRoleError(result.error.message);
        setIsRoleLoading(false);
        return;
      }

      setCurrentRole(result.data?.role ?? null);
      setRoleError('');
      setIsRoleLoading(false);
    };

    void loadRole();
  }, [session?.user?.id]);

  useEffect(() => {
    if (isAdminTabAllowed(currentRole, activeTab)) {
      return;
    }

    const [fallbackTab] = getAllowedAdminTabs(currentRole);
    if (fallbackTab) {
      setActiveTab(fallbackTab);
    }
  }, [activeTab, currentRole]);

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

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setIsGoogleSubmitting(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAdminRedirectUrl(),
      },
    });

    if (error) {
      setAuthError(error.message || 'خطأ في تسجيل الدخول عبر Google');
      setIsGoogleSubmitting(false);
    }
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
    setCurrentRole(null);
    setRoleError('');
    setIsRoleLoading(false);
    setActiveTab('dashboard');
  };

  const canManage = isAdminPanelRole(currentRole);
  const canManageEvents = canManage;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onTabChange={setActiveTab} />;
      case 'posts':
        return <PostManager onNotify={addToast} />;
      case 'events':
        return <EventManager onNotify={addToast} canManage={canManageEvents} userId={session?.user?.id ?? null} />;
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
      case 'thanks-letter':
        return <ThanksLetterGenerator />;
      default:
        return <DashboardOverview onTabChange={setActiveTab} />;
    }
  };

  if (isAuthLoading || (session?.user && isRoleLoading)) {
    return (
      <div data-app-ready="true" className="min-h-screen bg-ink text-sand font-sans flex items-center justify-center p-8">
        <p className="font-kufi text-sand-dim">جارٍ التحقق من صلاحيات لوحة الإدارة...</p>
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

        {!session?.user ? (
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
                disabled={isSubmitting || isGoogleSubmitting}
                className="rounded-lg bg-brass/20 border border-brass/35 px-4 py-2.5 text-base font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
              >
                {isSubmitting ? 'جارٍ تسجيل الدخول...' : 'دخول'}
              </button>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-brass/15" />
                <span className="text-xs text-sand-dim font-kufi">أو</span>
                <div className="h-px flex-1 bg-brass/15" />
              </div>
              <button
                type="button"
                onClick={() => void handleGoogleSignIn()}
                disabled={isSubmitting || isGoogleSubmitting}
                className="rounded-lg border border-brass/25 bg-sand px-4 py-2.5 text-sm font-kufi font-semibold text-ink hover:bg-sand/90 transition-colors disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
              >
                {isGoogleSubmitting ? 'جارٍ التوجيه...' : 'الدخول بحساب Google'}
              </button>
              {authError && (
                <p className="text-xs font-kufi text-copper">{authError}</p>
              )}
            </form>
          </section>
        ) : !canManage ? (
          <section className="max-w-2xl mx-auto rounded-2xl border border-copper/25 bg-ink-2/60 p-6 text-center space-y-4">
            <h2 className="font-kufi text-xl text-copper-lt">تعذر فتح لوحة الإدارة</h2>
            <p className="text-sm text-sand-dim">
              {roleError || 'هذا الحساب لا يملك صلاحية الدخول إلى لوحة الإدارة. يرجى مراجعة المشرف العام لمنحك دوراً إدارياً صحيحاً.'}
            </p>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="rounded-lg border border-copper/35 px-4 py-2 text-sm font-kufi text-copper-lt hover:bg-copper/10 transition-colors focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
            >
              تسجيل الخروج
            </button>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-3">
              <AdminSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                currentRole={currentRole}
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
