'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { VisitorLogin } from './VisitorLogin';
import { clearAuthCallbackParams, hasAuthCallbackParams } from '../../lib/auth-redirect';

export function VisitorAuthGuard({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setConfigured(false);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const isAuthCallback = hasAuthCallbackParams();
    let fallbackTimer: number | undefined;

    const finish = (s: object | null) => {
      if (!isMounted) return;
      setSession(s);
      setLoading(false);
      clearAuthCallbackParams();
    };

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s || !isAuthCallback) {
        finish(s);
      }
    }).catch(() => {
      finish(null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        finish(s);
      },
    );

    if (isAuthCallback) {
      fallbackTimer = window.setTimeout(() => finish(null), 5000);
    }

    return () => {
      isMounted = false;
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, []);

  if (!configured) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="text-sand-dim font-sans text-sm">جارٍ التحقق...</div>
      </div>
    );
  }

  if (!session) {
    return <VisitorLogin />;
  }

  return <>{children}</>;
}
