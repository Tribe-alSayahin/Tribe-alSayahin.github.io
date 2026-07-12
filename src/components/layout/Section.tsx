/**
 * Section — الغلاف الموحّد لأقسام الصفحة الرئيسية
 *
 * يجمع الأنماط المكررة عبر كل الأقسام في مكوّن واحد لضمان إيقاع بصري متسق:
 *   ١. الخلفية المتناوبة (`ink` / `ink-2`) عبر الخاصية `tone`
 *   ٢. مسافات رأسية موحّدة (مقياس واحد لكل الأقسام)
 *   ٣. ترويسة القسم عبر مكوّن `SectionHeader`
 *   ٤. منطق الكشف عند التمرير (`reveal-el`)
 *   ٥. حالة تحميل موحّدة (`SectionLoader`) عند تمرير `loaderLabel`
 *
 * إن لم تُمرَّر `loaderLabel` يُعرض المحتوى مباشرةً دون غلاف Suspense
 * (للأقسام غير المُحمَّلة كسولاً مثل قسم الإدارة).
 */
import { Suspense, type ReactNode } from 'react';
import { SectionHeader } from './SectionHeader';
import { SectionLoader } from './SectionLoader';

interface SectionProps {
  id: string;
  /** درجة الخلفية — تتناوب بين الحبر الداكن ودرجته الثانية */
  tone: 'ink' | 'ink-2';
  /** رقم الفصل (لعرضه في الترويسة) */
  chapterNumber?: number;
  serialNumber: string;
  badgeText: string;
  title: string;
  description: string;
  /** نص حالة التحميل؛ عند وجوده يُلَفّ المحتوى بـ Suspense */
  loaderLabel?: string;
  /** إخفاء الفاصل العلوي (للقسم الأول بعد الشعار) */
  noBorder?: boolean;
  /** حصر عرض المحتوى (لا الترويسة) في عمود ضيّق */
  narrow?: boolean;
  /** إخفاء الترويسة (للأقسام ذات الترويسة المخصصة) */
  noHeader?: boolean;
  /** سطح الخلفية — يمكن استخدامه لألواح زيتونية أو رخامية */
  surface?: 'default' | 'olive' | 'parchment';
  children: ReactNode;
}

/* مقياس المسافات الرأسية الموحّد لكل الأقسام */
const SECTION_PADDING = 'py-16 md:py-24 lg:py-32';

export function Section({
  id,
  tone,
  chapterNumber,
  serialNumber,
  badgeText,
  title,
  description,
  loaderLabel,
  noBorder = false,
  narrow = false,
  noHeader = false,
  surface = 'default',
  children,
}: SectionProps) {
  const toneClass = tone === 'ink' ? 'bg-ink' : 'bg-ink-2';
  const surfaceClass =
    surface === 'olive' ? 'bg-olive' : surface === 'parchment' ? 'bg-parchment' : toneClass;
  const borderClass = noBorder ? '' : 'border-t border-brass/15';

  const body = loaderLabel ? (
    <Suspense fallback={<SectionLoader label={loaderLabel} />}>{children}</Suspense>
  ) : (
    children
  );

  return (
    <section
      id={id}
      className={`section ${surfaceClass} px-6 relative z-10 ${borderClass} ${SECTION_PADDING}`}
    >
      <div className="max-w-[1160px] mx-auto">
        {!noHeader && (
          <SectionHeader
            chapterNumber={chapterNumber}
            serialNumber={serialNumber}
            badgeText={badgeText}
            title={title}
            description={description}
          />
        )}
        <div className="reveal-el opacity-0 translate-y-10 transition-all duration-800">
          {narrow ? <div className="max-w-[720px] mx-auto">{body}</div> : body}
        </div>
      </div>
    </section>
  );
}
