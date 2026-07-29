import { TreeNode } from './LineageTree.types';

const OTAIBAH_BRANCHES_SOURCE =
  'مثيب محمد العتيبي، قبيلة عتيبة الهيلا من هوازن، الطبعة السادسة، ص79';
const AL_HAILA_FORUM_SOURCE =
  'منتدى الهيلا — «فروع السياحين»، الموضوع 22375 (نسخة مؤرشفة)';

const createForumChildren = (
  parentId: string,
  children: ReadonlyArray<readonly [id: string, name: string]>,
  reliability: 1 | 2 | 3,
  note: string,
): TreeNode[] =>
  children.map(([id, name]) => ({
    id,
    name,
    parent_id: parentId,
    level: 2,
    source: AL_HAILA_FORUM_SOURCE,
    reliability,
    note,
  }));

export const LINEAGE_DATA: TreeNode[] = [
  {
    id: 'siyahin',
    name: 'قبيلة السياحين',
    parent_id: null,
    level: 0,
    source:
      'ماكس فون أوبنهايم، البدو، ج3، ص140-145؛ حمد الجاسر، معجم قبائل المملكة العربية السعودية، ص377',
    reliability: 1,
    note: 'السياحين من المزاحمة من الروقة من عتيبة.',
  },
  {
    id: 'farahin',
    name: 'الفراحين',
    parent_id: 'siyahin',
    level: 1,
    source: OTAIBAH_BRANCHES_SOURCE,
    reliability: 1,
    note: 'من الفروع الخمسة المذكورة للسياحين في المصدر.',
  },
  {
    id: 'khookhan',
    name: 'الخوخان',
    parent_id: 'siyahin',
    level: 1,
    source: OTAIBAH_BRANCHES_SOURCE,
    reliability: 1,
    note: 'من الفروع الخمسة المذكورة للسياحين في المصدر.',
  },
  {
    id: 'khair_branch',
    name: 'ذوي خير',
    parent_id: 'siyahin',
    level: 1,
    source: AL_HAILA_FORUM_SOURCE,
    reliability: 3,
    note: 'اعتمد في القائمة المصححة فرعًا مستقلًا عن الخوخان؛ يحتاج إلى مصدر مستقل.',
  },
  {
    id: 'juhaim_branch',
    name: 'ذوي جهيم',
    parent_id: 'siyahin',
    level: 1,
    source: AL_HAILA_FORUM_SOURCE,
    reliability: 3,
    note: 'اعتمد في القائمة المصححة فرعًا مستقلًا، ولم يرد تفصيل لفروعه التابعة.',
  },
  {
    id: 'sawadin_branch',
    name: 'السوادين',
    parent_id: 'siyahin',
    level: 1,
    source: AL_HAILA_FORUM_SOURCE,
    reliability: 3,
    note: 'اعتمد في القائمة المصححة فرعًا مستقلًا؛ يحتاج إلى مصدر مستقل.',
  },
  {
    id: 'rawazin_branch',
    name: 'الروازين',
    parent_id: 'siyahin',
    level: 1,
    source: AL_HAILA_FORUM_SOURCE,
    reliability: 3,
    note: 'اعتمد في القائمة المصححة فرعًا مستقلًا؛ يحتاج إلى مصدر مستقل.',
  },
  {
    id: 'mashawtah',
    name: 'المشاوطة',
    parent_id: 'siyahin',
    level: 1,
    source: AL_HAILA_FORUM_SOURCE,
    reliability: 3,
    note: 'اعتمد في القائمة المصححة فرعًا مستقلًا؛ يحتاج إلى مصدر مستقل.',
  },
  {
    id: 'qaabah',
    name: 'القعبة',
    parent_id: 'siyahin',
    level: 1,
    source: AL_HAILA_FORUM_SOURCE,
    reliability: 3,
    note: 'اعتمد فرعًا مستقلًا وحل محل الزواريط في القائمة المصححة.',
  },
  {
    id: 'ali_branch',
    name: 'ذوي علي',
    parent_id: 'siyahin',
    level: 1,
    source: OTAIBAH_BRANCHES_SOURCE,
    reliability: 1,
    note: 'من الفروع الخمسة المذكورة للسياحين في المصدر.',
  },
  {
    id: 'mazankah',
    name: 'المزانكة',
    parent_id: 'siyahin',
    level: 1,
    source: OTAIBAH_BRANCHES_SOURCE,
    reliability: 1,
    note: 'من الفروع الخمسة المذكورة للسياحين في المصدر.',
  },
  {
    id: 'dhu_zumaim',
    name: 'ذوي زميم { الزمايمة }',
    parent_id: 'siyahin',
    level: 1,
    source: AL_HAILA_FORUM_SOURCE,
    reliability: 1,
    note:
      'ورد اسم الزمايمة في منتدى الهيلا، واعتمد مالك الموقع تحريرياً أنهم ذوي زميم؛ ووسم «موثق» هنا يعبّر عن اعتماد القائمة.',
  },
  {
    id: 'dalabsah',
    name: 'الدلابسة',
    parent_id: 'siyahin',
    level: 1,
    source: AL_HAILA_FORUM_SOURCE,
    reliability: 3,
    note: 'اعتمد في القائمة المصححة فرعًا مستقلًا، ولم يرد تفصيل لفروعه التابعة.',
  },
  ...createForumChildren(
    'farahin',
    [
      ['farahin_jabr', 'ذوي جبر'],
      ['farahin_hamdi', 'ذوي حمدي'],
      ['farahin_saif', 'ذوي سيف'],
    ],
    3,
    'اعتمد الاسم ضمن الفراحين في القائمة المصححة؛ لم يؤيد بمصدر مستقل.',
  ),
  ...createForumChildren(
    'khookhan',
    [
      ['khookhan_maqanidah', 'المقاندة'],
      ['khookhan_balaain', 'البلاعين'],
      ['khookhan_mutlaq', 'ذوي مطلق'],
    ],
    3,
    'اعتمد الاسم ضمن الخوخان في القائمة المصححة؛ لم يؤيد بمصدر مستقل.',
  ),
  ...createForumChildren(
    'khair_branch',
    [
      ['khair_hajid', 'ذوي هاجد'],
      ['khair_bajid', 'ذوي باجد'],
    ],
    3,
    'اعتمد الاسم ضمن ذوي خير في القائمة المصححة؛ لم يؤيد بمصدر مستقل.',
  ),
  ...createForumChildren(
    'ali_branch',
    [
      ['ali_samarin', 'السمارين'],
      ['ali_suraidih', 'آل صريديح'],
      ['ali_salman', 'آل سلمان'],
      ['ali_hanatrah', 'الحناترة'],
      ['ali_hawawiyah', 'الهواوية'],
    ],
    3,
    'اعتمد الاسم ضمن ذوي علي في القائمة المصححة؛ لم يؤيد بمصدر مستقل.',
  ),
  ...createForumChildren(
    'mazankah',
    [
      ['mazankah_hamad', 'ذوي حمد'],
      ['mazankah_hammad', 'ذوي حماد'],
    ],
    3,
    'اعتمد الاسم ضمن المزانكة في القائمة المصححة؛ لم يؤيد بمصدر مستقل.',
  ),
  ...createForumChildren(
    'dhu_zumaim',
    [
      ['dhu_zumaim_musailim', 'ذوي مسيلم { بيت المشيخة }'],
      ['dhu_zumaim_muslim', 'ذوي مسلم'],
      ['dhu_zumaim_uwaishiz', 'ذوي عويشز'],
    ],
    1,
    'من فروع ذوي زميم { الزمايمة } الموثقة والمؤكدة في القائمة المعتمدة.',
  ),
];
