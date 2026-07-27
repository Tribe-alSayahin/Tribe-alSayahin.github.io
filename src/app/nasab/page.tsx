import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import JathumMonument from '../../components/JathumMonument';
import LineageTree from '../../components/LineageTree';
import ConstellationDiagram from '../../components/ConstellationDiagram';
import { buildPublicPageMetadata, SITE_URL } from '../../lib/site-metadata';
import { getPublishedSiteSections } from '../../lib/site-sections-server';

const siteUrl = SITE_URL;

export const metadata: Metadata = buildPublicPageMetadata({
  title: 'النسب والفخوذ',
  description:
    'توثيق نسب قبيلة السياحين (السيحاني) من المزاحمة من الروقة من عتيبة: هجرة الجثوم وشجرة النسب والأنساب الكوكبية المفصّلة لفخوذ القبيلة.',
  keywords: ['نسب قبيلة السياحين', 'فخوذ السياحين', 'السيحاني', 'الروقة من عتيبة', 'هجرة الجثوم'],
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

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/nasab/#webpage`,
  url: `${siteUrl}/nasab/`,
  name: 'النسب والفخوذ | الموقع الرسمي لقبيلة السياحين',
  description:
    'توثيق نسب قبيلة السياحين (السيحاني) من المزاحمة من الروقة من عتيبة: هجرة الجثوم وشجرة النسب والأنساب الكوكبية المفصّلة لفخوذ القبيلة.',
  inLanguage: 'ar-SA',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
  },
};

export default async function NasabPage() {
  const sections = await getPublishedSiteSections(['jathum', 'lineage', 'constellation']);

  return (
    <>
      <ChapterDivider
        id="chapter-origins"
        number={1}
        title="الأصول"
        description="الجذور الأولى: الجثوم والنسب والأنساب، حيث تبدأ قصة السياحين."
      />

      <Section
        id="jathum"
        tone="ink"
        noBorder
        chapterNumber={1}
        serialNumber="٠١"
        badgeText="الأساس والمنطلق"
        title={sections.jathum.title}
        description={sections.jathum.description}
        imageUrl={sections.jathum.image_url}
        imageAlt={sections.jathum.image_alt}
      >
        <JathumMonument />
      </Section>

      <Section
        id="lineage"
        tone="ink-2"
        chapterNumber={1}
        serialNumber="٠٢"
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
        serialNumber="٠٣"
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
