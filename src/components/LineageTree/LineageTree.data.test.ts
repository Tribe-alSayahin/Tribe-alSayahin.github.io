import { describe, expect, it } from 'vitest';

import { LINEAGE_DATA } from './LineageTree.data';
import { RELIABILITY_LABELS } from './LineageTree.types';
import { searchNodes } from './LineageTree.utils';

const FORUM_SOURCE = 'منتدى الهيلا — «فروع السياحين»، الموضوع 22375 (نسخة مؤرشفة)';

describe('LINEAGE_DATA', () => {
  it('يعتمد الفروع الاثني عشر بالترتيب المصحح مع فصل الموثق عن غير الموثق', () => {
    const branches = LINEAGE_DATA.filter(({ parent_id }) => parent_id === 'siyahin');

    expect(branches.map(({ name }) => name)).toEqual([
      'الفراحين',
      'الخوخان',
      'ذوي خير',
      'ذوي جهيم',
      'السوادين',
      'الروازين',
      'المشاوطة',
      'القعبة',
      'ذوي علي',
      'المزانكة',
      'ذوي زميم { الزمايمة }',
      'الدلابسة',
    ]);

    expect(branches).toHaveLength(12);
    const verifiedBranches = branches
      .filter(({ reliability }) => reliability === 1)
      .map(({ name, source }) => ({ name, source }));
    expect(verifiedBranches).toEqual([
      ...['الفراحين', 'الخوخان', 'ذوي علي', 'المزانكة'].map((name) => ({
          name,
          source:
            'مثيب محمد العتيبي، قبيلة عتيبة الهيلا من هوازن، الطبعة السادسة، ص79',
        })),
      {
        name: 'ذوي زميم { الزمايمة }',
        source: FORUM_SOURCE,
      },
    ]);
    expect(
      branches
        .filter(({ reliability }) => reliability === 3)
        .map(({ name }) => name),
    ).toEqual([
      'ذوي خير',
      'ذوي جهيم',
      'السوادين',
      'الروازين',
      'المشاوطة',
      'القعبة',
      'الدلابسة',
    ]);
    expect(
      branches
        .filter(({ reliability }) => reliability === 3)
        .every(({ source }) => source === FORUM_SOURCE),
    ).toBe(true);
    expect(searchNodes('الزمايمة', LINEAGE_DATA).map(({ id }) => id)).toEqual(['dhu_zumaim']);
    const serializedData = JSON.stringify(LINEAGE_DATA);
    expect(serializedData).not.toContain('الجذعان');
  });

  it('يعرض الفروع التابعة وفق القائمة المصححة بوسم غير موثق ومصدر صريح', () => {
    const expectedCorrectedChildren = new Map([
      ['farahin', ['ذوي جبر', 'ذوي حمدي', 'ذوي سيف']],
      ['khookhan', ['المقاندة', 'البلاعين', 'ذوي مطلق']],
      ['khair_branch', ['ذوي هاجد', 'ذوي باجد']],
      ['ali_branch', ['السمارين', 'آل صريديح', 'آل سلمان', 'الحناترة', 'الهواوية']],
      ['mazankah', ['ذوي حمد', 'ذوي حماد']],
    ]);

    for (const [parentId, names] of expectedCorrectedChildren) {
      const children = LINEAGE_DATA.filter(({ parent_id }) => parent_id === parentId);

      expect(children.map(({ name }) => name)).toEqual(names);
      expect(
        children.every(
          ({ reliability, source, note }) =>
            reliability === 3 && source === FORUM_SOURCE && note.length > 0,
        ),
      ).toBe(true);
    }

    const branchesWithoutDetails = [
      'juhaim_branch',
      'sawadin_branch',
      'rawazin_branch',
      'mashawtah',
      'qaabah',
      'dalabsah',
    ];
    expect(
      branchesWithoutDetails.every(
        (parentId) => !LINEAGE_DATA.some(({ parent_id }) => parent_id === parentId),
      ),
    ).toBe(true);

    const serializedNames = LINEAGE_DATA.map(({ name }) => name).join('،');
    expect(serializedNames).not.toMatch(
      /ذوي بركة|الزواريط|الكباشين|العراوين|ذوي جبرين|ذوي حميد|ذوي كريزي|ذوي فيد|ذوي فايد/,
    );
    expect(RELIABILITY_LABELS[3]).toBe('غير موثق');
  });

  it('يوثق الزمايمة وفروعهم بالمصدر المعتمد من منتدى الهيلا', () => {
    const dhuZumaim = LINEAGE_DATA.find(({ id }) => id === 'dhu_zumaim');
    const children = LINEAGE_DATA.filter(({ parent_id }) => parent_id === 'dhu_zumaim');

    expect(dhuZumaim).toMatchObject({
      name: 'ذوي زميم { الزمايمة }',
      reliability: 1,
      source: FORUM_SOURCE,
    });
    expect(dhuZumaim?.note).toContain('اعتمد مالك الموقع تحريرياً');
    expect(children.map(({ name }) => name)).toEqual([
      'ذوي مسيلم { بيت المشيخة }',
      'ذوي مسلم',
      'ذوي عويشز',
    ]);
    expect(
      children.every(
        ({ reliability, source }) => reliability === 1 && source === FORUM_SOURCE,
      ),
    ).toBe(true);
  });
});
