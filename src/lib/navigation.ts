export interface NavLinkItem {
  id: string;
  label: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'lineage', label: 'النسب' },
  { id: 'map', label: 'الديار' },
  { id: 'poetry', label: 'الشعر' },
  { id: 'archive', label: 'الأرشيف' },
  { id: 'jathum', label: 'الجثوم' },
  { id: 'constellation', label: 'الأنساب' },
  { id: 'gallery', label: 'التراث' },
  { id: 'compass', label: 'الفلك' },
  { id: 'wasm', label: 'الوسم' },
  { id: 'timeline', label: 'التاريخ' },
  { id: 'supporters', label: 'الداعمين' },
  { id: 'contact', label: 'تواصل' },
];
