import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  getAvatarExtension,
  validateAvatarFile,
  validateVisitorName,
} from './visitor-profile-editor';

describe('visitor profile editor validation', () => {
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
});
