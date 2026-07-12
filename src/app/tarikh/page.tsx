import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import { Timeline } from '../../components/layout/Timeline';
import OppenheimArchive from '../../components/OppenheimArchive';

const siteUrl = 'https://alsaihani.com';

export const metadata: Metadata = {
  title: 'التاريخ والأرشيف الاستشراقي',
  description:
    'الخط الزمني لقبيلة السياحين والأرشيف الاستشراقي: شهادات الماضي وتوثيقاته.',
  alternates: { canonical: '/tarikh/' },
  openGraph: {
    title: 'التاريخ والأرشيف الاستشراقي | قبيلة السياحين',
    description:
      'الخط الزمني لقبيلة السياحين والأرشيف الاستشراقي: شهادات الماضي وتوثيقاته.',
    url: '/tarikh/',
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
    </>
  );
}
