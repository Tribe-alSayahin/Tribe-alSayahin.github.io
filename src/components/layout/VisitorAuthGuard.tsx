'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { VisitorLogin } from './VisitorLogin';

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
    let settled = false;

    const finish = (s: object | null) => {
      if (!isMounted || settled) return;
      settled = true;
      setSession(s);
      setLoading(false);
      const url = new URL(window.location.href);
      if (url.hash || url.searchParams.has('code')) {
        url.hash = '';
        url.searchParams.delete('code');
        url.searchParams.delete('access_token');
        url.searchParams.delete('refresh_token');
        window.history.replaceState(null, '', url.pathname + url.search);
      }
    };

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      finish(s);
    }).catch(() => {
      finish(null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        finish(s);
      },
    );

    return () => {
      isMounted = false;
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
