interface SiteSectionDefinition {
  key: string;
  page: string;
  label: string;
  title: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string | null;
  sortOrder: number;
}

export const SITE_SECTION_DEFINITIONS = [
  {
    key: 'home',
    page: 'الرئيسية',
    label: 'مدخل الموقع',
    title: 'قبيلة السياحين',
    description:
      'ديوان رقمي موثّق يجمع الديار والنسب والشعر والتاريخ في سيرة واحدة، تبدأ من الجثوم وتمتد في ذاكرة المكان.',
    imageUrl: '/images/jathum-hills-hussain-alsaihani.jpg',
    imageAlt: 'هضب الجثوم والسهول المحيطة به في عالية نجد',
    sortOrder: 0,
  },
  {
    key: 'lineage',
    page: 'النسب والفخوذ',
    label: 'شجرة النسب',
    title: 'نسب القبيلة الأصيل',
    description:
      'التوثيق المتسلسل لعمود نسب فخذ السياحين من المزاحمة من الروقة من عتيبة الهيلا، وصولاً لعدنان.',
    imageUrl: null,
    imageAlt: null,
    sortOrder: 10,
  },
  {
    key: 'constellation',
    page: 'النسب والفخوذ',
    label: 'الخلاصة الكوكبية',
    title: 'الخلاصة الكوكبية للأنساب',
    description:
      'تمثيل فلكي رمزي يربط الأنساب السبعة الكبرى في فضاء كوكبي مترابط يبرز التلاحم والأصل المشترك للقبيلة.',
    imageUrl: null,
    imageAlt: null,
    sortOrder: 20,
  },
  {
    key: 'sheikhdom',
    page: 'الرئيسية',
    label: 'المشيخة',
    title: 'المشيخة',
    description: 'مجموعة الصور التي أرفقها مالك الموقع لقسم المشيخة.',
    imageUrl: null,
    imageAlt: null,
    sortOrder: 30,
  },
  {
    key: 'jathum',
    page: 'الديار والهجرات',
    label: 'أساس الديار — الجثوم',
    title: 'أساس الديار — الجثوم',
    description:
      'قبل كل الأقسام تأتي الجثوم: أول هجرة رسمية أسسها السياحين في عالية نجد، ومنها انطلق الاستقرار والتحضر وامتدت بقية الديار.',
    imageUrl: null,
    imageAlt: null,
    sortOrder: 40,
  },
  {
    key: 'gallery',
    page: 'الديار والهجرات',
    label: 'ديار القبيلة',
    title: 'الديار التابعة للقبيلة',
    description:
      'شواهد بصرية ومقتنيات تراثية تعكس تاريخ القبيلة العريق وصوراً من ذاكرة الصحراء والديار المأهولة.',
    imageUrl: null,
    imageAlt: null,
    sortOrder: 50,
  },
  {
    key: 'wasm',
    page: 'الهوية والشعر',
    label: 'وسم الإبل',
    title: 'وسم الإبل وعلامة الباب',
    description:
      'وسم «الباب» الشهير للسياحين على الرقبة من الجهة اليسرى، رمز الهوية والأصالة في البادية.',
    imageUrl: null,
    imageAlt: null,
    sortOrder: 60,
  },
  {
    key: 'poetry',
    page: 'الهوية والشعر',
    label: 'ديوان الشعر',
    title: 'ديوان الشعر النبطي',
    description:
      'مساحة مخصصة للقصائد الموثقة وشواهد الشعر النبطي بعد مراجعتها وإسنادها إلى مصادر واضحة.',
    imageUrl: null,
    imageAlt: null,
    sortOrder: 70,
  },
  {
    key: 'timeline',
    page: 'التاريخ والأرشيف',
    label: 'الخط الزمني',
    title: 'صفحات من مآثر وإرث القبيلة',
    description:
      'تسلسل زمني يوثق أبرز المحطات التاريخية لفروسية ومواقف قبيلة السياحين وإسهامها الوطني المعتمد.',
    imageUrl: null,
    imageAlt: null,
    sortOrder: 80,
  },
  {
    key: 'archive',
    page: 'التاريخ والأرشيف',
    label: 'الأرشيف والمصادر',
    title: 'التوثيق الاستشراقي والمدونات التاريخية',
    description:
      'شهادات وملاحظات المستشرقين والرحالة الغربيين حول نسب وقوة ومواقف السياحين في تاريخ الجزيرة العربية.',
    imageUrl: null,
    imageAlt: null,
    sortOrder: 90,
  },
] as const satisfies readonly SiteSectionDefinition[];

