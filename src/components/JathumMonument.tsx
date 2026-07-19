'use client';

import { useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Landmark, MapPin, Crown, BookOpen, ScrollText } from 'lucide-react';
import { useRouter } from 'next/navigation';

import JathumWeatherCard from './JathumWeatherCard';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SECTION_TO_ROUTE } from '../lib/navigation';

interface JathumMonumentProps {
  scrollToSection?: (id: string) => void;
}

/** لوحات الحقائق النحاسية — أركان قصة التأسيس */
const foundingFacts = [
  {
    icon: Crown,
    label: 'المؤسس',
    value: 'الشيخ فرج بن مسيلم السيحاني',
    detail: 'من بيت الإمارة التاريخي — آل مسيلم من الزمايمة',
  },
  {
    icon: MapPin,
    label: 'الموقع',
    value: 'عالية نجد',
    detail: '٢٤٫٥٨° شمالاً — ٤٤٫٦١° شرقاً، في عالية نجد',
  },
  {
    icon: Landmark,
    label: 'المكانة',
    value: 'أول هجرة رسمية للقبيلة',
    detail: 'معقل الاستقرار وبداية التحضر وتشييد الديار',
  },
  {
    icon: BookOpen,
    label: 'التوثيق',
    value: 'معجم عالية نجد',
    detail: 'سعد بن جنيدل — ومدونات الرحالة والمستشرقين',
  },
];

/** مواقع نجوم السماء في المشهد */
const skyStars = [
  { cx: 90, cy: 60, r: 1.6 }, { cx: 180, cy: 110, r: 1.1 }, { cx: 260, cy: 45, r: 1.4 },
  { cx: 340, cy: 130, r: 1.0 }, { cx: 430, cy: 70, r: 1.5 }, { cx: 520, cy: 40, r: 1.1 },
  { cx: 610, cy: 100, r: 1.3 }, { cx: 700, cy: 55, r: 1.0 }, { cx: 800, cy: 90, r: 1.2 },
  { cx: 950, cy: 50, r: 1.4 }, { cx: 1060, cy: 95, r: 1.0 }, { cx: 1140, cy: 60, r: 1.3 },
];

/** الثريا — عنقود النجوم الذي تهتدي به البادية */
const thurayyaStars = [
  { cx: 0, cy: 0, r: 2.2 }, { cx: 14, cy: -8, r: 1.6 }, { cx: 26, cy: 2, r: 1.9 },
  { cx: 10, cy: 12, r: 1.4 }, { cx: 22, cy: 16, r: 1.2 }, { cx: -10, cy: 8, r: 1.5 },
];

