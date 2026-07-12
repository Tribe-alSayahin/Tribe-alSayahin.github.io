import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostBySlug } from '../../../lib/posts';

const siteUrl = 'https://alsaihani.com';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  if (slugs.length > 0) {
    return slugs.map((post) => ({ slug: post.slug }));
  }
  // fallback placeholder for static export when no published posts exist yet
  return [{ slug: 'no-posts' }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'الخبر غير موجود' };

  return {
    title: post.title,
    description: post.content.slice(0, 160).replace(/\s+/g, ' '),
    alternates: { canonical: `/news/${slug}/` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.content.slice(0, 160).replace(/\s+/g, ' '),
      url: `/news/${slug}/`,
      images: post.featured_image ? [post.featured_image] : ['/og-image.png'],
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: ['الموقع الرسمي لقبيلة السياحين'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.slice(0, 160).replace(/\s+/g, ' '),
      images: post.featured_image ? [post.featured_image] : ['/og-image.png'],
    },
  };
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.content.slice(0, 160).replace(/\s+/g, ' '),
    image: post.featured_image ?? `${siteUrl}/og-image.png`,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'الموقع الرسمي لقبيلة السياحين',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'الموقع الرسمي لقبيلة السياحين',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/news/${slug}/`,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'الأخبار والمناسبات', item: `${siteUrl}/news/` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteUrl}/news/${slug}/` },
    ],
  };

  return (
    <article className="bg-ink min-h-screen py-24 md:py-32 px-5 md:px-8 relative z-10">
      <div className="max-w-[800px] mx-auto">
        <header className="mb-10">
          <span className="font-kufi text-xs text-brass-lt/80 tracking-wider">
            {post.kind === 'event' ? 'مناسبة' : 'خبر'}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sand mt-3 leading-tight">
            {post.title}
          </h1>
          <time className="block mt-4 text-sand-dim text-sm" dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.event_date && (
            <p className="mt-2 text-brass-lt text-sm font-kufi">
              موعد الفعالية:{' '}
              {new Date(post.event_date).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </header>

        {post.featured_image && (
          <Image
            src={post.featured_image}
            alt={post.title}
            width={1200}
            height={640}
            className="w-full rounded-2xl border border-brass/15 mb-10 object-cover"
            loading="eager"
            unoptimized
          />
        )}

        <div
          className="prose prose-lg max-w-none text-sand leading-loose font-sans"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </article>
  );
}
