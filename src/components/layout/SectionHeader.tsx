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
    <div className="text-center mb-14 relative z-10 select-none">
      {/* Ghost Background Folio Number Motif */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-10 text-[6rem] md:text-[9rem] font-serif font-extrabold text-brass/[0.03] select-none pointer-events-none leading-none">
        {serialNumber}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="gold-hairline w-10 md:w-16" aria-hidden="true" />
          <span className="font-kufi text-xs text-brass-lt font-semibold tracking-wider bg-brass/5 px-4 py-1.5 rounded-full border border-brass/10">
            {badgeText}
          </span>
          <span className="gold-hairline w-10 md:w-16" aria-hidden="true" />
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-sand mt-1 tracking-tight">
          {title}
        </h2>
        <div 
          className="w-[84px] h-[26px] mx-auto mt-4 opacity-70 bg-repeat" 
          style={{ backgroundImage: 'var(--sadu)', backgroundSize: '28px 20px' }}
          aria-hidden="true"
        />
        {description && (
          <p className="max-w-[620px] mx-auto mt-4 text-sand-dim text-sm md:text-base leading-relaxed font-sans">
            {description}
          </p>
        )}
      </motion.div>
    </div>
  );
}
