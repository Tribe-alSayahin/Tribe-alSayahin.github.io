'use client';

/**
 * SectionLoader — حالة تحميل موحّدة لأقسام الموقع
 *
 * يوحّد رسائل الانتظار المتكررة (Suspense fallback) بمظهر نحاسي متسق:
 * نقطة نابضة + نص عربي بخط Reem Kufi. يحترم الألوان الثيمية والوضعين.
 */
interface SectionLoaderProps {
  /** نص الانتظار، مثال: «جارٍ تحميل شجرة النسب...» */
  label: string;
}

export function SectionLoader({ label }: SectionLoaderProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="w-2 h-2 rounded-full bg-brass/70 animate-pulse" />
        <span className="w-2 h-2 rounded-full bg-brass/50 animate-pulse [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-brass/30 animate-pulse [animation-delay:300ms]" />
      </span>
      <span className="font-kufi text-xs sm:text-sm tracking-[0.12em] text-sand-dim">
        {label}
      </span>
    </div>
  );
}
