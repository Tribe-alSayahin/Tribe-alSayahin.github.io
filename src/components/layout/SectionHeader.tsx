import { motion } from 'motion/react';

interface SectionHeaderProps {
  serialNumber: string; // e.g., "٠١", "٠٢", "٠٣"
  badgeText: string;    // e.g., "النسب والجذر", "الخلاصة الكوكبية"
  title: string;
  description: string;
}

export function SectionHeader({
  serialNumber,
  badgeText,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="relative z-10 mb-16 select-none text-right scene-3d">
      {/* الرقم الشبحي الكبير — منحوت في عمق المشهد */}
      <div
        className="absolute left-0 -top-8 md:-top-14 font-ruqaa text-[7rem] md:text-[11rem] leading-none text-brass/[0.06] pointer-events-none text-carved-3d"
        aria-hidden="true"
      >
        {serialNumber}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative preserve-3d"
        style={{ transformOrigin: '50% 100%' }}
      >
        {/* سطر الشارة: رقم القسم + التسمية + خط يمتد حتى نهاية السطر */}
        <div className="flex items-center gap-4 mb-4">
          <span
            className="font-ruqaa text-sm text-brass border border-brass/30 rounded-md w-9 h-9 flex items-center justify-center bg-brass/5 shrink-0"
            aria-hidden="true"
          >
            {serialNumber}
          </span>
          <span className="font-kufi text-xs md:text-sm text-brass-lt font-semibold tracking-[0.18em]">
            {badgeText}
          </span>
          <span className="gold-hairline-start flex-1 min-w-8 mt-0.5" aria-hidden="true" />
        </div>

        <h2 className="font-ruqaa text-3xl md:text-5xl text-sand leading-[1.55] max-w-[780px] text-emboss-3d">
          {title}
        </h2>

        {description && (
          <p className="max-w-[620px] mt-4 text-sand-dim text-sm md:text-base leading-loose font-sans border-r-2 border-brass/25 pr-4">
            {description}
          </p>
        )}
      </motion.div>
    </div>
  );
}
