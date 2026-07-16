import type { User } from '@supabase/supabase-js';

export interface VisitorProfile {
  name: string;
  email: string;
  avatarUrl: string;
  provider: string;
}

const readText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

export const getVisitorProfile = (user: User | null): VisitorProfile | null => {
  if (!user) return null;

  const metadata = user.user_metadata ?? {};
  const appMetadata = user.app_metadata ?? {};

  return {
    name: readText(metadata.full_name) || readText(metadata.name),
    email: user.email ?? '',
    avatarUrl: readText(metadata.avatar_url) || readText(metadata.picture),
    provider: readText(appMetadata.provider),
  };
};

export const isOfficialGoogleProfile = (profile: VisitorProfile | null): boolean =>
  profile?.provider === 'google' && profile.name.length > 0;
