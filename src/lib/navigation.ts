export interface NavSection {
  id: string;
  label: string;
  href: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  /** المسار المستقل للقسم */
  href: string;
  /** رقم الفصل (للترويسات والفواصل) */
  chapter?: number;
  /** الأقسام الفرعية ضمن الفصل (للقائمة المتنقلة) */
  sections?: NavSection[];
}

export const SITE_ROUTES: NavLinkItem[] = [
  {
    id: 'nasab',
    label: 'الأصول',
    href: '/nasab/',
    chapter: 1,
    sections: [
      { id: 'jathum', label: 'الجثوم', href: '/nasab/#jathum' },
      { id: 'lineage', label: 'النسب', href: '/nasab/#lineage' },
      { id: 'constellation', label: 'الأنساب', href: '/nasab/#constellation' },
    ],
  },
  {
    id: 'diyar',
    label: 'الديار',
    href: '/diyar/',
    chapter: 2,
    sections: [
      { id: 'map', label: 'الخريطة', href: '/diyar/#map' },
      { id: 'gallery', label: 'التراث', href: '/diyar/#gallery' },
    ],
  },
  {
    id: 'hawiya',
    label: 'الهوية',
    href: '/hawiya/',
    chapter: 3,
    sections: [
      { id: 'wasm', label: 'الوسم', href: '/hawiya/#wasm' },
      { id: 'poetry', label: 'الشعر', href: '/hawiya/#poetry' },
    ],
  },
  {
    id: 'tarikh',
    label: 'التاريخ',
    href: '/tarikh/',
    chapter: 4,
    sections: [
      { id: 'timeline', label: 'الخط الزمني', href: '/tarikh/#timeline' },
      { id: 'archive', label: 'الأرشيف', href: '/tarikh/#archive' },
    ],
  },
  {
    id: 'news',
    label: 'المجتمع',
    href: '/news/',
    chapter: 5,
    sections: [
      { id: 'news', label: 'الأخبار', href: '/news/' },
      { id: 'supporters', label: 'الداعمين', href: '/news/#supporters' },
      { id: 'contact', label: 'التواصل', href: '/news/#contact' },
      { id: 'admin', label: 'الإدارة', href: '/admin/' },
    ],
  },
  { id: 'home', label: 'الرئيسية', href: '/' },
];

/** المسارات المستقلة المعروضة في شريط التنقل (الروابط الكبرى) */
export const NAV_LINKS = SITE_ROUTES.filter((link) => link.id !== 'home');

/** خريطة من معرّف القسم إلى مساره (للانتقال من Hero وغيره) */
export const SECTION_TO_ROUTE: Record<string, string> = {
  home: '/',
  jathum: '/nasab/',
  lineage: '/nasab/#lineage',
  constellation: '/nasab/#constellation',
  map: '/diyar/',
  gallery: '/diyar/#gallery',
  wasm: '/hawiya/',
  poetry: '/hawiya/#poetry',
  timeline: '/tarikh/',
  archive: '/tarikh/#archive',
  news: '/news/',
  supporters: '/news/#supporters',
  contact: '/news/#contact',
  admin: '/admin/',
};

/** المسارات المستقلة الأساسية (لـ sitemap) */
export const STATIC_ROUTE_PATHS = [
  '/',
  '/nasab/',
  '/diyar/',
  '/hawiya/',
  '/tarikh/',
  '/news/',
  '/admin/',
];

/** أقسام الموقع لمعايير الأقسام الفردية (Metadata) */
export const SECTION_IDS = Object.keys(SECTION_TO_ROUTE);
