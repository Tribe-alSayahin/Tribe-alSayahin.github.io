import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import WasmGallery from '../../components/WasmGallery';
import PoetryCouncil from '../../components/PoetryCouncil';

const siteUrl = 'https://alsaihani.com';

export const metadata: Metadata = {
  title: 'الهوية ووسم الإبل والشعر',
  description:
    'وسم الإبل «الباب» الفريد وديوان الشعر النبطي لقبيلة السياحين: كنوز الهوية القبلية الأصيلة من شعر عتيبة وعلامات الانتساب.',
  keywords: ['وسم السياحين', 'وسم الإبل الباب', 'شعر قبيلة السياحين', 'ديوان الشعر النبطي', 'هوية السياحين'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://alsaihani.com/hawiya/' },
  openGraph: {
    title: 'الهوية ووسم الإبل والشعر | قبيلة السياحين',
    description:
      'وسم الإبل «الباب» الشهير لقبيلة السياحين وديوان الشعر النبطي الأصيل: علامات الهوية القبلية الموروثة والإبداع التليد من عتيبة.',
    locale: 'ar_SA',
    url: 'https://alsaihani.com/hawiya/',
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
      name: 'الهوية ووسم الإبل والشعر',
      item: `${siteUrl}/hawiya/`,
    },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/hawiya/#webpage`,
  url: `${siteUrl}/hawiya/`,
  name: 'الهوية ووسم الإبل والشعر | الموقع الرسمي لقبيلة السياحين',
  description: 'وسم الإبل «الباب» الشهير لقبيلة السياحين وديوان الشعر النبطي الأصيل: علامات الهوية القبلية الموروثة والإبداع التليد من عتيبة.',
  inLanguage: 'ar-SA',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
  },
};

export default function HawiyaPage() {
  return (
    <>
      <ChapterDivider
        id="chapter-identity"
        number={3}
        title="الهوية"
        description="وسم الإبل وديوان الشعر: علامات الهوية والإبداع القبلي."
      />

      <Section
        id="wasm"
        tone="ink-2"
        noBorder
        chapterNumber={3}
        narrow
        serialNumber="٠٦"
        badgeText="علامات الوسم"
        title="وسم الإبل وعلامة الباب"
        description="وسم «الباب» الشهير للسياحين على الرقبة من الجهة اليسرى، رمز الهوية والأصالة في البادية."
      >
        <WasmGallery />
      </Section>

      <Section
        id="poetry"
        tone="ink"
        chapterNumber={3}
        serialNumber="٠٧"
        badgeText="مجلس الشعراء"
        title="ديوان الشعر النبطي"
        description="مساحة مخصصة للقصائد الموثقة وشواهد الشعر النبطي بعد مراجعتها وإسنادها إلى مصادر واضحة."
      >
        <PoetryCouncil />
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
