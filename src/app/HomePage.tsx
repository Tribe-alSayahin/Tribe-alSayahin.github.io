'use client';

import Link from 'next/link';
import { Archive, ArrowLeft, Compass, Feather, GitBranch, MapPin, TreePine } from 'lucide-react';
import { SITE_ROUTES } from '../lib/navigation';

const PLACES = [
  { name: 'الجثوم', x: 18, y: 14 },
  { name: 'رهاط', x: 28, y: 31 },
  { name: 'الهمجة', x: 46, y: 48 },
  { name: 'العزيزية', x: 58, y: 66 },
  { name: 'الهواوية', x: 45, y: 84 },
] as const;

const EDITORIAL_ROUTES = SITE_ROUTES.filter((route) =>
  ['nasab', 'diyar', 'hawiya', 'tarikh'].includes(route.id),
);

const ICONS = {
  nasab: GitBranch,
  diyar: MapPin,
  hawiya: Feather,
  tarikh: Archive,
} as const;

export default function HomePage() {
  return (
    <main className="home-story bg-ink text-sand">
      <section className="home-story-hero" aria-labelledby="home-story-title">
        <div className="home-story-map" aria-label="مسار فني يربط مواطن قبيلة السياحين">
          <img
            src="/images/jathum-hills-hussain-alsaihani.jpg"
            alt="هضب الجثوم والسهول المحيطة به في عالية نجد"
            className="home-story-photo"
          />
          <div className="home-story-map-shade" aria-hidden="true" />
          <svg className="home-story-route" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M18 14 C18 24 27 23 28 31 S36 44 46 48 S54 57 58 66 S56 78 45 84 C38 90 43 97 49 100" />
          </svg>
          <ol className="home-story-places">
            {PLACES.map((place) => (
              <li key={place.name} style={{ insetInlineStart: `${place.x}%`, top: `${place.y}%` }}>
                <span aria-hidden="true" />
                {place.name}
              </li>
            ))}
          </ol>
          <a
            href="https://www.youtube.com/shorts/JJiUisKAH_I"
            className="home-story-credit"
            target="_blank"
            rel="noreferrer"
          >
            الصورة: حسين علي بعاج ابن مسيلم السيحاني
          </a>
        </div>

        <div className="home-story-intro">
          <p className="home-story-kicker">الموقع الرسمي لقبيلة السياحين</p>
          <h1 id="home-story-title" className="font-ruqaa">قبيلة السياحين</h1>
          <div className="home-story-rule" aria-hidden="true"><span /></div>
          <p className="font-serif">
            ديوان رقمي موثّق يجمع الديار والنسب والشعر والتاريخ في سيرة واحدة،
            تبدأ من الجثوم وتمتد في ذاكرة المكان.
          </p>
          <div className="home-story-actions">
            <Link href="/diyar/" className="home-story-primary">
              <Compass aria-hidden="true" /> استكشف الديار
            </Link>
            <Link href="/nasab/" className="home-story-secondary">
              <TreePine aria-hidden="true" /> شجرة النسب
            </Link>
          </div>
        </div>
      </section>

      <div className="home-story-sadu" aria-hidden="true" />

      <section className="home-story-index" aria-labelledby="home-story-index-title">
        <div className="home-story-tree" aria-hidden="true">
          <TreePine />
        </div>
        <div className="home-story-index-copy">
          <p className="home-story-kicker">فصول الديوان</p>
          <h2 id="home-story-index-title" className="font-ruqaa">مداخل السيرة</h2>
          <div className="home-story-rows">
            {EDITORIAL_ROUTES.map((route, index) => {
              const Icon = ICONS[route.id as keyof typeof ICONS];
              return (
                <Link key={route.id} href={route.href} className="home-story-row">
                  <span className="home-story-number">{String(index + 1).padStart(2, '0')}</span>
                  <Icon aria-hidden="true" />
                  <span className="home-story-row-title">{route.label}</span>
                  <span className="home-story-row-desc">{route.description}</span>
                  <ArrowLeft aria-hidden="true" className="home-story-arrow" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="home-story-paper-grid">
        <section className="home-story-parchment" aria-labelledby="place-story-title">
          <div className="home-story-place-map" aria-hidden="true">
            <span className="home-story-map-ring" />
            <span className="home-story-map-line" />
            <MapPin />
          </div>
          <div className="home-story-place-copy">
            <p className="home-story-paper-kicker">وثيقة المكان</p>
            <h2 id="place-story-title" className="font-ruqaa">سيرة المكان</h2>
            <p className="home-story-source">
              المصدر: حمد الجاسر، المعجم الجغرافي للبلاد العربية السعودية؛ وياقوت الحموي، معجم البلدان.
            </p>
            <Link href="/diyar/" className="home-story-paper-link">استكشف الديار <ArrowLeft aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="home-story-poetry" aria-labelledby="poetry-entry-title">
          <Feather aria-hidden="true" />
          <p className="home-story-paper-kicker">من الديوان الموثّق</p>
          <h2 id="poetry-entry-title" className="font-ruqaa">الشعر ذاكرة الديار</h2>
          <p>
            تُعرض القصائد في ديوان الشعر مع اسم الشاعر وسياق الرواية ومصدرها،
            حفاظًا على النص الموروث ونسبته الصحيحة.
          </p>
          <Link href="/hawiya/" className="home-story-paper-link">دخول ديوان الشعر <ArrowLeft aria-hidden="true" /></Link>
        </section>
      </div>
    </main>
  );
}
