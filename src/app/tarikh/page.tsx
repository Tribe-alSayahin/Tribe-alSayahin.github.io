import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import { Timeline } from '../../components/layout/Timeline';
import OppenheimArchive from '../../components/OppenheimArchive';
import { buildPublicPageMetadata, SITE_URL } from '../../lib/site-metadata';
import { getPublishedSiteSections } from '../../lib/site-sections-server';

const siteUrl = SITE_URL;

export const metadata: Metadata = buildPublicPageMetadata({
  title: 'التاريخ والأرشيف الاستشراقي',
  description:
    'الخط الزمني الكامل لقبيلة السياحين والأرشيف الاستشراقي النادر: وثائق ماكس فون أوبنهايم وشهادات الرحّالة ومخطوطات نجد التاريخية.',
  keywords: ['تاريخ قبيلة السياحين', 'الأرشيف الاستشراقي', 'وثائق السياحين', 'تاريخ عتيبة', 'الخط الزمني للسياحين'],
  path: '/tarikh/',
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
      name: 'التاريخ والأرشيف الاستشراقي',
      item: `${siteUrl}/tarikh/`,
    },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/tarikh/#webpage`,
  url: `${siteUrl}/tarikh/`,
  name: 'التاريخ والأرشيف الاستشراقي | الموقع الرسمي لقبيلة السياحين',
  description: 'الخط الزمني الكامل لقبيلة السياحين والأرشيف الاستشراقي النادر: وثائق ماكس فون أوبنهايم وشهادات الرحّالة ومخطوطات نجد التاريخية.',
  inLanguage: 'ar-SA',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
  },
};

export default async function TarikhPage() {
  const sections = await getPublishedSiteSections(['timeline', 'archive']);

  return (
    <>
      <ChapterDivider
        id="chapter-history"
        number={4}
        title="التاريخ"
        description="الخط الزمني والأرشيف الاستشراقي: شهادات الماضي وتوثيقاته."
      />

      <Section
        id="timeline"
        tone="ink-2"
        noBorder
        chapterNumber={4}
        serialNumber="٠٨"
        badgeText="من تاريخ القبيلة"
        title={sections.timeline.title}
        description={sections.timeline.description}
        imageUrl={sections.timeline.image_url}
        imageAlt={sections.timeline.image_alt}
      >
        <Timeline />
      </Section>

      <Section
        id="archive"
        tone="ink"
        chapterNumber={4}
        serialNumber="٠٩"
        badgeText="الأرشيف والمصادر"
        title={sections.archive.title}
        description={sections.archive.description}
        imageUrl={sections.archive.image_url}
        imageAlt={sections.archive.image_alt}
      >
        <OppenheimArchive />
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
