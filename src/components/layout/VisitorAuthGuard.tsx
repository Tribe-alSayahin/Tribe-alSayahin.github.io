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

    const handleSession = async () => {
      const hasOAuthHash = window.location.hash.includes('access_token') ||
                           window.location.hash.includes('refresh_token');

      if (hasOAuthHash) {
        setLoading(true);
      }

      const { data: { session: s } } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (s) {
        setSession(s);
        setLoading(false);
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        return;
      }

      if (hasOAuthHash) {
        let checkCount = 0;
        const checkInterval = setInterval(async () => {
          if (!isMounted) {
            clearInterval(checkInterval);
            return;
          }
          checkCount++;
          const { data: { session: s2 } } = await supabase.auth.getSession();
          if (s2) {
            if (isMounted) {
              setSession(s2);
              setLoading(false);
            }
            clearInterval(checkInterval);
            if (window.location.hash) {
              window.history.replaceState(null, '', window.location.pathname);
            }
            return;
          }
          if (checkCount > 30) {
            clearInterval(checkInterval);
            if (isMounted) setLoading(false);
          }
        }, 200);

        return;
      }

      if (isMounted) setLoading(false);
    };

    handleSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        if (!isMounted) return;
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
