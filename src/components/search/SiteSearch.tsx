'use client';

import { useEffect, useRef, useState } from 'react';

interface PagefindUIInstance {
  destroy?: () => void;
}

interface PagefindUIOptions {
  element: string;
  showImages?: boolean;
  showSubResults?: boolean;
  excerptLength?: number;
  autofocus?: boolean;
}

declare global {
  interface Window {
    PagefindUI?: new (options: PagefindUIOptions) => PagefindUIInstance;
  }
}

const STYLE_ID = 'pagefind-ui-style';
const SCRIPT_ID = 'pagefind-ui-script';

function addPagefindStylesheet() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = '/pagefind/pagefind-ui.css';
  document.head.appendChild(link);
}

export function SiteSearch() {
  const instanceRef = useRef<PagefindUIInstance | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const initialize = () => {
      if (cancelled || !window.PagefindUI || instanceRef.current) return;
      instanceRef.current = new window.PagefindUI({
        element: '#site-search',
        showImages: false,
        showSubResults: true,
        excerptLength: 24,
        autofocus: true,
      });
    };

    addPagefindStylesheet();

    if (window.PagefindUI) {
      initialize();
    } else {
      const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      const script = existingScript ?? document.createElement('script');
      if (!existingScript) {
        script.id = SCRIPT_ID;
        script.src = '/pagefind/pagefind-ui.js';
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener('load', initialize);
      script.addEventListener('error', () => setLoadFailed(true));
    }

    return () => {
      cancelled = true;
      instanceRef.current?.destroy?.();
      instanceRef.current = null;
    };
  }, []);

  return (
    <div className="site-search-tool" aria-live="polite">
      <div id="site-search" />
      {loadFailed && (
        <p role="alert" className="py-8 text-center font-kufi text-sm text-red-200">
          تعذر تحميل البحث الآن. يرجى تحديث الصفحة والمحاولة مرة أخرى.
        </p>
      )}
    </div>
  );
}
