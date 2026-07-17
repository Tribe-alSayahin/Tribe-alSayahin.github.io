'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_ID_KEY = 'siyahin-analytics-session-id';
const SESSION_VISIT_KEY = 'siyahin-analytics-visit-recorded';

let lastTrackedPath = '';

const createSessionId = (): string => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const getSessionId = (): string => {
  const stored = sessionStorage.getItem(SESSION_ID_KEY);
  if (stored) return stored;

  const sessionId = createSessionId();
  sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  return sessionId;
};

export const shouldTrackAnalyticsPath = (pathname: string): boolean =>
  !pathname.startsWith('/admin') && !pathname.startsWith('/preview');

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      !pathname
      || !shouldTrackAnalyticsPath(pathname)
      || navigator.doNotTrack === '1'
      || lastTrackedPath === pathname
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      void Promise.all([
        import('../../lib/analytics'),
        import('../../lib/supabase'),
      ]).then(([{ trackEvent }, { isSupabaseConfigured }]) => {
        if (!isSupabaseConfigured() || lastTrackedPath === pathname) return;

        lastTrackedPath = pathname;
        const sessionId = getSessionId();
        const eventData = {
          path: pathname.slice(0, 256),
          title: document.title.slice(0, 160),
        };
        const events = [
          trackEvent({
            event_type: 'page_view',
            event_data: eventData,
            session_id: sessionId,
          }),
        ];

        if (!sessionStorage.getItem(SESSION_VISIT_KEY)) {
          sessionStorage.setItem(SESSION_VISIT_KEY, '1');
          events.push(trackEvent({
            event_type: 'user_visit',
            event_data: eventData,
            session_id: sessionId,
          }));
        }

        const postSlug = pathname.match(/^\/news\/([^/]+)\/?$/)?.[1];
        if (postSlug && postSlug !== 'no-posts') {
          events.push(trackEvent({
            event_type: 'post_view',
            event_data: { ...eventData, post_slug: postSlug.slice(0, 160) },
            session_id: sessionId,
          }));
        }

        void Promise.allSettled(events);
      });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
