import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import NewsEvents from '../../components/NewsEvents';
import { Supporters } from '../../components/layout/Supporters';
import { Contact } from '../../components/layout/Contact';
import { buildPublicPageMetadata, SITE_URL } from '../../lib/site-metadata';

const siteUrl = SITE_URL;

export const metadata: Metadata = buildPublicPageMetadata({
  title: 'الأخبار والمناسبات',
  description:
    'آخر الأخبار والمناسبات والفعاليات الرسمية لقبيلة السياحين: تغطية مستمرة للحاضر القبلي وتواصل الأجيال وإحياء الموروث الثقافي.',
  keywords: ['أخبار قبيلة السياحين', 'مناسبات قبيلة السياحين', 'فعاليات السياحين', 'أخبار القبائل', 'الموقع الرسمي لقبيلة السياحين'],
  path: '/news/',
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
      name: 'الأخبار والمناسبات',
      item: `${siteUrl}/news/`,
    },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/news/#webpage`,
  url: `${siteUrl}/news/`,
  name: 'الأخبار والمناسبات | الموقع الرسمي لقبيلة السياحين',
  description: 'آخر الأخبار والمناسبات والفعاليات الرسمية لقبيلة السياحين: تغطية مستمرة للحاضر القبلي وتواصل الأجيال وإحياء الموروث الثقافي.',
  inLanguage: 'ar-SA',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
  },
};

export default function NewsPage() {
  return (
    <>
      <ChapterDivider
        id="chapter-community"
        number={5}
        title="المجتمع"
        description="الأخبار والداعمين والتواصل: حاضر القبيلة وتواصلها مع الأجيال."
      />

      <Section
        id="news"
        tone="ink-2"
        noBorder
        chapterNumber={5}
        serialNumber="١٠"
        badgeText="الأخبار والمناسبات"
        title="الأخبار والمناسبات"
        description="قسم القراءة العامة لعناصر الأخبار والمناسبات المنشورة من لوحة الإدارة."
      >
        <NewsEvents />
      </Section>

      <Section
        id="supporters"
        tone="ink"
        chapterNumber={5}
        serialNumber="١١"
        badgeText="بدعمهم نستمر"
        title="داعمو وثيقة وإرث القبيلة"
        description="تقديراً وعرفاناً لرجالات وأبناء قبيلة السياحين الذين ساهموا بسخاء ودعم مستمر في توثيق هذا الإرث التاريخي العريق وصونه للأجيال."
      >
        <Supporters />
      </Section>

      <Section
        id="contact"
        tone="ink-2"
        chapterNumber={5}
        serialNumber="١٢"
        badgeText="على تواصل"
        title="تواصل معنا"
        description="لأي استفسار أو إضافة معلومة موثّقة عن القبيلة، يسعدنا تواصلكم."
      >
        <Contact />
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
