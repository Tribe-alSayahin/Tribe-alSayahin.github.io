import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { getPublishedEvents } from '../../lib/events-server';

export const metadata: Metadata = {
  title: 'المناسبات والأحداث',
  description: 'أرشيف مناسبات قبيلة السياحين المصوّر: اللقاءات القبلية والاحتفالات الموسمية والتكريمات والفعاليات التراثية التي تجمع أبناء القبيلة.',
  alternates: { canonical: 'https://alsaihani.com/events/' },
  openGraph: {
    title: 'المناسبات والأحداث | قبيلة السياحين',
    description: 'أرشيف مناسبات قبيلة السياحين المصوّر: اللقاءات القبلية والاحتفالات الموسمية والتكريمات والفعاليات التراثية التي تجمع أبناء القبيلة.',
    url: 'https://alsaihani.com/events/',
    locale: 'ar_SA',
  },
};

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

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <main className="bg-ink min-h-screen py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-[1180px] mx-auto">
        <header className="mb-10 text-center">
          <p className="font-kufi text-xs text-brass-lt/80 mb-2">الموقع الرسمي لقبيلة السياحين</p>
          <h1 className="font-ruqaa text-4xl md:text-5xl text-brass-lt">المناسبات والأحداث</h1>
          <p className="mt-3 text-sm md:text-base text-sand-dim max-w-[760px] mx-auto leading-relaxed">
            توثيق بصري لمناسبات القبيلة وفعالياتها من اللقاءات والاحتفالات والتكريمات، مرتباً من الأحدث إلى الأقدم.
          </p>
        </header>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-brass/15 bg-ink-2/50 p-8 text-center">
            <p className="font-kufi text-sand-dim">لا توجد مناسبات منشورة حالياً.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {events.map((event) => (
              <article key={event.id} className="rounded-2xl overflow-hidden border border-brass/15 bg-ink-2/60">
                <div className="aspect-[4/3] bg-ink/40">
                  {event.cover_thumbnail_url ? (
                    <img
                      src={event.cover_thumbnail_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-kufi text-sand-dim">بدون صورة غلاف</div>
                  )}
                </div>

                <div className="p-4 md:p-5 space-y-3">
                  <h2 className="font-serif text-xl text-sand leading-relaxed line-clamp-2">{event.title}</h2>
                  <p className="text-sm text-sand-dim line-clamp-2">{event.summary}</p>

                  <div className="text-xs font-kufi text-brass-lt space-y-1">
                    <p className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{formatGregorianDateArabic(event.event_date_gregorian)}</p>
                    <p>{event.event_date_hijri}</p>
                    {event.location && (
                      <p className="inline-flex items-center gap-1.5 text-sand-dim"><MapPin className="w-3.5 h-3.5" />{event.location}</p>
                    )}
                  </div>

                  <Link
                    href={`/events/${event.slug}/`}
                    className="inline-flex items-center justify-center rounded-lg border border-brass/35 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/10 transition-colors"
                  >
                    عرض التفاصيل والألبوم
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
