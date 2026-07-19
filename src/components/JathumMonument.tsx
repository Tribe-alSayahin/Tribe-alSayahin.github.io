'use client';

import { useCallback } from 'react';
import { motion } from 'motion/react';
import { Landmark, MapPin, Crown, BookOpen, ScrollText } from 'lucide-react';
import { useRouter } from 'next/navigation';

import JathumWeatherCard from './JathumWeatherCard';
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

export default function JathumMonument({ scrollToSection }: JathumMonumentProps) {
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

  return (
    <div className="relative">
      {/* ——— الصورة الميدانية: هضاب الجثوم والهجرة في عالية نجد ——— */}
      <motion.figure
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.75 }}
        className="ornate-frame relative overflow-hidden rounded-xl bg-ink-2 p-1.5 shadow-glow-sm sm:p-2"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:aspect-[16/9]">
          <img
            src="/images/jathum-hills-diyar.webp"
            alt="هضاب الجثوم وهجرة الجثوم الممتدة أمامها في عالية نجد"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/25"
            aria-hidden="true"
          />
          <div className="sadu-band absolute inset-x-0 top-0 z-10" aria-hidden="true" />

          <div className="absolute inset-x-5 top-8 z-20 flex items-center gap-3 md:inset-x-8 md:top-10">
            <span className="shrink-0 border border-brass/30 bg-ink/80 px-3 py-1.5 font-kufi text-[10px] tracking-[0.16em] text-brass-lt backdrop-blur-sm md:text-xs">
              من مشاهد عالية نجد
            </span>
            <span className="gold-hairline h-px flex-1 opacity-60" aria-hidden="true" />
          </div>

          <figcaption className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-6 bg-gradient-to-t from-ink via-ink/85 to-transparent px-6 pb-6 pt-20 text-right md:px-10 md:pb-9 md:pt-28">
            <div>
              <p className="font-ruqaa text-3xl text-gold-gradient drop-shadow-lg md:text-5xl">
                هضاب الجثوم
              </p>
              <p className="mt-1 font-serif text-sm text-sand/80 md:text-lg">
                الهجرة التي كانت أساس الديار ومنطلق الاستقرار
              </p>
            </div>
            <div className="hidden min-w-44 items-center gap-3 sm:flex" aria-hidden="true">
              <span className="gold-hairline h-px flex-1" />
              <span className="font-kufi text-xs tracking-[0.16em] text-brass-lt">
                أساس الديار · ٠١
              </span>
            </div>
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
