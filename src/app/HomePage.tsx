'use client';

import { useRouter } from 'next/navigation';
import { Hero } from '../components/layout/Hero';
import ScrollFilmCanvas from '../components/ScrollFilmCanvas';
import Link from 'next/link';
import { SITE_ROUTES, SECTION_TO_ROUTE } from '../lib/navigation';

export default function HomePage() {
  const router = useRouter();

  const scrollToSection = (id: string) => {
    const route = SECTION_TO_ROUTE[id] ?? `/#${id}`;
    router.push(route);
  };

  return (
    <>
      <Hero scrollToSection={scrollToSection} />
      <ScrollFilmCanvas />
      <section className="bg-ink py-20 md:py-28 lg:py-32 px-5 md:px-8 relative z-10">
        <div className="max-w-[1160px] mx-auto text-center">
          <span className="font-kufi text-xs md:text-sm text-brass-lt font-semibold tracking-widest">استكشف الديوان</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl mt-4 mb-6 text-sand font-serif leading-[1.4]">
            أقسام الموقع الرئيسية
          </h2>
          <p className="text-sand-dim text-sm md:text-base max-w-2xl mx-auto mb-12 leading-relaxed">
            اختر أحد الأقسام للاطلاع على المحتوى المفصّل والموثّق لكل جانب من جوانب إرث قبيلة السياحين.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SITE_ROUTES.filter((route) => route.id !== 'home').map((route) => (
              <Link
                key={route.id}
                href={route.href}
                className="group editorial-card interactive-lift rounded-2xl p-6 text-right transition-all duration-300 hover:border-brass/40 hover:shadow-glow-sm"
              >
                <span className="font-kufi text-xs text-brass-lt/80 tracking-wider">فصل {route.chapter ?? '—'}</span>
                <h3 className="font-serif text-xl md:text-2xl text-sand mt-2 mb-3 group-hover:text-brass-lt transition-colors">
                  {route.label}
                </h3>
                <p className="text-sand-dim text-sm leading-relaxed">
                  اكتشف المزيد عن {route.label} ومحتوياته المفصّلة.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
