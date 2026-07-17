'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  clearAuthCallbackParams,
  exchangeAuthCallbackCode,
  hasAuthCallbackParams,
} from '../../lib/auth-redirect';

export function AuthCallbackHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin') || !hasAuthCallbackParams()) return;

    void exchangeAuthCallbackCode().finally(() => {
      clearAuthCallbackParams();
    });
  }, [pathname]);

  return null;
}
