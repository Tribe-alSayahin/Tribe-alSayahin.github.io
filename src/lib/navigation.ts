import { getDefaultSiteSection, type SiteSectionKey } from './site-sections-shared';

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
  /** وصف موجز للقسم (للبطاقات والـ SEO) */
  description?: string;
  /** الأقسام الفرعية ضمن الفصل (للقائمة المتنقلة) */
  sections?: NavSection[];
}

function getSectionTitle(key: SiteSectionKey): string {
  return getDefaultSiteSection(key).title;
}

export const SITE_ROUTES: NavLinkItem[] = [
  {
    id: 'nasab',
    label: 'الأصول',
    href: '/nasab/',
    chapter: 1,
    description: 'نسب القبيلة الأصيل من السياحين إلى المزاحمة — شجرة النسب الموثّقة والفخوذ الكاملة.',
    sections: [
      { id: 'lineage', label: getSectionTitle('lineage'), href: '/nasab/#lineage' },
      {
        id: 'constellation',
        label: getSectionTitle('constellation'),
        href: '/nasab/#constellation',
      },
    ],
  },
  {
    id: 'diyar',
    label: 'الديار',
    href: '/diyar/',
    chapter: 2,
    description: 'الجثوم أساس الديار، ومعرض التراث البصري لمواطن القبيلة وهجراتها التاريخية.',
    sections: [
      { id: 'jathum', label: getSectionTitle('jathum'), href: '/diyar/#jathum' },
      { id: 'gallery', label: getSectionTitle('gallery'), href: '/diyar/#gallery' },
    ],
  },
  {
    id: 'hawiya',
    label: 'الهوية',
    href: '/hawiya/',
    chapter: 3,
    description: 'وسم الإبل «الباب» الفريد وديوان الشعر النبطي — علامات الهوية القبلية الأصيلة.',
    sections: [
      { id: 'wasm', label: getSectionTitle('wasm'), href: '/hawiya/#wasm' },
      { id: 'poetry', label: getSectionTitle('poetry'), href: '/hawiya/#poetry' },
    ],
  },
  {
    id: 'tarikh',
    label: 'التاريخ',
    href: '/tarikh/',
    chapter: 4,
    description: 'الخط الزمني للقبيلة والأرشيف الاستشراقي النادر — وثائق تاريخية لم تُجمع من قبل.',
    sections: [
      { id: 'timeline', label: getSectionTitle('timeline'), href: '/tarikh/#timeline' },
      { id: 'archive', label: getSectionTitle('archive'), href: '/tarikh/#archive' },
    ],
  },
  {
    id: 'news',
    label: 'المجتمع',
    href: '/news/',
    chapter: 5,
    description: 'آخر أخبار القبيلة ومناسباتها وأسماء الداعمين — تواصل مع أبناء السياحين في كل مكان.',
    sections: [
      { id: 'news', label: 'الأخبار والمناسبات', href: '/news/' },
      { id: 'events', label: 'المناسبات', href: '/events/' },
      { id: 'supporters', label: 'داعمو وثيقة وإرث القبيلة', href: '/news/#supporters' },
      { id: 'contact', label: 'تواصل معنا', href: '/news/#contact' },
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
  jathum: '/diyar/#jathum',
  lineage: '/nasab/#lineage',
  constellation: '/nasab/#constellation',
  gallery: '/diyar/#gallery',
  wasm: '/hawiya/#wasm',
  poetry: '/hawiya/#poetry',
  timeline: '/tarikh/#timeline',
  archive: '/tarikh/#archive',
  news: '/news/',
  events: '/events/',
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
  '/events/',
  '/poetry/',
  '/hussain/',
];

/** أقسام الموقع لمعايير الأقسام الفردية (Metadata) */
export const SECTION_IDS = Object.keys(SECTION_TO_ROUTE);
