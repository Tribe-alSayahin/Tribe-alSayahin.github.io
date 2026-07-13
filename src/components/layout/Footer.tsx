'use client';

import Link from 'next/link';
import { BookOpen, Mail } from 'lucide-react';
import { LOCAL_REFS } from '../../lib/references';
import { SITE_ROUTES } from '../../lib/navigation';
import { OFFICIAL_LOGO_IMAGE_URL } from '../../lib/branding';

export function Footer() {
  return (
    <footer className="section-surface bg-ink-2 border-t-2 border-brass/20 py-20 md:py-28 lg:py-32 px-5 md:px-8 relative z-10 text-center overflow-hidden">
      <div className="footer-sadu" aria-hidden="true" />
      <div className="section-divider absolute top-0 inset-x-0 -translate-y-1/2" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--brass)_10%,transparent),transparent_24rem),radial-gradient(circle_at_86%_78%,color-mix(in_srgb,var(--indigo)_18%,transparent),transparent_24rem)]" aria-hidden="true" />
      <div className="max-w-[1160px] mx-auto relative z-10">
        <section className="editorial-card max-w-[1040px] mx-auto mb-14 md:mb-16 p-6 sm:p-8 md:p-10 pb-12 border-b border-brass/20 text-right backdrop-blur-lg">
          <div className="text-center mb-8 md:mb-10">
            <span className="font-kufi text-xs md:text-sm text-brass-lt font-semibold tracking-widest">مراجع قابلة للمراجعة</span>
            <h3 className="text-xl sm:text-2xl md:text-3xl mt-2 text-sand font-serif leading-[1.4]">المصادر والمراجع التاريخية</h3>
            <div className="w-[60px] h-[2px] bg-brass/40 mx-auto mt-4" />
          </div>

          <div className="flex items-start gap-space-3 max-w-2xl mx-auto mb-space-8 p-space-4 rounded-2xl bg-brass/5 border border-brass/15">
            <BookOpen className="w-5 h-5 text-brass-lt shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs md:text-sm text-sand-dim leading-relaxed">
              تُعرض المراجع المتاحة بصيغتها الببليوغرافية فقط. لا تُعرض اقتباسات أو نماذج مصوّرة قبل التحقق من النسخ الأصلية.
            </p>
          </div>

          <ol className="grid gap-space-5 text-right sm:grid-cols-2">
            {LOCAL_REFS.map((ref, index) => (
              <li
                key={ref.id}
                className="relative pr-12 pl-4 py-4 bg-ink-2/78 border border-brass/18 rounded-2xl text-sand text-sm leading-relaxed hover:border-brass/40 hover:shadow-glow-sm transition-all duration-300"
              >
                <span className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-brass/12 text-brass-lt border border-brass/25 flex items-center justify-center font-kufi text-xs font-semibold">
                  {['١', '٢', '٣', '٤', '٥'][index] ?? index + 1}
                </span>
                {ref.author}، {ref.bookTitle}، الصفحات: {ref.pages}.
                <span className="block text-sand-dim text-xs mt-2 opacity-80">
                  {ref.publisher}، الطبعة الأولى {ref.year}.
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div className="footer-links">
          {SITE_ROUTES.map((link) => (
            <Link
              key={link.id}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:admin@alsaihani.com"
            className="inline-flex items-center gap-1.5 text-brass-lt hover:text-brass"
            aria-label="مراسلة إدارة الموقع"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            admin@alsaihani.com
          </a>
        </div>

        <Link
          href="/"
          className="logo flex items-center justify-center gap-3 text-lg font-bold font-serif text-sand hover:text-brass-lt transition-colors mb-4 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none rounded-lg p-1 w-fit mx-auto"
        >
          <div className="w-10 h-10 rounded-lg border border-brass/50 bg-ink/70 flex items-center justify-center shadow-glow-sm overflow-hidden">
            <img
              src={OFFICIAL_LOGO_IMAGE_URL}
              alt="شعار قبيلة السياحين"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="flex flex-col items-start gap-1 leading-none text-right">
            <span className="font-kufi text-[10px] font-semibold tracking-[0.22em] text-brass-lt/85">
              الموقع الرسمي
            </span>
            <span className="font-kufi text-lg leading-none">قبيلة السياحين</span>
          </span>
        </Link>
        <p className="text-sand-dim text-sm">
          © {new Date().getFullYear()} الموقع الرسمي لقبيلة السياحين — جميع الحقوق محفوظة
        </p>
        <p className="font-kufi text-xs text-brass-lt/70 tracking-wider mt-2">
          من المزاحمة • من الروقة • من عتيبة الهيلا
        </p>
      </div>
    </footer>
  );
}
