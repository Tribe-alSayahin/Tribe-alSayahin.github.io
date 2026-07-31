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
    key: 'jathum',
    page: 'النسب والفخوذ',
    label: 'هجرة الجثوم',
    title: 'هجرة الجثوم — أساس الديار',
    description:
      'قبل كل الأقسام تأتي الجثوم: أول هجرة رسمية أسسها السياحين في عالية نجد، ومنها انطلق الاستقرار والتحضر وامتدت بقية الديار.',
    imageUrl: null,
    imageAlt: null,
    sortOrder: 10,
  },
  {
    key: 'lineage',
    page: 'النسب والفخوذ',
    label: 'شجرة النسب',
    title: 'ديوان نسب القبيلة الأصيل',
    description:
      'التوثيق المتسلسل لعمود نسب فخذ السياحين من المزاحمة من الروقة من عتيبة الهيلا، وصولاً لعدنان.',
    imageUrl: null,
    imageAlt: null,
    sortOrder: 20,
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
    sortOrder: 30,
  },
  {
    key: 'gallery',
    page: 'الديار والهجرات',
    label: 'معرض التراث',
    title: 'معرض التراث والمقتنيات',
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

export interface SiteSectionContent {
  section_key: SiteSectionKey;
  title: string;
  description: string;
  image_url: string | null;
  image_alt: string | null;
  status: 'draft' | 'published';
  sort_order: number;
}

export const SITE_SECTION_KEYS = SITE_SECTION_DEFINITIONS.map(({ key }) => key);

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
  return { ...getDefaultSiteSection(key), ...stored, section_key: key };
}
