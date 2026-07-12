import { motion } from 'motion/react';

interface SectionHeaderProps {
  serialNumber: string; // e.g., "٠١", "٠٢", "٠٣"
  badgeText: string;    // e.g., "النسب والجذر", "الخلاصة الكوكبية"
  title: string;
  description: string;
  /** رقم الفصل (يُعرض كشارة صغيرة) */
  chapterNumber?: number;
}

const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢', '١٣', '١٤', '١٥'];

function toArabicNumeral(n: number): string {
  return String(n)
    .split('')
    .map((d) => ARABIC_NUMERALS[Number(d)] ?? d)
    .join('');
}

export function SectionHeader({
  serialNumber,
  badgeText,
  title,
  description,
  chapterNumber,
}: SectionHeaderProps) {
  return (
    <div className="relative z-10 mb-10 sm:mb-12 md:mb-16 lg:mb-20 select-none text-right overflow-hidden">
      {/* الرقم الشبحي الكبير — يجلس في الطرف الأيسر مقابل الترويسة */}
      <div
        className="section-ghost-num absolute left-0 -top-2 sm:top-0 md:-top-6 font-ruqaa text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[11rem] leading-none text-brass/[0.08] pointer-events-none"
        aria-hidden="true"
      >
        {serialNumber}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-3xl"
      >
        {/* زخرفة نحاسية علوية */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-brass/40 to-transparent" aria-hidden="true" />
          {chapterNumber !== undefined && (
            <span className="font-kufi text-[10px] text-brass/80 border border-brass/30 rounded-full px-2 py-0.5">
              الفصل {toArabicNumeral(chapterNumber)}
            </span>
          )}
          <div className="w-1.5 h-1.5 rounded-full bg-brass/60" aria-hidden="true" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brass/40 to-transparent" aria-hidden="true" />
        </div>

        {/* سطر الشارة: رقم القسم + التسمية + خط يمتد حتى نهاية السطر */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          <span
            className="font-ruqaa text-xs sm:text-sm text-brass border border-brass/40 rounded-xl w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gradient-to-br from-brass/15 to-brass/[0.04] shrink-0 shadow-glow-sm"
            aria-hidden="true"
          >
            {serialNumber}
          </span>
          <span className="section-kicker text-[10px] sm:text-xs md:text-sm tracking-[0.15em] text-brass-lt/90 font-semibold">
            {badgeText}
          </span>
          <span className="gold-hairline-start flex-1 min-w-8 mt-0.5 opacity-60" aria-hidden="true" />
        </div>

        <h2 className="font-ruqaa text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-sand leading-[1.35] sm:leading-[1.4] tracking-tight max-w-[780px]">
          {title}
        </h2>

        {description && (
          <p className="max-w-[650px] mt-4 sm:mt-5 md:mt-6 text-sand-dim text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose font-sans border-r-2 border-brass/40 pr-4 sm:pr-5">
            {description}
          </p>
        )}
      </motion.div>
    </div>
  );
}
