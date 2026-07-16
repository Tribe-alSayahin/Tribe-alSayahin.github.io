import type { User } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';
import { getVisitorProfile, isOfficialGoogleProfile } from './visitor-profile';

const createUser = (overrides: Partial<User>): User => ({
  id: 'visitor-id',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'visitor@example.com',
  app_metadata: { provider: 'google' },
  user_metadata: { full_name: 'زائر موثّق' },
  created_at: '2026-07-16T00:00:00.000Z',
  ...overrides,
});

describe('visitor profile identity', () => {
  it('accepts a Google profile only when it has a personal name', () => {
    const profile = getVisitorProfile(createUser({}));

    expect(profile?.name).toBe('زائر موثّق');
    expect(isOfficialGoogleProfile(profile)).toBe(true);
  });

  it('rejects a profile from another provider', () => {
    const profile = getVisitorProfile(createUser({ app_metadata: { provider: 'email' } }));

    expect(isOfficialGoogleProfile(profile)).toBe(false);
  });

  it('does not invent a name from the email address', () => {
    const profile = getVisitorProfile(createUser({ user_metadata: {} }));

    expect(profile?.name).toBe('');
    expect(isOfficialGoogleProfile(profile)).toBe(false);
  });
});
