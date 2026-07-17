import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPoetryIds, getPublishedPoetryById } from '../../../lib/poetry-server';
import { buildPoetryDescription, splitPoetryLines } from '../../../lib/poetry-seo';
import { buildPublicPageMetadata, SITE_NAME, SITE_URL } from '../../../lib/site-metadata';

interface PoetryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const entries = await getAllPoetryIds();
  return entries.length > 0 ? entries : [{ id: 'no-poems' }];
}

export async function generateMetadata({ params }: PoetryPageProps): Promise<Metadata> {
  const { id } = await params;
  const entry = await getPublishedPoetryById(id);

  if (!entry) {
    return { title: 'القصيدة غير موجودة', robots: { index: false, follow: false } };
  }

  return buildPublicPageMetadata({
    title: `${entry.title} — ${entry.poet_name}`,
    description: buildPoetryDescription(entry),
    path: `/poetry/${entry.id}/`,
    keywords: [entry.title, entry.poet_name, 'قصائد السياحين', 'الشعر النبطي'],
  });
}

export default async function PoetryDetailPage({ params }: PoetryPageProps) {
  const { id } = await params;
  const entry = await getPublishedPoetryById(id);
  if (!entry) notFound();

  const pageUrl = `${SITE_URL}/poetry/${entry.id}/`;
  const storyParagraphs = (entry.story ?? '').split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const poemLines = splitPoetryLines(entry.poem_text);
  const description = buildPoetryDescription(entry);
  const creativeWorkLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${pageUrl}#poem`,
    url: pageUrl,
    name: entry.title,
    description,
    text: entry.poem_text,
    author: { '@type': 'Person', name: entry.poet_name },
    genre: 'الشعر النبطي',
    inLanguage: 'ar-SA',
    dateCreated: entry.created_at,
    dateModified: entry.updated_at,
    citation: entry.source || undefined,
    isPartOf: { '@id': `${SITE_URL}/poetry/#webpage` },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'ديوان الشعر', item: `${SITE_URL}/poetry/` },
      { '@type': 'ListItem', position: 3, name: entry.title, item: pageUrl },
    ],
  };

  return (
    <div className="bg-ink min-h-screen py-24 md:py-32 px-5 md:px-8">
      <article className="max-w-[860px] mx-auto space-y-space-8">
        <header className="text-center space-y-space-4">
          <Link href="/poetry/" className="font-kufi text-sm text-brass-lt hover:text-sand transition-colors">
            العودة إلى ديوان الشعر
          </Link>
          <h1 className="font-ruqaa text-4xl md:text-5xl text-brass-lt leading-relaxed">{entry.title}</h1>
          <p className="font-kufi text-sand-dim">الشاعر: {entry.poet_name}</p>
        </header>

        {storyParagraphs.length > 0 && (
          <section aria-labelledby="poem-story" className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5 md:p-8">
            <h2 id="poem-story" className="font-serif text-2xl text-brass-lt font-bold mb-space-4">قصة القصيدة</h2>
            <div className="space-y-space-3 text-sand-dim leading-loose font-serif text-lg">
              {storyParagraphs.map((paragraph, index) => <p key={`${entry.id}-story-${index}`}>{paragraph}</p>)}
            </div>
          </section>
        )}

        <section aria-labelledby="poem-text" className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5 md:p-8">
          <h2 id="poem-text" className="font-serif text-2xl text-brass-lt font-bold mb-space-5">نص القصيدة</h2>
          <div className="space-y-space-3 text-sand leading-loose text-lg md:text-xl font-serif">
            {poemLines.map((line, index) => <p key={`${entry.id}-line-${index}`} className="text-center">{line}</p>)}
          </div>
          {entry.source && (
            <p className="mt-space-6 border-t border-brass/10 pt-space-4 text-sm font-kufi text-sand-dim">المصدر: {entry.source}</p>
          )}
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </div>
  );
}
