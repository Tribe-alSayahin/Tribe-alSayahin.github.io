import { describe, expect, it } from 'vitest';

import { LINEAGE_DATA } from './LineageTree.data';

describe('LINEAGE_DATA', () => {
  it('يفصل الفروع المثبتة في المصدر المصوّر عن إضافات منتدى الهيلا غير المؤكدة', () => {
    expect(LINEAGE_DATA.map(({ name }) => name)).toEqual([
      'قبيلة السياحين',
      'الفراحين',
      'الخوخان',
      'ذوي زميم',
      'المزانكة',
      'ذوي علي',
      'المشاوطة',
      'الدلابسة',
    ]);

    const branches = LINEAGE_DATA.filter(({ parent_id }) => parent_id === 'siyahin');
    expect(branches).toHaveLength(7);
    expect(
      branches
        .filter(({ reliability }) => reliability === 1)
        .map(({ name, source }) => ({ name, source })),
    ).toEqual(
      ['الفراحين', 'الخوخان', 'ذوي زميم', 'المزانكة', 'ذوي علي'].map((name) => ({
        name,
        source: 'مثيب محمد العتيبي، قبيلة عتيبة الهيلا من هوازن، الطبعة السادسة، ص79',
      })),
    );
    expect(
      branches
        .filter(({ reliability }) => reliability === 3)
        .map(({ name }) => name),
    ).toEqual(['المشاوطة', 'الدلابسة']);
    expect(
      branches
        .filter(({ reliability }) => reliability === 3)
        .every(({ source }) => source.includes('منتدى الهيلا') && source.includes('22375')),
    ).toBe(true);
    const serializedData = JSON.stringify(LINEAGE_DATA);
    expect(serializedData).not.toMatch(/الزمايم[هة]/);
    expect(serializedData).not.toContain('الجذعان');
  });
});
