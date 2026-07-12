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
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

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
  const prefersReduced = useReducedMotion();

  /* مدة ظهور كل كلمة */
  const wordDelay = prefersReduced ? 0 : 0.28;
  const wordDuration = prefersReduced ? 0 : 0.7;
  const afterName = prefersReduced ? 0 : TRIBE_WORDS.length * wordDelay;

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
      <motion.div
        className="hero-content-panel relative z-20 flex flex-col items-center text-center px-3 sm:px-6 md:px-12 py-6 sm:py-8 md:py-12 gap-3 sm:gap-5 select-none rounded-2xl md:rounded-[2.4rem] w-[min(95vw,780px)]"
        initial={{ opacity: 0, y: prefersReduced ? 0 : 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
        <motion.span
          className="font-kufi text-[11px] md:text-xs tracking-[0.28em] text-brass-lt bg-brass/5 border border-brass/15 rounded-full px-5 py-1.5"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          الموقع الرسمي — الروقة من عتيبة
        </motion.span>

        {/* اسم القبيلة — كشف كلمةً كلمة بحروف متشابكة */}
        <motion.h1
          className="font-ruqaa text-[clamp(2.6rem,8vw,5.6rem)] leading-[1.4] text-sand flex flex-wrap justify-center gap-x-5"
          dir="rtl"
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {TRIBE_WORDS.map((word, i) => (
            <motion.span
              key={i}
              initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: wordDuration,
                delay: i * wordDelay,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block hero-char-gold"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* فاصل مزخرف: خيطان ذهبيان يكتنفان معيناً نحاسياً */}
        <motion.div
          className="flex items-center gap-3 w-full max-w-[360px]"
          aria-hidden="true"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: afterName, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="gold-hairline flex-1" />
          <span className="hero-divider-diamond" />
          <span className="gold-hairline flex-1" />
        </motion.div>

        {/* الجملة الفرعية */}
        <motion.p
          className="font-serif text-[clamp(0.95rem,2.2vw,1.25rem)] text-sand-dim max-w-[540px] leading-loose"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: afterName + 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          البوابة الرقمية الموثقة لقبيلة السياحين من الروقة من عتيبة —{' '}
          <span className="text-gold-gradient font-bold">إرث تالد وديار أصيلة</span>
        </motion.p>

        {/* الأزرار */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mt-2"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            delay: afterName + 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.button
            onClick={() => scrollToSection('jathum')}
            className="hero-primary-btn font-kufi text-sm tracking-[0.14em] px-9 py-3.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            whileHover={prefersReduced ? {} : { scale: 1.04, y: -2 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            aria-label="استكشف محتوى الموقع"
          >
            استكشف الموقع
          </motion.button>
          <motion.button
            onClick={() => scrollToSection('lineage')}
            className="font-kufi text-sm tracking-[0.14em] px-9 py-3.5 rounded-full text-brass-lt border border-brass/35 hover:border-brass/70 hover:bg-brass/5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            whileHover={prefersReduced ? {} : { scale: 1.04, y: -2 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            aria-label="الانتقال إلى شجرة النسب"
          >
            شجرة النسب
          </motion.button>
        </motion.div>

        {/* شريط الفصول السريعة */}
        <motion.nav
          className="hero-chapter-bar w-full max-w-[520px]"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: afterName + 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
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
        </motion.nav>
      </motion.div>

      {/* ─── إشارة التمرير لأسفل ─── */}
      <motion.button
        onClick={() => scrollToSection('jathum')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-brass-lt/60 hover:text-brass-lt transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-full px-4 py-1"
        aria-label="التمرير لأسفل لاستكشاف الموقع"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: afterName + 0.7,
        }}
      >
        <span className="font-kufi text-[10px] tracking-[0.22em]">تصفّح الديار</span>
        <span className="hero-scroll-line" aria-hidden="true" />
        <ChevronDown
          className={`w-4 h-4 ${prefersReduced ? '' : 'animate-bounce'}`}
          aria-hidden="true"
        />
      </motion.button>
    </section>
  );
}
