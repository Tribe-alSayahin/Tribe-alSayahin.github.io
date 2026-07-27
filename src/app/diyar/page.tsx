import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import InteractiveMap from '../../components/InteractiveMap';
import HeritageGallery from '../../components/HeritageGallery';
import { buildPublicPageMetadata, SITE_URL } from '../../lib/site-metadata';
import { getPublishedSiteSections } from '../../lib/site-sections-server';

const siteUrl = SITE_URL;

export const metadata: Metadata = buildPublicPageMetadata({
  title: 'الديار والهجرات',
  description:
    'استكشف ديار قبيلة السياحين ومنازلها التاريخية في عالية نجد ومنازل الاستقرار والهجرات وهجرها المعتمدة ومناهل المياه القديمة.',
  keywords: ['ديار قبيلة السياحين', 'هجرات السياحين', 'منازل السياحين', 'ديار عتيبة', 'نجد'],
  path: '/diyar/',
});

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
    'استكشف ديار قبيلة السياحين ومنازلها التاريخية في عالية نجد ومنازل الاستقرار والهجرات وهجرها المعتمدة ومناهل المياه القديمة.',
  inLanguage: 'ar-SA',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
  },
};

export default async function DiyarPage() {
  const sections = await getPublishedSiteSections(['map', 'gallery']);

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
        title={sections.map.title}
        description={sections.map.description}
        imageUrl={sections.map.image_url}
        imageAlt={sections.map.image_alt}
      >
        <InteractiveMap />
      </Section>

      <Section
        id="gallery"
        tone="ink"
        chapterNumber={2}
        serialNumber="٠٥"
        badgeText="الشاهد البصري"
        title={sections.gallery.title}
        description={sections.gallery.description}
        imageUrl={sections.gallery.image_url}
        imageAlt={sections.gallery.image_alt}
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
