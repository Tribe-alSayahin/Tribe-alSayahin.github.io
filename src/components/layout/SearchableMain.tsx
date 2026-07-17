'use client';

import { usePathname } from 'next/navigation';

export function SearchableMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrivateSurface = pathname?.startsWith('/admin') || pathname?.startsWith('/preview');

  if (isPrivateSurface) {
    return (
      <main id="main-content" className="relative" data-pagefind-ignore="all">
        {children}
      </main>
    );
  }

  return (
    <main id="main-content" className="relative" data-pagefind-body="true">
      {children}
    </main>
  );
}
