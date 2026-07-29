import { TreeNode } from './LineageTree.types';

const OTAIBAH_BRANCHES_SOURCE =
  'مثيب محمد العتيبي، قبيلة عتيبة الهيلا من هوازن، الطبعة السادسة، ص79';
const AL_HAILA_FORUM_SOURCE =
  'منتدى الهيلا — «فروع السياحين»، يوسف السيحاني، 5 أبريل 2006، الموضوع 22375 (نسخة مؤرشفة)';

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
    id: 'dhu_zumaim',
    name: 'ذوي زميم',
    parent_id: 'siyahin',
    level: 1,
    source: OTAIBAH_BRANCHES_SOURCE,
    reliability: 1,
    note: 'ورد الاسم بهذه الصيغة في المصدر المصوّر.',
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
    id: 'ali_branch',
    name: 'ذوي علي',
    parent_id: 'siyahin',
    level: 1,
    source: OTAIBAH_BRANCHES_SOURCE,
    reliability: 1,
    note: 'من الفروع الخمسة المذكورة للسياحين في المصدر.',
  },
  {
    id: 'mashawtah',
    name: 'المشاوطة',
    parent_id: 'siyahin',
    level: 1,
    source: AL_HAILA_FORUM_SOURCE,
    reliability: 3,
    note:
      'ورد الاسم في مشاركة منتدى وصف كاتبها تقسيمه بأنه تقريبي، واعترض رد لاحق على بعض التفاصيل؛ يحتاج إلى مصدر مستقل.',
  },
  {
    id: 'dalabsah',
    name: 'الدلابسة',
    parent_id: 'siyahin',
    level: 1,
    source: AL_HAILA_FORUM_SOURCE,
    reliability: 3,
    note:
      'ورد الاسم مجردًا في مشاركة المنتدى من غير تفصيل أو إسناد مستقل؛ لذلك يعرض بوصفه غير مؤكد.',
  },
];
