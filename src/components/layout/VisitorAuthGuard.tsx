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

    const hasOAuthHash = window.location.hash.includes('access_token');

    if (hasOAuthHash) {
      setLoading(true);
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s) {
        setSession(s);
        setLoading(false);
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        return;
      }

      if (hasOAuthHash) {
        const checkInterval = setInterval(() => {
          supabase.auth.getSession().then(({ data: { session: s2 } }) => {
            if (s2) {
              setSession(s2);
              setLoading(false);
              clearInterval(checkInterval);
              window.history.replaceState(null, '', window.location.pathname);
            }
          }).catch(() => {});
        }, 300);

        setTimeout(() => {
          clearInterval(checkInterval);
          setLoading(false);
        }, 10000);

        return;
      }

      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        if (s) {
          setLoading(false);
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }
      },
    );

    return () => {
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
