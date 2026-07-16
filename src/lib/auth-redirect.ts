export const getCurrentOrigin = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
};

export const getCleanCurrentUrl = (): string => {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.hash = '';
  return url.toString();
};

export const getAdminRedirectUrl = (): string => {
  const origin = getCurrentOrigin();
  return origin ? `${origin}/admin/` : '/admin/';
};

export const hasAuthCallbackParams = (): boolean => {
  if (typeof window === 'undefined') return false;
  const url = new URL(window.location.href);
  return (
    url.searchParams.has('code') ||
    url.searchParams.has('access_token') ||
    url.searchParams.has('refresh_token') ||
    url.hash.includes('access_token') ||
    url.hash.includes('refresh_token')
  );
};

export const clearAuthCallbackParams = (): void => {
  if (typeof window === 'undefined' || !hasAuthCallbackParams()) return;

  const url = new URL(window.location.href);
  url.hash = '';
  url.searchParams.delete('code');
  url.searchParams.delete('access_token');
  url.searchParams.delete('refresh_token');
  url.searchParams.delete('expires_in');
  url.searchParams.delete('expires_at');
  url.searchParams.delete('provider_token');
  url.searchParams.delete('provider_refresh_token');
  url.searchParams.delete('token_type');
  window.history.replaceState(null, '', `${url.pathname}${url.search}`);
};
