import { SITE_URL } from './site-metadata';

export interface IndexedSection {
  id: string;
  title: string;
  description: string;
}

interface SectionedWebPageInput {
  path: `/${string}/`;
  name: string;
  description: string;
  sections: readonly IndexedSection[];
}

export function buildSectionedWebPageJsonLd({
  path,
  name,
  description,
  sections,
}: SectionedWebPageInput) {
  const pageUrl = `${SITE_URL}${path}`;
  const pageId = `${pageUrl}#webpage`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': pageId,
    url: pageUrl,
    name,
    description,
    inLanguage: 'ar-SA',
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    hasPart: sections.map((section) => ({
      '@type': 'WebPageElement',
      '@id': `${pageUrl}#${section.id}`,
      url: `${pageUrl}#${section.id}`,
      name: section.title,
      description: section.description,
      inLanguage: 'ar-SA',
      isPartOf: {
        '@id': pageId,
      },
    })),
  };
}
