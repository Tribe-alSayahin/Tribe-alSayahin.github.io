export interface NavSection {
  id: string;
  label: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  /** رقم الفصل (للترويسات والفواصل) */
  chapter?: number;
  /** الأقسام الفرعية ضمن الفصل (للقائمة المتنقلة) */
  sections?: NavSection[];
}

export const NAV_LINKS: NavLinkItem[] = [
  {
    id: 'jathum',
    label: 'الأصول',
    chapter: 1,
    sections: [
      { id: 'jathum', label: 'الجثوم' },
      { id: 'lineage', label: 'النسب' },
      { id: 'constellation', label: 'الأنساب' },
    ],
  },
  {
    id: 'map',
    label: 'الديار',
    chapter: 2,
    sections: [
      { id: 'map', label: 'الخريطة' },
      { id: 'gallery', label: 'التراث' },
    ],
  },
  {
    id: 'wasm',
    label: 'الهوية',
    chapter: 3,
    sections: [
      { id: 'wasm', label: 'الوسم' },
      { id: 'poetry', label: 'الشعر' },
    ],
  },
  {
    id: 'timeline',
    label: 'التاريخ',
    chapter: 4,
    sections: [
      { id: 'timeline', label: 'الخط الزمني' },
      { id: 'archive', label: 'الأرشيف' },
    ],
  },
  {
    id: 'news',
    label: 'المجتمع',
    chapter: 5,
    sections: [
      { id: 'news', label: 'الأخبار' },
      { id: 'supporters', label: 'الداعمين' },
      { id: 'contact', label: 'التواصل' },
      { id: 'admin', label: 'الإدارة' },
    ],
  },
  { id: 'contact', label: 'تواصل' },
];

export const SECTION_IDS = [
  'home',
  'jathum',
  'lineage',
  'constellation',
  'map',
  'gallery',
  'wasm',
  'poetry',
  'timeline',
  'archive',
  'news',
  'supporters',
  'contact',
  'admin',
];
