import { ScrollText, Compass, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { lazy, Suspense } from 'react';
import DuneSilhouette from '../DuneSilhouette';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Button } from '../ui/Button';
import { LINEAGE_DATA } from '../LineageTree/LineageTree.data';

const DesertCinematicBackground = lazy(() => import('../DesertCinematicBackground'));

/* مسار وسم «الباب الأصيل» المرجعي لقبيلة السياحين (متوافق مع WasmGallery) */
const WASM_PATH = 'M40,130 L40,70 L160,70 L160,130';

interface HeroProps {
  scrollToSection: (id: string) => void;
}

const HERO_STATS = [
  { value: `${LINEAGE_DATA.filter((entry) => entry.level === 1).length}+`, label: 'فخوذ في شجرة النسب' },
  { value: `${LINEAGE_DATA.length}+`, label: 'أعلام في شجرة النسب' }
];

const LINEAGE_CHAIN = ['قبيلة السياحين', 'المزاحمة', 'الروقة', 'عتيبة الهيلا'];

/* حركة ظهور متدرجة موحدة لعناصر النص */
const fadeUp = (delay: number, reduced: boolean) => ({
  initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const }
});

export function Hero({ scrollToSection }: HeroProps) {
  const prefersReduced = useReducedMotion();
  return (
    <section
      id="home"
      className="min-h-[760px] md:min-h-screen flex flex-col justify-between relative overflow-hidden px-5 md:px-8 pt-[138px] pb-0 z-10"
    >
      {/* عنوان للوصف SEO الداخلي */}
      <h1 className="sr-only">الموقع الرسمي لقبيلة السياحين — إرث تالد وديار أصيلة</h1>
      <p className="sr-only">توثيق النسب والديار والشعر والأرشيف الاستشراقي والأخبار والمناسبات</p>
      {/* سماء الليل النجدية: تدرج نيلي يهبط إلى حبر الصفحة */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,var(--indigo)_0%,transparent_55%),linear-gradient(to_bottom,#0b0f17_0%,var(--ink)_100%)]"
        aria-hidden="true"
      />

      {/* خلفية صحراوية سينمائية */}
      <Suspense fallback={null}>
        <DesertCinematicBackground />
      </Suspense>

      {/* نسيج السدو الخافت */}
      <div
        className="absolute inset-0 bg-repeat opacity-[0.05] pointer-events-none select-none"
        style={{ backgroundImage: 'var(--sadu)', backgroundSize: '88px 52px' }}
        aria-hidden="true"
      />

      {/* خط سماوي ذهبي رفيع أعلى الصفحة */}
      <div className="absolute top-[92px] inset-x-6 gold-hairline opacity-60" aria-hidden="true" />

      <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-20 flex-grow">
        {/* اليسار بصرياً (الثاني في RTL): لوحة الوسم الفلكية */}
        <div className="lg:col-span-5 flex justify-center items-center relative min-h-[340px] md:min-h-[440px] order-1 lg:order-2">
          <motion.div
            className="relative w-72 h-72 md:w-[380px] md:h-[380px] flex items-center justify-center"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* حلقة الأسطرلاب الخارجية بعلامات الدرجات */}
            <div
              className={`absolute inset-0 rounded-full border border-brass/40 flex items-center justify-center shadow-[0_0_45px_rgba(201,162,75,0.12)] ${prefersReduced ? '' : 'animate-[spin_240s_linear_infinite]'}`}
            >
              {[...Array(36)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-[1px] ${i % 3 === 0 ? 'h-3.5 bg-brass/60' : 'h-2 bg-brass/30'}`}
                  style={{ transform: `rotate(${i * 10}deg) translateY(-138px)` }}
                />
              ))}
            </div>

            {/* حلقة وسطى منقّطة عكسية الدوران */}
            <div
              className={`absolute inset-6 rounded-full border border-dashed border-brass/20 ${prefersReduced ? '' : 'animate-[spin_150s_linear_infinite_reverse]'}`}
              aria-hidden="true"
            />

            {/* صفيحة الليل النيلية حاملة الوسم */}
            <div className="absolute w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full border border-indigo/60 bg-[radial-gradient(circle_at_35%_25%,rgba(24,39,66,0.85),rgba(11,14,20,0.9))] shadow-[inset_0_0_45px_rgba(24,39,66,0.8)] flex items-center justify-center overflow-hidden">
              {/* نجوم خافتة */}
              <div className="absolute inset-0 bg-grid-pattern opacity-20 rounded-full" />

              {/* وسم «الباب الأصيل» يُرسم عند الدخول */}
              <svg
                className="w-[60%] h-[60%] drop-shadow-[0_0_16px_rgba(201,162,75,0.5)]"
                viewBox="0 0 200 200"
                fill="none"
                aria-hidden="true"
              >
                <motion.path
                  d={WASM_PATH}
                  stroke="var(--brass-lt)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={prefersReduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.4 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={prefersReduced ? { duration: 0 } : { duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                />
                {!prefersReduced && (
                  <motion.path
                    d={WASM_PATH}
                    stroke="var(--brass)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
                  />
                )}
              </svg>
            </div>

            {/* المحور المركزي */}
            <div className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-brass to-brass-lt border border-sand/60 shadow-[0_0_22px_rgba(201,162,75,0.6)] flex items-center justify-center z-20">
              <div className="w-2 h-2 rounded-full bg-ink" />
            </div>

            {/* هالة خارجية */}
            <div className="absolute -inset-12 bg-radial from-brass/5 to-transparent blur-2xl rounded-full pointer-events-none" />
          </motion.div>
        </div>

        {/* اليمين بصرياً (الأول في RTL): النص والدعوات */}
        <div className="lg:col-span-7 text-right flex flex-col justify-center order-2 lg:order-1 hero-panel rounded-[2rem] p-6 md:p-10 lg:p-12">
          {/* السطر التمهيدي */}
          <motion.div {...fadeUp(0.05, prefersReduced)} className="flex items-center gap-3 mb-7">
            <span className="w-9 h-9 rounded-md border border-brass/35 bg-brass/5 flex items-center justify-center shrink-0" aria-hidden="true">
              <svg viewBox="0 0 200 200" className="w-4.5 h-4.5" stroke="var(--brass)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d={WASM_PATH} />
              </svg>
            </span>
            <span className="flex flex-col gap-0.5 font-kufi text-brass-lt">
              <span className="text-xs md:text-sm font-semibold tracking-[0.16em]">الباب الأصيل</span>
              <span className="text-[10px] md:text-xs text-brass-lt/75">وسم الباب بنسبة 3 × 1.5</span>
            </span>
            <span className="gold-hairline-start flex-1 min-w-8 mt-0.5" aria-hidden="true" />
          </motion.div>

          {/* العنوان الرئيسي بخط الرقعة */}
          <motion.h1
            {...fadeUp(0.15, prefersReduced)}
            className="font-ruqaa text-[2.6rem] md:text-6xl lg:text-[4.4rem] leading-[1.5] md:leading-[1.45] text-sand mb-6"
          >
            إرثٌ تالدٌ
            <br />
            <span className="text-gold-gradient">صاغتهُ ورسختهُ الديار</span>
          </motion.h1>

          {/* سلسلة النسب */}
          <motion.div
            {...fadeUp(0.28, prefersReduced)}
            className="flex flex-wrap items-center gap-x-2.5 gap-y-2 mb-6 font-kufi text-sm md:text-base text-sand-dim"
          >
            {LINEAGE_CHAIN.map((name, i) => (
              <span key={name} className="flex items-center gap-2.5">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-brass/50" aria-hidden="true" />}
                <span className={i === 0 ? 'text-brass-lt font-semibold' : ''}>{name}</span>
              </span>
            ))}
          </motion.div>

          <motion.p
            {...fadeUp(0.38, prefersReduced)}
            className="max-w-[600px] text-sand-dim text-base md:text-lg leading-loose mb-9 font-sans"
          >
            البوابة الرقمية الموثقة لقبيلة السياحين من الروقة من عتيبة — من تلال نجد الشامخة إلى وثائق الأرشيف الاستشراقي والتاريخ الشفهي.
          </motion.p>

          <motion.div {...fadeUp(0.48, prefersReduced)} className="flex gap-4 flex-wrap">
            <Button variant="primary" size="lg" onClick={() => scrollToSection('lineage')}>
              <ScrollText className="w-4 h-4" aria-hidden="true" />
              ديوان نسب القبيلة
            </Button>
            <Button variant="secondary" size="lg" onClick={() => scrollToSection('map')}>
              <Compass className="w-4 h-4" aria-hidden="true" />
              استكشاف ديار القبيلة
            </Button>
          </motion.div>

          {/* شريط الإحصاءات */}
          <motion.div {...fadeUp(0.6, prefersReduced)}>
            <div className="flex items-stretch justify-start divide-x divide-x-reverse divide-brass/15 border-y border-brass/15 mt-10 max-w-[560px]">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="text-right px-6 first:pr-0 py-4 flex-1">
                  <p className="font-ruqaa text-2xl md:text-[2rem] text-gold-gradient leading-tight">
                    {stat.value}
                  </p>
                  <p className="font-kufi text-[11px] md:text-xs text-sand-dim mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* إشارة التمرير */}
      <button
        onClick={() => scrollToSection('jathum')}
        className="hidden md:flex flex-col items-center gap-1 mx-auto mt-8 text-brass-lt/70 hover:text-brass-lt transition-colors duration-base relative z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-full px-4 py-1"
        aria-label="التمرير لأسفل لاستكشاف الموقع"
      >
        <span className="font-kufi text-[10px] tracking-[0.2em]">تصفّح الديار</span>
        <ChevronDown className={`w-4 h-4 ${prefersReduced ? '' : 'animate-bounce'}`} aria-hidden="true" />
      </button>

      {/* الكثبان الرملية أسفل الواجهة */}
      <div className="w-full mt-auto relative z-10">
        <DuneSilhouette />
      </div>
    </section>
  );
}
