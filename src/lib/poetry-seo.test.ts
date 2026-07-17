import { describe, expect, it } from 'vitest';
import type { PoetryEntry } from './poetry-types';
import { buildPoetryDescription, splitPoetryLines } from './poetry-seo';

const entry: PoetryEntry = {
  id: 'poem-1',
  title: 'قصيدة الاختبار',
  poet_name: 'شاعر السياحين',
  story: 'قصة موثقة تحكي مناسبة القصيدة وتضع أبياتها في سياقها التاريخي الصحيح.',
  poem_text: 'البيت الأول\n\nالبيت الثاني',
  source: 'مصدر موثق',
  status: 'published',
  created_at: '2026-07-17T00:00:00.000Z',
  updated_at: '2026-07-17T00:00:00.000Z',
  created_by: null,
};

describe('poetry SEO helpers', () => {
  it('builds a concise description with the title and poet', () => {
    const description = buildPoetryDescription(entry);

    expect(description).toContain(entry.title);
    expect(description).toContain(entry.poet_name);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it('removes blank poem lines while preserving their order', () => {
    expect(splitPoetryLines(entry.poem_text)).toEqual(['البيت الأول', 'البيت الثاني']);
  });
});
