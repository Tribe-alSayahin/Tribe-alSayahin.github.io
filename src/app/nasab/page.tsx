import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import JathumMonument from '../../components/JathumMonument';
import LineageTree from '../../components/LineageTree';
import ConstellationDiagram from '../../components/ConstellationDiagram';

const siteUrl = 'https://alsaihani.com';

export const metadata: Metadata = {
  title: 'النسب والفخوذ',
  description:
    'توثيق نسب قبيلة السياحين (السيحاني) من المزاحمة من الروقة من عتيبة: هجرة الجثوم وشجرة النسب والأنساب الكوكبية.',
  alternates: { canonical: '/nasab/' },
  openGraph: {
    title: 'النسب والفخوذ | قبيلة السياحين',
    description:
      'توثيق نسب قبيلة السياحين (السيحاني) من المزاحمة من الروقة من عتيبة: هجرة الجثوم وشجرة النسب والأنساب الكوكبية.',
    url: '/nasab/',
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
      name: 'النسب والفخوذ',
      item: `${siteUrl}/nasab/`,
    },
  ],
};

export default function NasabPage() {
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
        title="هجرة الجثوم — أساس الديار"
        description="قبل كل الأقسام تأتي الجثوم: أول هجرة رسمية أسسها السياحين في عالية نجد، ومنها انطلق الاستقرار والتحضر وامتدت بقية الديار."
      >
        <JathumMonument />
      </Section>

      <Section
        id="lineage"
        tone="ink-2"
        chapterNumber={1}
        serialNumber="٠٢"
        badgeText="النسب والجذر"
        title="ديوان نسب القبيلة الأصيل"
        description="التوثيق المتسلسل لعمود نسب فخذ السياحين من المزاحمة من الروقة من عتيبة الهيلا، وصولاً لعدنان."
      >
        <LineageTree />
      </Section>

      <Section
        id="constellation"
        tone="ink"
        chapterNumber={1}
        serialNumber="٠٣"
        badgeText="الأنساب السبعة"
        title="الخلاصة الكوكبية للأنساب"
        description="تمثيل فلكي رمزي يربط الأنساب السبعة الكبرى في فضاء كوكبي مترابط يبرز التلاحم والأصل المشترك للقبيلة."
      >
        <ConstellationDiagram />
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
