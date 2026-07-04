import { Sparkles, ScrollText, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import DuneSilhouette from '../DuneSilhouette';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Button } from '../ui/Button';

/* مسار وسم «الباب الأصيل» المرجعي لقبيلة السياحين (متوافق مع WasmGallery) */
const WASM_PATH = 'M55,160 L55,60 L145,60 L145,160';

interface HeroProps {
  scrollToSection: (id: string) => void;
}

export function Hero({ scrollToSection }: HeroProps) {
  const prefersReduced = useReducedMotion();
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-between relative overflow-hidden px-6 pt-[120px] pb-0 z-10 bg-gradient-to-b from-[#0c0905] via-[#101824] to-ink"
    >
      {/* Subtle Sadu background decoration */}
      <div
        className="absolute inset-0 bg-repeat opacity-[0.04] pointer-events-none select-none"
        style={{ backgroundImage: 'var(--sadu)', backgroundSize: '88px 52px' }}
        aria-hidden="true"
      />

      {/* Ghost Background Folio Number Motif */}
      <div className="absolute right-4 md:right-12 top-[120px] text-[10rem] md:text-[18rem] font-serif font-extrabold text-brass/[0.03] select-none pointer-events-none leading-none">
        ٠١
      </div>

      <div className="max-w-[1160px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-20 flex-grow">
        {/* Right: Animated Tribal Wasm (Brand Mark) Illustration (Renders first in RTL layout on the right) */}
        <div className="lg:col-span-5 flex justify-center items-center relative min-h-[360px] md:min-h-[460px] order-1 lg:order-2">
          <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Outer Brass Engraved Ring */}
            <div className={`absolute inset-0 rounded-full border-2 border-brass/45 flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.15)] ${prefersReduced ? '' : 'animate-[spin_180s_linear_infinite]'}`}>
              {/* Simulated degree ticks */}
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[1px] h-3 bg-brass/45"
                  style={{ transform: `rotate(${i * 15}deg) translateY(-100%)` }}
                />
              ))}
            </div>

            {/* Medium Indigo Plate carrying the animated tribal Wasm mark */}
            <div className="absolute w-[270px] h-[270px] md:w-[320px] md:h-[320px] rounded-full border border-indigo/40 bg-[#162435]/35 shadow-[inset_0_0_30px_rgba(58,88,114,0.4)] flex items-center justify-center">
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-grid-pattern opacity-15 rounded-full" />

              {/* Animated Wasm (Tribal Brand Mark) — «الباب الأصيل» */}
              <svg
                className="w-[62%] h-[62%] drop-shadow-[0_0_14px_rgba(212,175,55,0.55)]"
                viewBox="0 0 200 200"
                fill="none"
                aria-hidden="true"
              >
                <motion.path
                  d={WASM_PATH}
                  stroke="#ebd481"
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
                    stroke="#d4af37"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ opacity: [0.35, 0.85, 0.35] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
                  />
                )}
              </svg>
            </div>

            {/* Center Rotational Axis & Medallion */}
            <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-brass to-brass-lt border-2 border-sand shadow-[0_0_20px_rgba(212,175,55,0.7)] flex items-center justify-center z-20">
              <div className={`w-2.5 h-2.5 rounded-full bg-ink ${prefersReduced ? '' : 'animate-ping'}`} />
            </div>

            {/* Surrounding constellation decorative glow */}
            <div className="absolute -inset-10 bg-radial from-brass/5 to-transparent blur-2xl rounded-full pointer-events-none" />
            <div className="absolute -inset-4 border border-brass/5 rounded-full pointer-events-none" />
          </div>
        </div>

        {/* Left: Text & CTAs (Renders second in RTL layout, visually on the left) */}
        <div className="lg:col-span-7 text-right flex flex-col justify-center order-2 lg:order-1">
          <div className="w-fit flex items-center gap-2.5 bg-indigo/25 border border-indigo/40 px-4 py-1.5 rounded-full text-xs font-semibold text-brass-lt font-kufi mb-6">
            <Sparkles className="w-4 h-4 text-brass-lt animate-pulse" />
            <span>الموقع الرسمي لقبيلة السياحين</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold leading-[1.3] text-sand mb-4 text-right">
            إرثٌ تالدٌ <span className="text-gold-gradient">صاغتهُ ورسختهُ الديار</span>
          </h1>

          <div className="font-kufi font-medium text-sm md:text-base text-brass-lt mb-5 flex flex-wrap items-center justify-start gap-x-3 gap-y-1.5 w-full text-right">
            <span>قبيلة السياحين</span>
            <span className="opacity-45">•</span>
            <span>من المزاحمة</span>
            <span className="opacity-45">•</span>
            <span>من الروقة</span>
            <span className="opacity-45">•</span>
            <span>من عتيبة الهيلا</span>
          </div>

          <p className="max-w-[620px] text-sand-dim text-base md:text-lg leading-relaxed mb-8 text-right font-sans">
            البوابة الرقمية الموثقة لقبيلة السياحين من الروقة من عتيبة - من تلال نجد الشامخة إلى وثائق الأرشيف الاستشراقي والديوان التفاعلي للشعر النبطي الأصيل ومحاكي شبة النار الرقمي.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Button
              variant="primary"
              size="lg"
              onClick={() => scrollToSection('lineage')}
            >
              <ScrollText className="w-4 h-4" aria-hidden="true" />
              ديوان نسب القبيلة
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection('map')}
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              استكشاف ديار القبيلة
            </Button>
          </div>
        </div>
      </div>

      {/* Parallax Dune landscape embedded at the very bottom of Hero */}
      <div className="w-full mt-auto relative z-10">
        <DuneSilhouette />
      </div>
    </section>
  );
}
