'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

/** يخفي الناف على صفحات /preview/* لإتاحة معاينة تصاميم ناف بديلة */
export function NavbarWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith('/preview')) return null;
  return <Navbar />;
}
