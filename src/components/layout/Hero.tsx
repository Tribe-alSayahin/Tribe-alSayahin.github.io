/**
 * Hero — المشهد الافتتاحي لموقع قبيلة السياحين
 *
 * يحتل كامل الشاشة عند الدخول. يُشغِّل الشعار الثلاثي الأبعاد «وسم الباب»
 * كخلفية، ثم بعد اكتمال حركة الكاميرا الافتتاحية يكشف:
 *   ١. اسم «قبيلة السياحين» حرفاً بحرف (خط Aref Ruqaa)
 *   ٢. جملة فرعية (خط Amiri)
 *   ٣. زر «استكشف» بحد ذهبي يمتلئ عند التمرير
 *
 * لا توجد عناصر إضافية في هذا القسم — قوة النقاء تحمي الشعار.
 */
import { useState, lazy, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const TribalEmblem3D = lazy(() => import('../TribalEmblem3D'));

interface HeroProps {
  scrollToSection: (id: string) => void;
}

/* اسم القبيلة مقسّماً إلى حروف فردية للكشف المتدرج */
const TRIBE_NAME = 'قبيلة السياحين';
const TRIBE_CHARS = Array.from(TRIBE_NAME);

export function Hero({ scrollToSection }: HeroProps) {
  const prefersReduced = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);

  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  /* مدة ظهور كل حرف */
  const charDelay = prefersReduced ? 0 : 0.055;
  const charDuration = prefersReduced ? 0 : 0.55;

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="مدخل الموقع الرسمي لقبيلة السياحين"
    >
      {/* ─── محتوى SEO مخفي بصرياً ─── */}
      <h1 className="sr-only">الموقع الرسمي لقبيلة السياحين — إرث تالد وديار أصيلة</h1>
      <p className="sr-only">توثيق النسب والديار والشعر والأرشيف الاستشراقي والأخبار والمناسبات</p>

      {/* ─── الشعار الثلاثي الأبعاد (خلفية كاملة الشاشة) ─── */}
      <Suspense fallback={null}>
        <TribalEmblem3D
          onIntroDone={handleIntroDone}
          fullscreen
        />
      </Suspense>

      {/* ─── Vignette: تدرج مظلم حول الحواف يُثبّت مركزية الشعار ─── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(7,5,3,0.72) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ─── طبقة نص تظهر بعد اكتمال حركة الكاميرا ─── */}
      <AnimatePresence>
        {introDone && (
          <motion.div
            key="hero-text"
            className="relative z-20 flex flex-col items-center text-center px-6 gap-6 select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* اسم القبيلة — كشف حرفاً بحرف */}
            <div
              className="font-ruqaa text-[clamp(2.6rem,8vw,6rem)] leading-[1.4] text-sand flex flex-wrap justify-center"
              aria-label={TRIBE_NAME}
              dir="rtl"
            >
              {TRIBE_CHARS.map((char, i) => (
                <motion.span
                  key={i}
                  initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: charDuration,
                    delay: i * charDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={char === ' ' ? 'inline-block w-4' : 'inline-block'}
                  style={
                    char !== ' '
                      ? {
                          background:
                            'linear-gradient(120deg,#d4af37 0%,#ebd481 45%,#d4af37 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                          filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.55))',
                        }
                      : undefined
                  }
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* الجملة الفرعية */}
            <motion.p
              className="font-serif text-[clamp(0.9rem,2.2vw,1.2rem)] text-sand-dim max-w-[520px] leading-loose"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: prefersReduced ? 0 : TRIBE_CHARS.length * charDelay + 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              البوابة الرقمية الموثقة لقبيلة السياحين من الروقة من عتيبة — إرث تالد وديار أصيلة
            </motion.p>

            {/* زر «استكشف» */}
            <motion.button
              onClick={() => scrollToSection('jathum')}
              className="hero-explore-btn font-kufi text-sm tracking-[0.18em] px-9 py-3.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.65,
                delay: prefersReduced ? 0 : TRIBE_CHARS.length * charDelay + 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={prefersReduced ? {} : { scale: 1.04 }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
              aria-label="استكشف محتوى الموقع"
            >
              استكشف
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── إشارة التمرير لأسفل ─── */}
      <AnimatePresence>
        {introDone && (
          <motion.button
            key="scroll-hint"
            onClick={() => scrollToSection('jathum')}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-brass-lt/60 hover:text-brass-lt transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-full px-4 py-1"
            aria-label="التمرير لأسفل لاستكشاف الموقع"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: prefersReduced ? 0 : TRIBE_CHARS.length * charDelay + 0.7,
            }}
          >
            <span className="font-kufi text-[10px] tracking-[0.22em]">تصفّح الديار</span>
            <ChevronDown
              className={`w-4 h-4 ${prefersReduced ? '' : 'animate-bounce'}`}
              aria-hidden="true"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
