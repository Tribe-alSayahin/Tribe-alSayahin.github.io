'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

/** يخفي الفوتر على صفحات /preview/* لإتاحة معاينة فواتير بديلة */
export function FooterWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith('/preview')) return null;
  return <Footer />;
}
