import { BookOpen } from 'lucide-react';
import { Badge } from './ui/Badge';

export default function OppenheimArchive() {
  return (
    <div
      className="bg-ink-2/50 border border-brass/20 rounded-3xl p-space-6 md:p-space-10 shadow-xl"
      id="oppenheim-archive"
    >
      <div className="max-w-2xl mx-auto text-center space-y-space-5">
        <Badge variant="brass" showDot={true} className="font-kufi text-xs px-space-3 py-space-1 bg-brass/10">
          قيد التوثيق
        </Badge>
        <div className="mx-auto w-16 h-16 rounded-2xl border border-brass/25 bg-brass/10 flex items-center justify-center text-brass-lt">
          <BookOpen className="w-8 h-8" aria-hidden="true" />
        </div>
        <h3 className="text-2xl md:text-3xl font-serif text-sand font-bold">
          لا توجد مواد أرشيفية موثقة للنشر حاليًا
        </h3>
        <p className="text-sm text-sand-dim leading-loose">
          سيُضاف محتوى الأرشيف بعد مراجعة النسخ الأصلية والتحقق من البيانات الببليوغرافية، دون عرض نماذج أو اقتباسات افتراضية.
        </p>
      </div>
    </div>
  );
}
