import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migration = (name: string) =>
  readFileSync(resolve(process.cwd(), 'supabase', 'migrations', name), 'utf8');

describe('Supabase security migrations', () => {
  it('keeps public news reads limited to published posts', () => {
    const baseSql = migration('20240101000000_create_admin_posts.sql');
    const securitySql = migration('20260718000000_restrict_public_posts_to_published.sql');

    expect(baseSql).toMatch(/admin_posts enable row level security/i);
    expect(securitySql).toMatch(/for select[\s\S]*status\s*=\s*'published'/i);
    expect(securitySql).not.toMatch(/using\s*\(true\)/i);
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
});
