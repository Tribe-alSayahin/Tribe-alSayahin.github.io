import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import { SectionIndex } from '../../components/layout/SectionIndex';
import LineageTree from '../../components/LineageTree';
import ConstellationDiagram from '../../components/ConstellationDiagram';
import { buildSectionedWebPageJsonLd } from '../../lib/section-indexing';
import { buildPublicPageMetadata, SITE_URL } from '../../lib/site-metadata';
import { getPublishedSiteSections } from '../../lib/site-sections-server';

const siteUrl = SITE_URL;
const pageDescription =
  'توثيق نسب قبيلة السياحين (السيحاني) من المزاحمة من الروقة من عتيبة، مع شجرة النسب والأنساب الكوكبية المفصّلة لفخوذ القبيلة.';

export const metadata: Metadata = buildPublicPageMetadata({
  title: 'النسب والفخوذ',
  description: pageDescription,
  keywords: ['نسب قبيلة السياحين', 'فخوذ السياحين', 'السيحاني', 'الروقة من عتيبة', 'شجرة النسب'],
  path: '/nasab/',
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
      name: 'النسب والفخوذ',
      item: `${siteUrl}/nasab/`,
    },
  ],
};

export default async function NasabPage() {
  const sections = await getPublishedSiteSections(['lineage', 'constellation']);
  const indexedSections = [
    { id: 'lineage', title: sections.lineage.title, description: sections.lineage.description },
    {
      id: 'constellation',
      title: sections.constellation.title,
      description: sections.constellation.description,
    },
  ];
  const webPageLd = buildSectionedWebPageJsonLd({
    path: '/nasab/',
    name: 'النسب والفخوذ | الموقع الرسمي لقبيلة السياحين',
    description: pageDescription,
    sections: indexedSections,
  });

  return (
    <>
      <ChapterDivider
        id="chapter-origins"
        number={1}
        title="الأصول"
        description="نسب القبيلة الأصيل والأنساب الكوكبية الموثّقة."
      />

      <SectionIndex sections={indexedSections} />

      <Section
        id="lineage"
        tone="ink-2"
        noBorder
        chapterNumber={1}
        serialNumber="٠١"
        badgeText="النسب والجذر"
        title={sections.lineage.title}
        description={sections.lineage.description}
        imageUrl={sections.lineage.image_url}
        imageAlt={sections.lineage.image_alt}
      >
        <LineageTree />
      </Section>

      <Section
        id="constellation"
        tone="ink"
        chapterNumber={1}
        serialNumber="٠٢"
        badgeText="الأنساب السبعة"
        title={sections.constellation.title}
        description={sections.constellation.description}
        imageUrl={sections.constellation.image_url}
        imageAlt={sections.constellation.image_alt}
      >
        <ConstellationDiagram />
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
