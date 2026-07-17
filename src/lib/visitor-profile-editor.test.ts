import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const { updateUserMock, syncCurrentVisitorProfileMock } = vi.hoisted(() => ({
  updateUserMock: vi.fn(),
  syncCurrentVisitorProfileMock: vi.fn(),
}));

vi.mock('./supabase', () => ({
  supabase: {
    auth: { updateUser: updateUserMock },
    storage: { from: vi.fn() },
  },
}));

vi.mock('./visitor-directory', () => ({
  syncCurrentVisitorProfile: syncCurrentVisitorProfileMock,
}));

import {
  getAvatarExtension,
  saveVisitorProfile,
  validateAvatarFile,
  validateVisitorName,
} from './visitor-profile-editor';

describe('visitor profile editor validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('trims a valid visitor name', () => {
    expect(validateVisitorName('  زائر السياحين  ')).toEqual({
      value: 'زائر السياحين',
      error: '',
    });
  });

  it('rejects an empty or excessively long visitor name', () => {
    expect(validateVisitorName('   ').error).toBe('اكتب اسم العرض أولاً.');
    expect(validateVisitorName('ا'.repeat(61)).error).toBe('يجب ألا يتجاوز الاسم ٦٠ حرفًا.');
  });

  it('accepts supported avatar images within the size limit', () => {
    const file = new File(['avatar'], 'avatar.webp', { type: 'image/webp' });

    expect(validateAvatarFile(file)).toBe('');
    expect(getAvatarExtension(file)).toBe('webp');
  });

  it('rejects unsupported or oversized avatar files', () => {
    const unsupported = new File(['avatar'], 'avatar.svg', { type: 'image/svg+xml' });
    const oversized = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'avatar.png', {
      type: 'image/png',
    });

    expect(validateAvatarFile(unsupported)).toBe('اختر صورة بصيغة JPG أو PNG أو WebP.');
    expect(validateAvatarFile(oversized)).toBe('يجب ألا يتجاوز حجم الصورة ٢ ميجابايت.');
  });

  it('allows authenticated visitors to select their avatar metadata for upsert uploads', () => {
    const migrationPaths = [
      'supabase/migrations/20260717010000_add_visitor_avatar_storage.sql',
      'supabase/migrations/20260717011000_fix_visitor_avatar_upsert_policy.sql',
    ];

    for (const migrationPath of migrationPaths) {
      const migration = readFileSync(resolve(migrationPath), 'utf8');
      expect(migration).toMatch(
        /create policy "Visitors can read own avatar metadata"[\s\S]*?for select[\s\S]*?bucket_id = 'visitor-avatars'[\s\S]*?storage\.foldername\(name\)\)\[1\] = auth\.uid\(\)::text/,
      );
    }
  });

  it('updates the displayed profile when auth saves but directory sync temporarily fails', async () => {
    updateUserMock.mockResolvedValue({
      data: {
        user: {
          id: 'visitor-1',
          email: 'visitor@example.com',
          created_at: '2026-07-17T12:00:00.000Z',
          app_metadata: { provider: 'google' },
          user_metadata: { full_name: 'الاسم الجديد', avatar_url: 'https://example.com/avatar.png' },
        },
      },
      error: null,
    });
    syncCurrentVisitorProfileMock.mockResolvedValue({
      data: null,
      error: { message: 'temporary rpc failure' },
    });

    const result = await saveVisitorProfile(
      'visitor-1',
      'الاسم الجديد',
      null,
      'https://example.com/avatar.png',
    );

    expect(result.error).toBe('');
    expect(result.data).toMatchObject({
      userId: 'visitor-1',
      fullName: 'الاسم الجديد',
      email: 'visitor@example.com',
      avatarUrl: 'https://example.com/avatar.png',
      provider: 'google',
    });
  });
});
