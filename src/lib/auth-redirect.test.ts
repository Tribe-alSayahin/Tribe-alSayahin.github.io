import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearAuthCallbackParams,
  getAdminRedirectUrl,
  getAuthCallbackCode,
  getCleanCurrentUrl,
  hasAuthCallbackParams,
} from './auth-redirect';

describe('auth callback URL handling', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
    vi.restoreAllMocks();
  });

  it('detects PKCE callback codes and builds the same-origin admin redirect', () => {
    window.history.replaceState(null, '', '/admin/?code=secure-code');

    expect(hasAuthCallbackParams()).toBe(true);
    expect(getAuthCallbackCode()).toBe('secure-code');
    expect(getAdminRedirectUrl()).toBe(`${window.location.origin}/admin/`);
  });

  it('detects token callbacks in the URL fragment without exposing them in the clean URL', () => {
    window.history.replaceState(null, '', '/admin/#access_token=secret&refresh_token=refresh');

    expect(hasAuthCallbackParams()).toBe(true);
    expect(getCleanCurrentUrl()).toBe(`${window.location.origin}/admin/`);
  });

  it('removes auth secrets while preserving unrelated query parameters', () => {
    window.history.replaceState(null, '', '/admin/?source=email&code=secret#access_token=token');

    clearAuthCallbackParams();

    expect(window.location.pathname).toBe('/admin/');
    expect(window.location.search).toBe('?source=email');
    expect(window.location.hash).toBe('');
    expect(hasAuthCallbackParams()).toBe(false);
  });
});
