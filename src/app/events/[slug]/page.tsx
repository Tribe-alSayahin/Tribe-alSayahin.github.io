import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarDays, MapPin } from 'lucide-react';
import { EventLightbox } from '../../../components/events/EventLightbox';
import { getAllEventSlugs, getPublishedEventBySlug } from '../../../lib/events-server';

const siteUrl = 'https://alsaihani.com';

const formatGregorianDateArabic = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ar-SA-u-nu-arab', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  if (slugs.length > 0) {
    return slugs.map((entry) => ({ slug: entry.slug }));
  }

  return [{ slug: 'no-events' }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);

  if (!event) {
    return { title: 'المناسبة غير موجودة', robots: { index: false, follow: false } };
  }

  const canonicalUrl = `${siteUrl}/events/${slug}/`;

  return {
    title: event.title,
    description: event.summary,
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: { 'ar-SA': canonicalUrl, 'x-default': canonicalUrl },
    },
    openGraph: {
      type: 'article',
      locale: 'ar_SA',
      title: event.title,
      description: event.summary,
      url: canonicalUrl,
      images: event.cover_image_url ? [event.cover_image_url] : ['/og-image.png'],
      publishedTime: event.created_at,
      modifiedTime: event.updated_at,
      section: 'المناسبات والأحداث',
      tags: [event.title, 'المناسبات والأحداث', 'الموقع الرسمي لقبيلة السياحين'],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.summary,
      images: event.cover_image_url ? [event.cover_image_url] : [`${siteUrl}/og-image.png`],
    },
  };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const images = event.admin_event_images.length > 0
    ? event.admin_event_images
    : event.cover_image_url
      ? [{ id: 'cover', event_id: event.id, file_name: event.title, public_url: event.cover_image_url, thumbnail_url: event.cover_thumbnail_url ?? event.cover_image_url, sort_order: 0, is_cover: true }]
      : [];

  const eventLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.summary,
    startDate: event.event_date_gregorian,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: event.location
      ? {
          '@type': 'Place',
          name: event.location,
        }
      : undefined,
    image: images.map((image) => image.public_url),
    organizer: {
      '@type': 'Organization',
      name: 'الموقع الرسمي لقبيلة السياحين',
      url: siteUrl,
    },
    url: `${siteUrl}/events/${slug}/`,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'المناسبات', item: `${siteUrl}/events/` },
      { '@type': 'ListItem', position: 3, name: event.title, item: `${siteUrl}/events/${slug}/` },
    ],
  };

  return (
    <article className="bg-ink min-h-screen py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-[980px] mx-auto space-y-8">
        <header className="space-y-3">
          <p className="font-kufi text-xs text-brass-lt/80">الموقع الرسمي لقبيلة السياحين</p>
          <h1 className="font-ruqaa text-4xl md:text-5xl text-brass-lt leading-tight">{event.title}</h1>
          <p className="text-sand-dim leading-relaxed">{event.summary}</p>

          <div className="flex flex-wrap gap-4 text-sm font-kufi text-sand-dim">
            <p className="inline-flex items-center gap-1.5 text-brass-lt"><CalendarDays className="w-4 h-4" />{formatGregorianDateArabic(event.event_date_gregorian)}</p>
            <p>{event.event_date_hijri}</p>
            {event.location && (
              <p className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{event.location}</p>
            )}
          </div>
        </header>

        {event.cover_image_url && (
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="w-full max-h-[520px] object-cover rounded-2xl border border-brass/15"
            loading="eager"
          />
        )}

        <section className="rounded-2xl border border-brass/15 bg-ink-2/50 p-5 md:p-6">
          <h2 className="font-kufi text-lg text-brass-lt mb-3">تفاصيل المناسبة</h2>
          <p className="text-sand leading-loose whitespace-pre-line">{event.description}</p>
        </section>

        {images.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-kufi text-lg text-brass-lt">ألبوم الصور</h2>
            <EventLightbox images={images.map((image) => ({ url: image.public_url, alt: `${event.title} - ${image.file_name}` }))} />
          </section>
        )}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </article>
  );
}