export default function JathumMonument({ scrollToSection }: JathumMonumentProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const router = useRouter();

  const navigate = useCallback(
    (id: string) => {
      if (scrollToSection) {
        scrollToSection(id);
      } else {
        const route = SECTION_TO_ROUTE[id] ?? `/#${id}`;
        router.push(route);
      }
    },
    [scrollToSection, router]
  );

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start end', 'end start'],
  });

  // انزياح بطيء متمايز للطبقات — يمنح المشهد عمقاً أثناء التمرير
  const skyDrift = useTransform(scrollYProgress, [0, 1], [0, 26]);
  const duneDrift = useTransform(scrollYProgress, [0, 1], [0, -14]);
  const mountainDrift = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <div className="relative">
      {/* ——— البانوراما السينمائية: هضاب الجثوم والهجرة بجوارها ——— */}
      <div
        ref={sceneRef}
        role="img"
        aria-label="مشهد بانورامي لهضاب الجثوم وهجرة الجثوم بجوارها ليلاً تحت نجوم نجد"
        className="relative overflow-hidden rounded-2xl border border-brass/15 shadow-glow-sm"
      >
        <svg
          viewBox="0 0 1200 460"
          className="w-full h-[320px] md:h-[440px] block"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="jathum-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--indigo)" />
              <stop offset="70%" stopColor="var(--ink-2)" />
              <stop offset="100%" stopColor="var(--ink)" />
            </linearGradient>
            {/* هضاب الجثوم تبقى داكنة في الثيمين لإبراز المشهد الليلي */}
            <linearGradient id="jathum-mountain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2b2113" />
              <stop offset="45%" stopColor="#16100a" />
              <stop offset="100%" stopColor="#0a0705" />
            </linearGradient>
            <linearGradient id="jathum-ridge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--brass)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--brass)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--brass)" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="jathum-moonglow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--brass-lt)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--brass-lt)" stopOpacity="0" />
            </radialGradient>
            <filter id="jathum-window-glow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* السماء */}
          <rect x="0" y="0" width="1200" height="460" fill="url(#jathum-sky)" />

          {/* النجوم — طبقة تنزاح ببطء */}
          <motion.g style={reducedMotion ? undefined : { y: skyDrift }}>
            {skyStars.map((s, i) => (
              <circle
                key={i}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill="var(--sand)"
                opacity="0.7"
                className={reducedMotion ? '' : 'animate-pulse'}
                style={{ animationDelay: `${(i % 5) * 0.8}s`, animationDuration: '3.5s' }}
              />
            ))}
            {/* الثريا */}
            <g transform="translate(150, 150)">
              <circle cx="12" cy="4" r="30" fill="url(#jathum-moonglow)" opacity="0.35" />
              {thurayyaStars.map((s, i) => (
                <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="var(--brass-lt)" opacity="0.9" />
              ))}
            </g>
            {/* هلال بعيد */}
            <g transform="translate(1050, 120)">
              <circle cx="0" cy="0" r="42" fill="url(#jathum-moonglow)" />
              <path
                d="M -6 -18 A 19 19 0 1 0 -6 18 A 15 15 0 1 1 -6 -18 Z"
                fill="var(--brass-lt)"
                opacity="0.85"
              />
            </g>
          </motion.g>

          {/* كثبان بعيدة */}
          <motion.g style={reducedMotion ? undefined : { y: duneDrift }}>
            <path
              d="M0 340 Q 150 300 320 330 T 640 325 T 950 335 T 1200 320 V 460 H 0 Z"
              fill="var(--coffee)"
              opacity="0.55"
            />
            <path
              d="M0 365 Q 200 335 400 355 T 800 350 T 1200 358 V 460 H 0 Z"
              fill="var(--coffee)"
              opacity="0.8"
            />
          </motion.g>

          {/* هضاب الجثوم — شامخة بجوار الهجرة */}
          <motion.g style={reducedMotion ? undefined : { y: mountainDrift }}>
            <path
              d="M560 460 L640 330 L700 360 L780 220 L840 260 L920 150 L1000 230 L1060 190 L1130 280 L1200 250 V 460 Z"
              fill="url(#jathum-mountain)"
            />
            {/* خيط ضوء نحاسي على حافة القمة */}
            <path
              d="M780 220 L840 260 L920 150 L1000 230 L1060 190"
              fill="none"
              stroke="url(#jathum-ridge)"
              strokeWidth="2"
            />
          </motion.g>

          {/* أرض الهجرة الرملية */}
          <path d="M0 400 Q 300 385 600 395 T 1200 392 V 460 H 0 Z" fill="var(--coffee)" />

          {/* الطريق الممتد إلى الهجرة */}
          <path d="M330 460 L420 402 L444 402 L400 460 Z" fill="#14100b" />
          <path
            d="M368 460 L430 402"
            stroke="var(--brass)"
            strokeWidth="1.6"
            strokeDasharray="8 7"
            opacity="0.5"
            fill="none"
          />

          {/* بيوت الهجرة الطينية — نوافذها مضاءة بدفء النحاس */}
          <g>
            {/* بيت المجلس الكبير */}
            <rect x="452" y="358" width="86" height="44" rx="2" fill="#241a10" />
            <path d="M452 358 h86 v-6 h-8 v-5 h-10 v5 h-12 v-5 h-10 v5 h-12 v-5 h-10 v5 h-12 v-5 h-8 v5 h-4 Z" fill="#241a10" />
            <rect x="466" y="372" width="9" height="12" fill="var(--brass-lt)" filter="url(#jathum-window-glow)" />
            <rect x="490" y="372" width="9" height="12" fill="var(--brass-lt)" filter="url(#jathum-window-glow)" opacity="0.85" />
            <rect x="514" y="370" width="11" height="24" rx="5" fill="#0d0906" stroke="var(--brass)" strokeWidth="0.8" strokeOpacity="0.5" />

            {/* بيوت متدرجة */}
            <rect x="552" y="368" width="52" height="34" rx="2" fill="#1e1610" />
            <rect x="566" y="378" width="8" height="10" fill="var(--brass-lt)" filter="url(#jathum-window-glow)" opacity="0.9" />
            <rect x="586" y="378" width="8" height="10" fill="var(--brass-lt)" filter="url(#jathum-window-glow)" opacity="0.7" />

            <rect x="404" y="372" width="40" height="30" rx="2" fill="#1e1610" />
            <rect x="416" y="380" width="7" height="9" fill="var(--brass-lt)" filter="url(#jathum-window-glow)" opacity="0.8" />

            {/* مرقب الهجرة (برج المراقبة) */}
            <path d="M620 402 L624 340 L640 340 L644 402 Z" fill="#241a10" />
            <path d="M620 344 h28 v-6 h-6 v-4 h-6 v4 h-6 v-4 h-6 v4 h-4 Z" fill="#241a10" transform="translate(-1.5, 2)" />
            <rect x="628" y="352" width="7" height="9" fill="var(--brass-lt)" filter="url(#jathum-window-glow)" />

            {/* نخيل الهجرة */}
            <g fill="var(--olive-2)">
              <path d="M382 402 c -1 -14 -2 -22 -3 -30 l 3 0 c 2 8 2 16 3 30 Z" />
              <path d="M381 372 q -12 -8 -20 -4 q 10 -2 18 6 M381 372 q 12 -8 20 -4 q -10 -2 -18 6 M381 372 q -8 -12 -16 -12 q 8 -1 16 8 M381 372 q 8 -12 16 -12 q -8 -1 -16 8 M381 372 q 0 -12 -4 -18 q 5 4 6 16" />
              <path d="M672 402 c -1 -12 -2 -19 -3 -26 l 3 0 c 2 7 2 14 3 26 Z" />
              <path d="M671 376 q -11 -7 -18 -3 q 9 -2 16 5 M671 376 q 11 -7 18 -3 q -9 -2 -16 5 M671 376 q -7 -10 -14 -10 q 7 -1 14 7 M671 376 q 7 -10 14 -10 q -7 -1 -14 7" />
            </g>

            {/* بئر الهجرة القديم */}
            <g transform="translate(714, 384)">
              <rect x="0" y="8" width="22" height="10" rx="1" fill="#241a10" />
              <path d="M2 8 L11 -6 L20 8" stroke="#241a10" strokeWidth="2.5" fill="none" />
              <line x1="11" y1="-4" x2="11" y2="8" stroke="var(--brass)" strokeWidth="0.9" opacity="0.6" />
              <circle cx="11" cy="9" r="1.8" fill="var(--brass-lt)" opacity="0.75" />
            </g>
          </g>

          {/* شريط سدو سفلي يؤطر المشهد */}
          <rect x="0" y="452" width="1200" height="8" fill="var(--brass)" opacity="0.14" />
        </svg>

        {/* العنوان الضخم داخل المشهد */}
        <div className="absolute inset-0 flex flex-col items-start justify-start pt-8 md:pt-12 pr-8 md:pr-14 pointer-events-none">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-kufi text-[10px] md:text-xs tracking-[0.35em] text-brass-lt/90 mb-2"
          >
            ✦ حَيثُ بَدَأَ الاستِقرار ✦
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="font-serif font-bold text-6xl md:text-8xl leading-none text-gold-gradient drop-shadow-[0_4px_24px_rgba(212,175,55,0.35)]"
          >
            الجَثُوم
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-3 font-sans text-xs md:text-sm text-sand/85 max-w-[300px] md:max-w-[380px] leading-relaxed"
          >
            هِضابُ الجثومِ الشامخةُ التي احتضنت أولى هِجَر السياحين في نجد — هنا غُرست أوّلُ لَبِنة، ومن هنا امتدّت الديار.
          </motion.p>
        </div>
      </div>

      {/* ——— الصورة الميدانية: هضاب الجثوم والهجرة في عالية نجد ——— */}
      <motion.figure
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.75 }}
        className="group relative mt-6 overflow-hidden rounded-2xl border border-brass/20 bg-ink-2 shadow-glow-sm"
      >
        <div className="relative aspect-[4/3] md:aspect-[16/9]">
          <img
            src="/images/jathum-hills-diyar.webp"
            alt="هضاب الجثوم وهجرة الجثوم الممتدة أمامها في عالية نجد"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.015]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/15"
            aria-hidden="true"
          />
          <div
            className="absolute inset-3 rounded-xl border border-sand/10 md:inset-5"
            aria-hidden="true"
          />

          <span className="absolute right-5 top-5 rounded-full border border-brass/30 bg-ink/75 px-4 py-2 font-kufi text-[10px] tracking-[0.16em] text-brass-lt backdrop-blur-sm md:right-8 md:top-8 md:text-xs">
            مشهد من عالية نجد
          </span>

          <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 text-right md:p-10">
            <div>
              <p className="font-ruqaa text-3xl text-sand drop-shadow-lg md:text-5xl">
                هضاب الجثوم
              </p>
              <p className="mt-1 font-serif text-sm text-sand/80 md:text-lg">
                الهجرة التي كانت أساس الديار ومنطلق الاستقرار
              </p>
            </div>
            <span
              className="hidden h-px flex-1 bg-gradient-to-l from-brass/60 to-transparent sm:block"
              aria-hidden="true"
            />
          </figcaption>
        </div>
      </motion.figure>

      {/* ——— قصة التأسيس + لوحات الحقائق ——— */}
      <div className="grid md:grid-cols-[1.15fr_1fr] gap-8 md:gap-10 mt-10 items-start">
        {/* السرد التأسيسي */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative pr-5 border-r-2 border-brass/25"
        >
          <h4 className="font-serif font-bold text-2xl md:text-3xl text-sand mb-4 leading-snug">
            مِن هنا كانت <span className="text-gold-gradient">البداية</span>
          </h4>
          <p className="text-sand-dim leading-loose text-sm md:text-base mb-4">
            في عالية نجد، وبجوار هضاب الجثوم الشامخة، أسّس الشيخ
            <span className="text-brass-lt font-semibold"> فرج بن مسيلم السيحاني </span>
            أول هجرة رسمية لقبيلة السياحين — لتكون المعقل الرئيس ومقر الاستقرار،
            وبداية تحوّل أبناء البادية إلى تشييد المنازل والمزارع وحفر الآبار وتأمين موارد الماء.
          </p>
          <p className="text-sand-dim leading-loose text-sm md:text-base">
            تتوزع بيوت الهجرة الطينية والحديثة على رمال نجد الذهبية، ويقطعها طريق ممتد يعبر
            بالزائر إلى معقل الأصالة التاريخية للقبيلة. وما زالت الجثوم تحتفظ برمزيتها العميقة:
            <span className="text-brass-lt"> الأساس الذي قامت عليه بقية الديار</span>،
            ومنطلق التحضر الذي وثّقته المعاجم والمصادر.
          </p>

          {/* أزرار الاستكشاف */}
          <div className="flex flex-wrap gap-3 mt-7">
            <button
              onClick={() => navigate('map')}
              className="font-kufi text-sm font-semibold px-6 py-2.5 rounded-full bg-gradient-to-l from-brass to-brass-lt text-ink shadow-glow-sm hover:-translate-y-0.5 hover:shadow-glow-md transition-all cursor-pointer border-0 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
            >
              موقعها على خريطة الديار
            </button>
            <button
              onClick={() => navigate('gallery')}
              className="font-kufi text-sm font-semibold px-6 py-2.5 rounded-full bg-transparent text-brass-lt border border-brass/35 hover:bg-brass/10 hover:-translate-y-0.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
            >
              شواهدها في معرض التراث
            </button>
          </div>
        </motion.div>

        {/* لوحات الحقائق النحاسية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {foundingFacts.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="bg-ink border border-brass/15 rounded-xl p-5 hover:border-brass/35 hover:shadow-glow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-9 h-9 rounded-lg bg-brass/10 border border-brass/20 flex items-center justify-center group-hover:bg-brass/20 transition-colors">
                  <fact.icon className="w-4.5 h-4.5 text-brass-lt" aria-hidden="true" />
                </span>
                <span className="font-kufi text-[11px] tracking-wider text-sand-dim">{fact.label}</span>
              </div>
              <div className="font-serif font-bold text-base text-sand leading-snug mb-1.5">{fact.value}</div>
              <div className="text-xs text-sand-dim leading-relaxed">{fact.detail}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <JathumWeatherCard />

      {/* ——— شهادة المستشرق فيلبي ——— */}
      <motion.figure
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="mt-10 relative bg-ink border border-brass/15 rounded-2xl px-7 py-8 md:px-10 overflow-hidden"
      >
        <div
          className="absolute inset-x-0 top-0 h-[22px] opacity-40 bg-repeat"
          style={{ backgroundImage: 'var(--sadu)', backgroundSize: '44px 30px' }}
          aria-hidden="true"
        />
        <ScrollText className="w-7 h-7 text-brass/60 mb-4 mt-2" aria-hidden="true" />
        <blockquote className="font-serif text-lg md:text-2xl text-parchment leading-relaxed md:leading-loose">
          «تعتبر الجثوم هجرة تاريخية شهيرة استقر فيها فخذ السياحين من الروقة (عتيبة)، والذين
          عُرفوا بشجاعتهم وولائهم وإسهامهم الكبير في استقرار المنطقة وتأمين مسالك القوافل
          التجارية وموارد نجد الحيوية.»
        </blockquote>
        <figcaption className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-kufi text-sm text-brass-lt font-semibold">
            هاري سانت جون فيلبي — «مرتفعات الجزيرة العربية»، ١٩٢٢م
          </span>
          <span className="gold-hairline w-14 hidden md:block" aria-hidden="true" />
          <span className="font-kufi text-[10px] text-sand-dim bg-brass/5 border border-brass/10 rounded-full px-3 py-1">
            اقتباس مترجم — قيد المطابقة مع الطبعة الأولى
          </span>
        </figcaption>
      </motion.figure>
    </div>
  );
}