export type SiteSectionKey = (typeof SITE_SECTION_DEFINITIONS)[number]['key'];

export type SiteSectionGalleryImage = {
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
};

export const MAX_SITE_GALLERY_IMAGES = 30;

export function validateSiteSectionGallery(value: unknown): string | null {
  if (value == null) return null;
  if (!Array.isArray(value) || value.length > MAX_SITE_GALLERY_IMAGES) {
    return 'يمكن إضافة ٣٠ صورة كحد أقصى.';
  }
  for (const candidate of value as unknown[]) {
    if (!candidate || typeof candidate !== 'object') {
      return 'بيانات الصورة غير صالحة.';
    }
    const image = candidate as Record<string, unknown>;
    if (
      typeof image.src !== 'string' || !isSafeGalleryUrl(image.src) ||
      typeof image.alt !== 'string' || !image.alt.trim() || image.alt.length > 500 ||
      typeof image.caption !== 'string' || image.caption.length > 2000 ||
      [image.width, image.height].some((size) => size !== undefined &&
        (typeof size !== 'number' || !Number.isInteger(size) || size < 1 || size > 20000))) {
      return 'تحقق من رابط الصورة ووصفها؛ الحد الأقصى للنص البديل ٥٠٠ حرف وللتعليق ٢٠٠٠ حرف.';
    }
  }
  return null;
}

function isSafeGalleryUrl(src: string): boolean {
  if (!src || src.length > 2048 || /[\\\s]/u.test(src) ||
    Array.from(src).some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) return false;
  if (src.startsWith('/') && !src.startsWith('//')) return true;
  try {
    const url = new URL(src);
    return src.startsWith('https://') && url.protocol === 'https:' && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}

export interface SiteSectionContent {
  section_key: SiteSectionKey;
  title: string;
  description: string;
  image_url: string | null;
  image_alt: string | null;
  gallery_images?: SiteSectionGalleryImage[] | null;
  status: 'draft' | 'published';
  sort_order: number;
}

export const SITE_SECTION_KEYS = SITE_SECTION_DEFINITIONS.map(({ key }) => key);

const LEGACY_SECTION_TITLES: Partial<Record<SiteSectionKey, readonly string[]>> = {
  lineage: ['ديوان نسب القبيلة الأصيل'],
  jathum: ['هجرة الجثوم — أساس الديار'],
  gallery: ['معرض التراث والمقتنيات'],
};

export function getDefaultSiteSection(key: SiteSectionKey): SiteSectionContent {
  const definition: SiteSectionDefinition | undefined = SITE_SECTION_DEFINITIONS.find(
    (item) => item.key === key,
  );
  if (!definition) {
    throw new Error(`Unknown site section: ${key}`);
  }

  return {
    section_key: key,
    title: definition.title,
    description: definition.description,
    image_url: definition.imageUrl,
    image_alt: definition.imageAlt,
    status: 'published',
    sort_order: definition.sortOrder,
  };
}

export function mergeSiteSection(
  key: SiteSectionKey,
  stored?: Partial<SiteSectionContent> | null,
): SiteSectionContent {
  const defaultSection = getDefaultSiteSection(key);
  const merged = { ...defaultSection, ...stored, section_key: key, gallery_images: validateSiteSectionGallery(stored?.gallery_images) ? null : stored?.gallery_images };
  const legacyTitles = LEGACY_SECTION_TITLES[key];

  return legacyTitles?.includes(merged.title)
    ? { ...merged, title: defaultSection.title }
    : merged;
}
