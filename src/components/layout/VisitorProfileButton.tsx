'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { LogIn, LogOut, UserCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCleanCurrentUrl } from '../../lib/auth-redirect';
import { getVisitorProfile } from '../../lib/visitor-profile';
import {
  formatVisitorDate,
  syncCurrentVisitorProfile,
  type StoredVisitorProfile,
} from '../../lib/visitor-directory';
import { Modal } from '../ui/Modal';

const PRESENCE_INTERVAL_MS = 60_000;

export function VisitorProfileButton() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StoredVisitorProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const updatePresence = useCallback(async () => {
    const result = await syncCurrentVisitorProfile();
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setProfile(result.data);
    setError('');
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setIsLoading(false);
      if (data.session) void updatePresence();
    };

    void initialize();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setIsLoading(false);
      if (nextSession) {
        void updatePresence();
      } else {
        setProfile(null);
        setIsOpen(false);
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [updatePresence]);

  useEffect(() => {
    if (!session) return;

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') void updatePresence();
    }, PRESENCE_INTERVAL_MS);
    const handleVisibleActivity = () => {
      if (document.visibilityState === 'visible') void updatePresence();
    };

    window.addEventListener('focus', handleVisibleActivity);
    document.addEventListener('visibilitychange', handleVisibleActivity);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', handleVisibleActivity);
      document.removeEventListener('visibilitychange', handleVisibleActivity);
    };
  }, [session, updatePresence]);

  const handleButtonClick = async () => {
    if (session) {
      setIsOpen(true);
      void updatePresence();
      return;
    }

    setError('');
    setIsLoading(true);
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getCleanCurrentUrl() },
    });
    if (signInError) {
      setError(signInError.message || 'تعذر تسجيل الدخول بحساب Google');
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return;
    }
    setProfile(null);
    setSession(null);
    setIsOpen(false);
  };

  const authProfile = getVisitorProfile(session?.user ?? null);
  const displayName = profile?.fullName || authProfile?.name || 'مستخدم مسجل';
  const avatarUrl = profile?.avatarUrl || authProfile?.avatarUrl || '';

  return (
    <>
      <button
        type="button"
        onClick={() => void handleButtonClick()}
        disabled={isLoading}
        className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brass/20 text-brass-lt transition-colors hover:border-brass/45 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass disabled:opacity-50"
        aria-label={session ? 'فتح ملفي الشخصي' : 'تسجيل الدخول بحساب Google'}
        title={session ? 'ملفي الشخصي' : 'تسجيل الدخول'}
      >
        {session && avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : session ? (
          <UserCircle className="h-5 w-5" aria-hidden="true" />
        ) : (
          <LogIn className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="ملفي الشخصي" size="sm">
        <div className="space-y-5">
          <div className="flex items-center gap-4 rounded-xl border border-brass/15 bg-ink/45 p-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-16 w-16 shrink-0 rounded-full border border-brass/25 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserCircle className="h-16 w-16 shrink-0 text-brass-lt" aria-hidden="true" />
            )}
            <div className="min-w-0">
              <p className="font-serif text-xl text-sand">{displayName}</p>
              <p className="mt-1 break-all text-xs text-sand-dim" dir="ltr">
                {profile?.email || session?.user.email || 'لا يوجد بريد ظاهر'}
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-kufi text-emerald-lt">
                <span className="h-2 w-2 rounded-full bg-emerald" aria-hidden="true" />
                متواجد الآن
              </span>
            </div>
          </div>

          <dl className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-4 border-b border-brass/10 pb-3">
              <dt className="font-kufi text-sand-dim">طريقة الدخول</dt>
              <dd className="text-sand">{profile?.provider === 'google' ? 'حساب Google' : 'حساب مسجل'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="font-kufi text-sand-dim">تاريخ الانضمام</dt>
              <dd className="text-left text-sand">
                {formatVisitorDate(profile?.createdAt || session?.user.created_at || '')}
              </dd>
            </div>
          </dl>

          {error && <p className="text-xs font-kufi text-copper" role="alert">{error}</p>}

          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-copper/35 px-4 py-2.5 text-sm font-kufi text-copper-lt transition-colors hover:bg-copper/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            تسجيل الخروج
          </button>
        </div>
      </Modal>

      {!session && error && (
        <span className="sr-only" role="alert">{error}</span>
      )}
    </>
  );
}
