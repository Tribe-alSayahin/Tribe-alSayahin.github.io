import type { Metadata } from 'next';
import { ChapterDivider } from '../../components/layout/ChapterDivider';
import { Section } from '../../components/layout/Section';
import { SectionIndex } from '../../components/layout/SectionIndex';
import WasmGallery from '../../components/WasmGallery';
import PoetryCouncil from '../../components/PoetryCouncil';
import { buildSectionedWebPageJsonLd } from '../../lib/section-indexing';
import { buildPublicPageMetadata, SITE_URL } from '../../lib/site-metadata';
import { getPublishedSiteSections } from '../../lib/site-sections-server';

const siteUrl = SITE_URL;
const pageDescription =
  'وسم الإبل «الباب» الفريد وديوان الشعر النبطي لقبيلة السياحين: كنوز الهوية القبلية الأصيلة من شعر عتيبة وعلامات الانتساب.';

export const metadata: Metadata = buildPublicPageMetadata({
  title: 'الهوية ووسم الإبل والشعر',
  description: pageDescription,
  keywords: ['وسم السياحين', 'وسم الإبل الباب', 'شعر قبيلة السياحين', 'ديوان الشعر النبطي', 'هوية السياحين'],
  path: '/hawiya/',
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
      name: 'الهوية ووسم الإبل والشعر',
      item: `${siteUrl}/hawiya/`,
    },
  ],
};

export default async function HawiyaPage() {
  const sections = await getPublishedSiteSections(['wasm', 'poetry']);
  const indexedSections = [
    { id: 'wasm', title: sections.wasm.title, description: sections.wasm.description },
    { id: 'poetry', title: sections.poetry.title, description: sections.poetry.description },
  ];
  const webPageLd = buildSectionedWebPageJsonLd({
    path: '/hawiya/',
    name: 'الهوية ووسم الإبل والشعر | الموقع الرسمي لقبيلة السياحين',
    description: pageDescription,
    sections: indexedSections,
  });

  return (
    <>
      <ChapterDivider
        id="chapter-identity"
        number={3}
        title="الهوية"
        description="وسم الإبل وديوان الشعر: علامات الهوية والإبداع القبلي."
      />

      <SectionIndex sections={indexedSections} />

      <Section
        id="wasm"
        tone="ink-2"
        noBorder
        chapterNumber={3}
        narrow
        serialNumber="٠٦"
        badgeText="علامات الوسم"
        title={sections.wasm.title}
        description={sections.wasm.description}
        imageUrl={sections.wasm.image_url}
        imageAlt={sections.wasm.image_alt}
      >
        <WasmGallery />
      </Section>

      <Section
        id="poetry"
        tone="ink"
        chapterNumber={3}
        serialNumber="٠٧"
        badgeText="مجلس الشعراء"
        title={sections.poetry.title}
        description={sections.poetry.description}
        imageUrl={sections.poetry.image_url}
        imageAlt={sections.poetry.image_alt}
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
