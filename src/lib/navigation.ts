export interface NavLinkItem {
  id: string;
  label: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'jathum', label: 'الجثوم' },
  { id: 'lineage', label: 'النسب' },
  { id: 'map', label: 'الديار' },
  { id: 'gallery', label: 'التراث' },
  { id: 'wasm', label: 'الوسم' },
  { id: 'constellation', label: 'الأنساب' },
  { id: 'archive', label: 'الأرشيف' },
  { id: 'poetry', label: 'الشعر' },
  { id: 'news', label: 'الأخبار' },
  { id: 'admin', label: 'الإدارة' },
  { id: 'timeline', label: 'التاريخ' },
  { id: 'supporters', label: 'الداعمين' },
  { id: 'contact', label: 'تواصل' },
];
