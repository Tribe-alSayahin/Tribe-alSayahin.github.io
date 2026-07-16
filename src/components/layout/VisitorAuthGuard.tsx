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

    const clearHash = () => {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    const parseHashTokens = (): { access_token: string; refresh_token: string } => {
      const hash = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(hash);
      return {
        access_token: params.get('access_token') ?? '',
        refresh_token: params.get('refresh_token') ?? '',
      };
    };

    const handleSession = async () => {
      const tokens = parseHashTokens();
      const hasOAuthHash = Boolean(tokens.access_token && tokens.refresh_token);

      if (hasOAuthHash) {
        setLoading(true);
      }

      let s = (await supabase.auth.getSession()).data.session;

      if (!isMounted) return;

      if (!s && hasOAuthHash) {
        const { data, error } = await supabase.auth.setSession({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });
        if (!error) s = data.session;
      }

      if (s) {
        setSession(s);
        setLoading(false);
        clearHash();
        return;
      }

      if (hasOAuthHash) {
        let checkCount = 0;
        const checkInterval = setInterval(() => {
          if (!isMounted) {
            clearInterval(checkInterval);
            return;
          }
          checkCount++;
          void (async () => {
            const { data: { session: s2 } } = await supabase.auth.getSession();
            if (s2) {
              if (isMounted) {
                setSession(s2);
                setLoading(false);
              }
              clearInterval(checkInterval);
              clearHash();
              return;
            }
            if (checkCount > 30) {
              clearInterval(checkInterval);
              if (isMounted) setLoading(false);
            }
          })();
        }, 200);

        return;
      }

      if (isMounted) setLoading(false);
    };

    void handleSession();

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
