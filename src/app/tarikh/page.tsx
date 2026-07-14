import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import { Timeline } from '../../components/layout/Timeline';
import OppenheimArchive from '../../components/OppenheimArchive';

const siteUrl = 'https://alsaihani.com';

export const metadata: Metadata = {
  title: 'التاريخ والأرشيف الاستشراقي',
  description:
    'الخط الزمني الكامل لقبيلة السياحين والأرشيف الاستشراقي النادر: وثائق ماكس فون أوبنهايم وشهادات الرحّالة ومخطوطات نجد التاريخية.',
  keywords: ['تاريخ قبيلة السياحين', 'الأرشيف الاستشراقي', 'وثائق السياحين', 'تاريخ عتيبة', 'الخط الزمني للسياحين'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://alsaihani.com/tarikh/' },
  openGraph: {
    title: 'التاريخ والأرشيف الاستشراقي | قبيلة السياحين',
    description:
      'الخط الزمني الكامل لقبيلة السياحين والأرشيف الاستشراقي النادر: وثائق ماكس فون أوبنهايم وشهادات الرحّالة ومخطوطات نجد التاريخية.',
    locale: 'ar_SA',
    url: 'https://alsaihani.com/tarikh/',
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

export default function TarikhPage() {
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
        title="صفحات من مآثر وإرث القبيلة"
        description="تسلسل زمني يوثق أبرز المحطات التاريخية لفروسية ومواقف قبيلة السياحين وإسهامها الوطني المعتمد."
      >
        <Timeline />
      </Section>

      <Section
        id="archive"
        tone="ink"
        chapterNumber={4}
        serialNumber="٠٩"
        badgeText="الأرشيف والمصادر"
        title="التوثيق الاستشراقي والمدونات التاريخية"
        description="شهادات وملاحظات المستشرقين والرحالة الغربيين حول نسب وقوة ومواقف السياحين في تاريخ الجزيرة العربية."
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
