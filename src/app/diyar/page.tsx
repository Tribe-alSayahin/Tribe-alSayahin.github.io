import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import InteractiveMap from '../../components/InteractiveMap';
import HeritageGallery from '../../components/HeritageGallery';

const siteUrl = 'https://alsaihani.com';

export const metadata: Metadata = {
  title: 'الديار والهجرات',
  description:
    'استكشف ديار قبيلة السياحين ومنازلها التاريخية ومنازل الاستقرار والهجرات وهجرها المعتمدة ومناهل المياه القديمة.',
  keywords: ['ديار قبيلة السياحين', 'هجرات السياحين', 'منازل السياحين', 'ديار عتيبة', 'نجد'],
  robots: { index: true, follow: true },
  alternates: { canonical: '/diyar/' },
  openGraph: {
    title: 'الديار والهجرات | قبيلة السياحين',
    description:
      'استكشف ديار قبيلة السياحين ومنازلها التاريخية ومنازل الاستقرار والهجرات وهجرها المعتمدة ومناهل المياه القديمة.',
    locale: 'ar_SA',
    url: '/diyar/',
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'الرئيسية',
      item: `${siteUrl}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'الديار والهجرات',
      item: `${siteUrl}/diyar/`,
    },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/diyar/#webpage`,
  url: `${siteUrl}/diyar/`,
  name: 'الديار والهجرات | الموقع الرسمي لقبيلة السياحين',
  description:
    'استكشف ديار قبيلة السياحين ومنازلها التاريخية ومنازل الاستقرار والهجرات وهجرها المعتمدة ومناهل المياه القديمة.',
  inLanguage: 'ar-SA',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
  },
};

export default function DiyarPage() {
  return (
    <>
      <ChapterDivider
        id="chapter-diyar"
        number={2}
        title="الديار"
        description="منازل الاستقرار والهجرات: خريطة الديار ومعرض التراث البصري."
      />

      <Section
        id="map"
        tone="ink-2"
        noBorder
        chapterNumber={2}
        serialNumber="٠٤"
        badgeText="الديار والهجرات"
        title="الديار ومنازل الاستقرار"
        description="استكشف التوزيع الجغرافي لديار السياحين التاريخية، من منازلهم في نجد العذية وهجرهم المعتمدة ومناهل المياه القديمة."
      >
        <InteractiveMap />
      </Section>

      <Section
        id="gallery"
        tone="ink"
        chapterNumber={2}
        serialNumber="٠٥"
        badgeText="الشاهد البصري"
        title="معرض التراث والمقتنيات"
        description="شواهد بصرية ومقتنيات تراثية تعكس تاريخ القبيلة العريق وصوراً من ذاكرة الصحراء والديار المأهولة."
      >
        <HeritageGallery />
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
    </>
  );
}
