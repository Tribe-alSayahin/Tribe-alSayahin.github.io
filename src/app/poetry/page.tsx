import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { getPublishedPoetryEntries } from '../../lib/poetry-server';
import { buildPoetryDescription } from '../../lib/poetry-seo';
import { buildPublicPageMetadata, SITE_NAME, SITE_URL } from '../../lib/site-metadata';

const description =
  'ديوان الشعر النبطي الموثق لقبيلة السياحين من الروقة من عتيبة، ويضم القصائد المنشورة وقصصها وشعراءها ومصادرها في صفحات مستقلة قابلة للبحث.';

export const metadata: Metadata = buildPublicPageMetadata({
  title: 'ديوان شعر قبيلة السياحين',
  description,
  path: '/poetry/',
  keywords: ['قصائد السياحين', 'شعر قبيلة السياحين', 'ديوان السياحين', 'الشعر النبطي'],
});

export default async function PoetryIndexPage() {
  const entries = await getPublishedPoetryEntries();
  const poetryUrl = `${SITE_URL}/poetry/`;
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'ديوان الشعر', item: poetryUrl },
    ],
  };
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${poetryUrl}#webpage`,
    url: poetryUrl,
    name: `ديوان شعر قبيلة السياحين | ${SITE_NAME}`,
    description,
    inLanguage: 'ar-SA',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: entries.length,
      itemListElement: entries.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entry.title,
        url: `${SITE_URL}/poetry/${entry.id}/`,
      })),
    },
  };

  return (
    <div className="bg-ink min-h-screen py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-[1080px] mx-auto">
        <header className="mb-12 text-center space-y-space-4">
          <div className="mx-auto w-16 h-16 rounded-2xl border border-brass/25 bg-brass/10 flex items-center justify-center text-brass-lt">
            <BookOpen className="w-8 h-8" aria-hidden="true" />
          </div>
          <p className="font-kufi text-xs text-brass-lt/80">الموقع الرسمي لقبيلة السياحين</p>
          <h1 className="font-ruqaa text-4xl md:text-5xl text-brass-lt">ديوان شعر قبيلة السياحين</h1>
          <p className="text-sm md:text-base text-sand-dim max-w-[760px] mx-auto leading-loose">{description}</p>
        </header>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-brass/15 bg-ink-2/50 p-8 text-center">
            <p className="font-kufi text-sand-dim">لا توجد قصائد منشورة حاليًا.</p>
          </div>
        ) : (
          <section aria-labelledby="published-poetry-title" className="space-y-space-5">
            <h2 id="published-poetry-title" className="font-serif text-2xl text-sand font-bold">
              القصائد المنشورة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {entries.map((entry) => (
                <article key={entry.id} className="rounded-2xl border border-brass/15 bg-ink-2/60 p-5 md:p-6 space-y-space-3">
                  <h3 className="font-serif text-2xl text-brass-lt font-bold leading-relaxed">
                    <Link href={`/poetry/${entry.id}/`} className="hover:text-sand transition-colors">
                      {entry.title}
                    </Link>
                  </h3>
                  <p className="text-sm font-kufi text-sand-dim">الشاعر: {entry.poet_name}</p>
                  <p className="text-sm text-sand-dim leading-loose">{buildPoetryDescription(entry)}</p>
                  <Link
                    href={`/poetry/${entry.id}/`}
                    className="inline-flex items-center justify-center rounded-lg border border-brass/35 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/10 transition-colors"
                  >
                    قراءة القصة والقصيدة
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
    </div>
  );
}
