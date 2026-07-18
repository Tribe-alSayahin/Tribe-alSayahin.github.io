import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migration = (name: string) =>
  readFileSync(resolve(process.cwd(), 'supabase', 'migrations', name), 'utf8');

describe('Supabase security migrations', () => {
  it('can bootstrap every table required by the admin policies', () => {
    const sql = migration('20260712000000_bootstrap_admin_schema.sql');

    for (const table of ['admin_users', 'comments', 'media', 'analytics', 'admin_logs']) {
      expect(sql).toMatch(new RegExp(`create table if not exists public\\.${table}`, 'i'));
      expect(sql).toMatch(new RegExp(`alter table public\\.${table} enable row level security`, 'i'));
    }
  });

  it('keeps public news reads limited to published posts', () => {
    const baseSql = migration('20240101000000_create_admin_posts.sql');
    const securitySql = migration('20260718000000_restrict_public_posts_to_published.sql');

    expect(baseSql).toMatch(/admin_posts enable row level security/i);
    expect(securitySql).toMatch(/for select[\s\S]*status\s*=\s*'published'/i);
    expect(securitySql).not.toMatch(/using\s*\(true\)/i);
  });

  it('removes legacy write access granted to every authenticated user', () => {
    const sql = migration('20260718010000_remove_legacy_post_write_policies.sql');

    expect(sql).toContain('drop policy if exists "Authenticated can insert posts"');
    expect(sql).toContain('drop policy if exists "Authenticated can update posts"');
    expect(sql).toContain('drop policy if exists "Authenticated can delete posts"');
  });

  it('limits visitor avatar writes to the authenticated user folder', () => {
    const sql = migration('20260717010000_add_visitor_avatar_storage.sql');

    expect(sql).toContain("file_size_limit = excluded.file_size_limit");
    expect(sql).toContain("array['image/jpeg', 'image/png', 'image/webp']");
    expect(sql).toMatch(/for insert[\s\S]*to authenticated[\s\S]*storage\.foldername\(name\)\)\[1\] = auth\.uid\(\)::text/i);
    expect(sql).toMatch(/for update[\s\S]*owner_id = auth\.uid\(\)::text[\s\S]*with check/i);
    expect(sql).toMatch(/for delete[\s\S]*owner_id = auth\.uid\(\)::text/i);
  });

  it('preserves the upsert metadata read policy', () => {
    const sql = migration('20260717011000_fix_visitor_avatar_upsert_policy.sql');

    expect(sql).toMatch(/for select\s+to authenticated/i);
    expect(sql).toContain("bucket_id = 'visitor-avatars'");
    expect(sql).toContain('(storage.foldername(name))[1] = auth.uid()::text');
  });

  it('uses an unambiguous visitor profile conflict target', () => {
    const sql = migration('20260718020000_fix_sync_visitor_profile_ambiguity.sql');

    expect(sql).toContain('on conflict on constraint visitor_profiles_pkey do update');
    expect(sql).not.toContain('on conflict (user_id) do update');
  });
});
