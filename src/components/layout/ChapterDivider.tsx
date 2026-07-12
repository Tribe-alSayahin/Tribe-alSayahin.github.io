import { motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ChapterDividerProps {
  id: string;
  number: number;
  title: string;
  description: string;
}

const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢', '١٣', '١٤', '١٥'];

function toArabicNumeral(n: number): string {
  return String(n)
    .split('')
    .map((d) => ARABIC_NUMERALS[Number(d)] ?? d)
    .join('');
}

export function ChapterDivider({ id, number, title, description }: ChapterDividerProps) {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id={id}
      className="chapter-divider bg-ink/80"
      aria-label={`الفصل ${number}: ${title}`}
    >
      <div className="sadu-band" aria-hidden="true" />
      <div className="sadu-band-bottom" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.96, y: prefersReduced ? 0 : 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="chapter-divider-panel mx-6"
      >
        <div className="chapter-divider-number" aria-hidden="true">
          {toArabicNumeral(number)}
        </div>

        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-block font-kufi text-xs text-brass-lt/90 bg-brass/5 border border-brass/20 rounded-full px-4 py-1.5 mb-4"
        >
          الفصل {toArabicNumeral(number)}
        </motion.span>

        <h2 className="chapter-divider-title">
          {title}
        </h2>

        <p className="chapter-divider-desc">
          {description}
        </p>
      </motion.div>
    </section>
  );
}
