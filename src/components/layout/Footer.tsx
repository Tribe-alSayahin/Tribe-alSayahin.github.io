import { BookOpen } from 'lucide-react';
import { LOCAL_REFS } from '../../lib/references';

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export function Footer({ scrollToSection }: FooterProps) {
  return (
    <footer className="section-surface bg-ink-2 border-t border-brass/15 py-20 md:py-24 px-5 md:px-8 relative z-10 text-center">
      <div className="section-divider absolute top-0 inset-x-0 -translate-y-1/2" aria-hidden="true" />
      <div className="max-w-[1160px] mx-auto">
        <section className="editorial-card max-w-[1040px] mx-auto mb-14 p-6 md:p-10 pb-12 border-b border-brass/15 text-right">
          <div className="text-center mb-8">
            <span className="font-kufi text-xs text-brass-lt font-semibold">مراجع قابلة للمراجعة</span>
            <h3 className="text-2xl md:text-3xl mt-1 text-sand font-serif">المصادر والمراجع التاريخية</h3>
            <div className="w-[60px] h-[2px] bg-brass/35 mx-auto mt-3" />
          </div>

          <div className="flex items-start gap-space-3 max-w-2xl mx-auto mb-space-8 p-space-4 rounded-2xl bg-brass/5 border border-brass/15">
            <BookOpen className="w-5 h-5 text-brass-lt shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs md:text-sm text-sand-dim leading-relaxed">
              تُعرض المراجع المتاحة بصيغتها الببليوغرافية فقط. لا تُعرض اقتباسات أو نماذج مصوّرة قبل التحقق من النسخ الأصلية.
            </p>
          </div>

          <ol className="space-y-space-4 text-right">
            {LOCAL_REFS.map((ref, index) => (
              <li
                key={ref.id}
                className="relative pr-12 pl-4 py-3 bg-ink-2 border border-brass/15 rounded-xl text-sand text-sm leading-relaxed"
              >
                <span className="absolute top-3.5 right-4 w-6 h-6 rounded-lg bg-brass/15 text-brass-lt border border-brass/20 flex items-center justify-center font-kufi text-xs">
                  {['١', '٢', '٣', '٤', '٥'][index] ?? index + 1}
                </span>
                {ref.author}، {ref.bookTitle}، الصفحات: {ref.pages}.
                <span className="block text-sand-dim text-xs mt-1">
                  {ref.publisher}، الطبعة الأولى {ref.year}.
                </span>
              </li>
            ))}
          </ol>
        </section>

        <a
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection('home');
          }}
          className="logo flex items-center justify-center gap-3 text-lg font-bold font-serif text-sand hover:text-brass-lt transition-colors mb-4 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none rounded-lg p-1 w-fit mx-auto"
        >
          <div className="w-10 h-10 rounded-lg border border-brass/40 bg-gradient-to-br from-brass/15 to-transparent flex items-center justify-center text-brass shadow-glow-sm p-2">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              stroke="currentColor"
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              aria-hidden="true"
            >
              <path d="M40,130 L40,70 L160,70 L160,130" />
            </svg>
          </div>
          <span className="flex flex-col items-start gap-1 leading-none text-right">
            <span className="font-kufi text-[10px] font-semibold tracking-[0.22em] text-brass-lt/85">
              الموقع الرسمي
            </span>
            <span className="font-kufi text-lg leading-none">قبيلة السياحين</span>
          </span>
        </a>
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
