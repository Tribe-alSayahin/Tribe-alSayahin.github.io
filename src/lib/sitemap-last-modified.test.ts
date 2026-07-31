import { describe, expect, it } from 'vitest';
import { buildStaticLastModifiedMap } from './sitemap-last-modified';

describe('sitemap static update dates', () => {
  it('uses the latest managed section date for each parent page', () => {
    const result = buildStaticLastModifiedMap({
      sections: [
        { section_key: 'jathum', updated_at: '2026-07-20T08:00:00.000Z' },
        { section_key: 'lineage', updated_at: '2026-07-22T08:00:00.000Z' },
        { section_key: 'gallery', updated_at: '2026-07-21T08:00:00.000Z' },
      ],
      posts: [],
      events: [],
      poetry: [],
    });

    expect(result.get('/nasab/')?.toISOString()).toBe('2026-07-22T08:00:00.000Z');
    expect(result.get('/diyar/')?.toISOString()).toBe('2026-07-21T08:00:00.000Z');
  });

  it('tracks collection pages and ignores invalid dates', () => {
    const result = buildStaticLastModifiedMap({
      sections: [{ section_key: 'home', updated_at: 'not-a-date' }],
      posts: [{ updated_at: '2026-07-23T08:00:00.000Z' }],
      events: [{ updated_at: '2026-07-24T08:00:00.000Z' }],
      poetry: [{ updated_at: '2026-07-25T08:00:00.000Z' }],
    });

    expect(result.has('/')).toBe(false);
    expect(result.get('/news/')?.toISOString()).toBe('2026-07-23T08:00:00.000Z');
    expect(result.get('/events/')?.toISOString()).toBe('2026-07-24T08:00:00.000Z');
    expect(result.get('/poetry/')?.toISOString()).toBe('2026-07-25T08:00:00.000Z');
  });
});
