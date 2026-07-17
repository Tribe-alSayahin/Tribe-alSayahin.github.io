'use client';

/**
 * Hero — مدخل ديوان قبيلة السياحين
 *
 * يحتل كامل الشاشة عند الدخول. تعتمد الخلفية على نمط السدو الذهبي
 * والتدرجات النحاسية، وتظهر لوحة المحتوى الرئيسية فوراً دون انتظار
 * أي عنصر ثقيل:
 *   ١. شارة «الموقع الرسمي» (خط Reem Kufi)
 *   ٢. اسم «قبيلة السياحين» كلمةً كلمة بحروف متشابكة (خط Aref Ruqaa)
 *   ٣. فاصل مزخرف ثم الجملة الفرعية (خط Amiri)
 *   ٤. زر أساسي ذهبي «استكشف الموقع» وزر ثانوي «شجرة النسب»
 *   ٥. شريط فصول سريعة للانتقال إلى كل فصل
 */
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  scrollToSection: (id: string) => void;
}

/* اسم القبيلة مقسّماً إلى كلمات كاملة — تبقى الحروف متشابكة داخل كل كلمة */
const TRIBE_NAME = 'قبيلة السياحين';
const TRIBE_WORDS = TRIBE_NAME.split(' ');

/* زوايا اللوحة النحاسية الأربع */
const PANEL_CORNERS = [
  'top-3 right-3 border-t border-r rounded-tr-xl',
  'top-3 left-3 border-t border-l rounded-tl-xl',
  'bottom-3 right-3 border-b border-r rounded-br-xl',
  'bottom-3 left-3 border-b border-l rounded-bl-xl',
] as const;

const CHAPTERS = [
  { id: 'jathum', label: 'الأصول' },
  { id: 'map', label: 'الديار' },
  { id: 'wasm', label: 'الهوية' },
  { id: 'timeline', label: 'التاريخ' },
  { id: 'news', label: 'المجتمع' },
] as const;

export function Hero({ scrollToSection }: HeroProps) {
  return (
    <section
      id="home"
      className="hero-atlas relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="مدخل الموقع الرسمي لقبيلة السياحين"
    >
      {/* ─── محتوى SEO مخفي بصرياً ─── */}
      <p className="sr-only">
        الموقع الرسمي لقبيلة السياحين (السيحاني) — توثيق النسب والديار والشعر والأرشيف الاستشراقي والأخبار والمناسبات
      </p>

      {/* ─── Vignette: تدرج مظلم حول الحواف يُثبّت مركزية المحتوى ─── */}
      <div
        className="hero-vignette absolute inset-0 pointer-events-none z-10"
        aria-hidden="true"
      />
      <div className="hero-pattern absolute inset-0 pointer-events-none z-10" aria-hidden="true" />
      <div className="dust-layer" aria-hidden="true" />

      {/* ─── لوحة المحتوى الرئيسية تظهر فوراً ─── */}
      <div
        className="hero-content-panel relative z-20 flex flex-col items-center text-center px-3 sm:px-6 md:px-12 py-6 sm:py-8 md:py-12 gap-3 sm:gap-5 select-none rounded-2xl md:rounded-[2.4rem] w-[min(95vw,780px)]"
      >
        {/* زوايا نحاسية مزخرفة للوحة */}
        {PANEL_CORNERS.map((pos) => (
          <span
            key={pos}
            className={`absolute w-7 h-7 border-brass/40 pointer-events-none ${pos}`}
            aria-hidden="true"
          />
        ))}

        {/* شارة رسمية */}
        <span
          className="inline-flex flex-col items-center gap-0.5 font-kufi text-[11px] md:text-xs tracking-[0.22em] text-brass-lt bg-brass/5 border border-brass/15 rounded-full px-5 py-2"
        >
          <span>الموقع الرسمي</span>
          <span className="text-[10px] md:text-[11px] tracking-[0.08em] text-brass-lt/90">لقبيلة السياحين</span>
        </span>

        {/* اسم القبيلة — كشف كلمةً كلمة بحروف متشابكة */}
        <h1
          className="font-ruqaa text-[clamp(2.6rem,8vw,5.6rem)] leading-[1.4] text-sand flex flex-wrap justify-center gap-x-5"
          dir="rtl"
        >
          {TRIBE_WORDS.map((word) => (
            <span
              key={word}
              className="inline-block hero-char-gold"
            >
              {word}
            </span>
          ))}
        </h1>

        {/* فاصل مزخرف: خيطان ذهبيان يكتنفان معيناً نحاسياً */}
        <div
          className="flex items-center gap-3 w-full max-w-[360px]"
          aria-hidden="true"
        >
          <span className="gold-hairline flex-1" />
          <span className="hero-divider-diamond" />
          <span className="gold-hairline flex-1" />
        </div>

        {/* الجملة الفرعية */}
        <p
          className="font-serif text-[clamp(0.95rem,2.2vw,1.25rem)] text-sand-dim max-w-[540px] leading-loose"
        >
          البوابة الرقمية الموثقة لقبيلة السياحين من الروقة من عتيبة —{' '}
          <span className="text-gold-gradient font-bold">إرث تالد وديار أصيلة</span>
        </p>

        {/* الأزرار */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 mt-2"
        >
          <button
            onClick={() => scrollToSection('jathum')}
            className="hero-primary-btn font-kufi text-sm tracking-[0.14em] px-9 py-3.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            aria-label="استكشف محتوى الموقع"
          >
            استكشف الموقع
          </button>
          <button
            onClick={() => scrollToSection('lineage')}
            className="font-kufi text-sm tracking-[0.14em] px-9 py-3.5 rounded-full text-brass-lt border border-brass/35 hover:border-brass/70 hover:bg-brass/5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            aria-label="الانتقال إلى شجرة النسب"
          >
            شجرة النسب
          </button>
        </div>

        {/* شريط الفصول السريعة */}
        <nav
          className="hero-chapter-bar w-full max-w-[520px]"
          aria-label="فصول الموقع الرئيسية"
        >
          {CHAPTERS.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => scrollToSection(chapter.id)}
              aria-label={`الانتقال إلى فصل ${chapter.label}`}
            >
              {chapter.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ─── إشارة التمرير لأسفل ─── */}
      <button
        onClick={() => scrollToSection('jathum')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-brass-lt/60 hover:text-brass-lt transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-full px-4 py-1"
        aria-label="التمرير لأسفل لاستكشاف الموقع"
      >
        <span className="font-kufi text-[10px] tracking-[0.22em]">تصفّح الديار</span>
        <span className="hero-scroll-line" aria-hidden="true" />
        <ChevronDown
          className="w-4 h-4 motion-safe:animate-bounce"
          aria-hidden="true"
        />
      </button>
    </section>
  );
}
