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
    <div className="relative z-10 mb-12 md:mb-16 select-none text-right">
      {/* الرقم الشبحي الكبير — يجلس في الطرف الأيسر مقابل الترويسة */}
      <div
        className="absolute left-0 -top-5 md:-top-10 font-ruqaa text-[6rem] md:text-[9rem] leading-none text-brass/[0.07] pointer-events-none"
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
        {/* سطر الشارة: رقم القسم + التسمية + خط يمتد حتى نهاية السطر */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="font-ruqaa text-sm text-brass border border-brass/35 rounded-xl w-10 h-10 flex items-center justify-center bg-brass/8 shrink-0 shadow-glow-sm"
            aria-hidden="true"
          >
            {serialNumber}
          </span>
          <span className="section-kicker text-xs md:text-sm tracking-[0.12em]">
            {badgeText}
          </span>
          <span className="gold-hairline-start flex-1 min-w-10 mt-0.5 opacity-70" aria-hidden="true" />
        </div>

        <h2 className="font-ruqaa text-4xl md:text-6xl text-sand leading-[1.4] tracking-tight max-w-[780px]">
          {title}
        </h2>

        {description && (
          <p className="max-w-[650px] mt-5 text-sand-dim text-sm md:text-base leading-loose font-sans border-r-2 border-brass/35 pr-5">
            {description}
          </p>
        )}
      </motion.div>
    </div>
  );
}
