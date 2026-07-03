import { Sparkles } from 'lucide-react';
import DuneSilhouette from '../DuneSilhouette';

interface HeroProps {
  scrollToSection: (id: string) => void;
}

export function Hero({ scrollToSection }: HeroProps) {
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
        {/* Right: Elaborate Astrolabe Constellation Illustration (Renders first in RTL layout on the right) */}
        <div className="lg:col-span-5 flex justify-center items-center relative min-h-[360px] md:min-h-[460px] order-1 lg:order-2">
          <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Outer Brass Engraved Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-brass/45 flex items-center justify-center animate-[spin_180s_linear_infinite] shadow-[0_0_35px_rgba(212,175,55,0.15)]">
              {/* Simulated degree ticks */}
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[1px] h-3 bg-brass/45"
                  style={{ transform: `rotate(${i * 15}deg) translateY(-100%)` }}
                />
              ))}
            </div>

            {/* Medium Indigo Starry Celestial Plate */}
            <div className="absolute w-[270px] h-[270px] md:w-[320px] md:h-[320px] rounded-full border border-indigo/40 bg-[#162435]/35 shadow-[inset_0_0_30px_rgba(58,88,114,0.4)] flex items-center justify-center animate-[spin_90s_linear_infinite_reverse]">
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-grid-pattern opacity-15 rounded-full" />

              {/* Seven Lineage Names as Stars in an Arc */}
              <svg className="absolute inset-0 w-full h-full p-6 pointer-events-none" viewBox="0 0 100 100">
                {/* Glowing Connection lines */}
                <path
                  d="M 90,80 Q 75,50 50,45 T 10,20"
                  fill="none"
                  stroke="#ebd481"
                  strokeWidth="0.75"
                  strokeDasharray="2,2"
                  opacity="0.6"
                />
                {/* 7 Lineage Stars */}
                <circle cx="90" cy="80" r="2.5" fill="#d4af37" className="animate-pulse" />
                <circle cx="77" cy="65" r="2" fill="#ebd481" />
                <circle cx="63" cy="54" r="2" fill="#ebd481" />
                <circle cx="50" cy="45" r="3" fill="#ebd481" className="animate-pulse" />
                <circle cx="36" cy="35" r="2.2" fill="#ebd481" />
                <circle cx="22" cy="27" r="2" fill="#ebd481" />
                <circle cx="10" cy="20" r="3" fill="#ebd481" className="animate-pulse" />
              </svg>
            </div>

            {/* Center Rotational Axis & Medallion */}
            <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-brass to-brass-lt border-2 border-sand shadow-[0_0_20px_rgba(212,175,55,0.7)] flex items-center justify-center z-20">
              <div className="w-2.5 h-2.5 rounded-full bg-ink animate-ping" />
            </div>

            {/* Rotating Alidade Pointer (Brass Rule) */}
            <div className="absolute w-1 h-[310px] md:h-[370px] bg-gradient-to-b from-transparent via-brass/80 to-transparent rounded-full rotate-45 animate-[spin_45s_linear_infinite]" />

            {/* Surrounding constellation decorative glow */}
            <div className="absolute -inset-10 bg-radial from-brass/5 to-transparent blur-2xl rounded-full pointer-events-none" />
            <div className="absolute -inset-4 border border-brass/5 rounded-full pointer-events-none" />
          </div>
        </div>

        {/* Left: Text & CTAs (Renders second in RTL layout, visually on the left) */}
        <div className="lg:col-span-7 text-right flex flex-col justify-center order-2 lg:order-1">
          <div className="w-fit flex items-center gap-2.5 bg-indigo/25 border border-indigo/40 px-4 py-1.5 rounded-full text-xs font-semibold text-brass-lt font-kufi mb-6">
            <Sparkles className="w-4 h-4 text-brass-lt animate-pulse" />
            <span>المنصة التراثية والتوثيق المرجعي المعتمد</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold leading-[1.3] text-sand mb-4 text-right">
            إرثٌ تالدٌ صاغتهُ ورسختهُ الديار
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
            <button
              onClick={() => scrollToSection('lineage')}
              className="px-8 py-3.5 rounded-full font-bold text-base bg-gradient-to-r from-brass to-brass-lt text-ink hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(212,175,55,0.35)] active:scale-95 transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
            >
              ديوان نسب القبيلة
            </button>
            <button
              onClick={() => scrollToSection('map')}
              className="px-8 py-3.5 rounded-full font-bold text-base border-2 border-brass/35 text-brass-lt hover:bg-brass/10 hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
            >
              استكشاف ديار القبيلة
            </button>
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
