import { useEffect, type ReactNode, type ReactElement } from 'react';

export default function AdminShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prev = document.querySelector('meta[name="robots"]');
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      if (prev) document.head.appendChild(prev);
      meta.remove();
    };
  }, []);

  return children as ReactElement;
}
