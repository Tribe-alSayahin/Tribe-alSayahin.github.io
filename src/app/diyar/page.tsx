import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import { SectionIndex } from '../../components/layout/SectionIndex';
import JathumMonument from '../../components/JathumMonument';
import HeritageGallery from '../../components/HeritageGallery';
import { buildSectionedWebPageJsonLd } from '../../lib/section-indexing';
import { buildPublicPageMetadata, SITE_URL } from '../../lib/site-metadata';
import { getPublishedSiteSections } from '../../lib/site-sections-server';

const siteUrl = SITE_URL;
const pageDescription =
  'استكشف هجرة الجثوم أساس ديار قبيلة السياحين، ومنازل الاستقرار والهجرات التاريخية ومناهل المياه القديمة، ومعرض التراث البصري الذي يوثق ذاكرة المكان وشواهده.';

export const metadata: Metadata = buildPublicPageMetadata({
  title: 'الديار والهجرات',
  description: pageDescription,
  keywords: ['ديار قبيلة السياحين', 'هجرة الجثوم', 'هجرات السياحين', 'منازل السياحين', 'ديار عتيبة'],
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

export default async function DiyarPage() {
  const sections = await getPublishedSiteSections(['jathum', 'gallery']);
  const indexedSections = [
    { id: 'jathum', title: sections.jathum.title, description: sections.jathum.description },
    { id: 'gallery', title: sections.gallery.title, description: sections.gallery.description },
  ];
  const webPageLd = buildSectionedWebPageJsonLd({
    path: '/diyar/',
    name: 'الديار والهجرات | الموقع الرسمي لقبيلة السياحين',
    description: pageDescription,
    sections: indexedSections,
  });

  return (
    <>
      <ChapterDivider
        id="chapter-diyar"
        number={2}
        title="الديار"
        description="الجثوم أساس الديار، ومنازل الاستقرار والهجرات ومعرض التراث البصري."
      />

      <SectionIndex sections={indexedSections} />

      <Section
        id="jathum"
        tone="ink-2"
        noBorder
        chapterNumber={2}
        serialNumber="٠٣"
        badgeText="الأساس والمنطلق"
        title={sections.jathum.title}
        description={sections.jathum.description}
        imageUrl={sections.jathum.image_url}
        imageAlt={sections.jathum.image_alt}
      >
        <JathumMonument />
      </Section>

      <Section
        id="gallery"
        tone="ink"
        chapterNumber={2}
        serialNumber="٠٤"
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
