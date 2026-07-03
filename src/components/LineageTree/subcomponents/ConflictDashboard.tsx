import React from 'react';
import { Scale, ShieldAlert, BookOpen, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from '../../ui/Badge';
import { slideUp } from '../../../lib/motion-presets';

export const ConflictDashboard: React.FC = () => {
  return (
    <motion.div
      key="conflicts-tab"
      {...slideUp}
      className="space-y-space-6 text-right relative z-10"
    >
      <div className="bg-ink/30 border border-brass/15 rounded-2xl p-space-6 space-y-space-6 shadow-glow-sm">
        <div className="flex items-center justify-between border-b border-brass/10 pb-space-4">
          <Badge variant="danger" showDot={true}>
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            روايات متعددة غير محسومة بالكامل
          </Badge>
          <h4 className="text-xl font-serif text-sand font-bold flex items-center gap-space-2 justify-end">
            <span>كشف التعارضات والموازنة النسبية الشاملة</span>
            <Scale className="w-5 h-5 text-brass" />
          </h4>
        </div>

        <p className="text-xs text-sand-dim leading-relaxed font-sans max-w-4xl">
          في البحث القبلي التاريخي، تبرز أحياناً تعارضات طفيفة بين المصادر الأجنبية (الرحالة والمستشرقين) والمصادر العربية المحلية (نسّابة عتيبة والرواية القبلية الشفهية). نلتزم بالأمانة العلمية بعرض هذه الخلافات صراحة عوض إخفائها:
        </p>

        {/* Conflict Case 1 */}
        <div className="border border-brass/15 rounded-xl overflow-hidden bg-[#0d0905]">
          <div className="bg-brass/5 px-space-5 py-space-3 border-b border-brass/15 flex items-center justify-between">
            <Badge variant="warning">الترجيح: رواية المراجع العربية والمحلية هي المرجحة ميدانياً</Badge>
            <h5 className="font-serif text-sm font-bold text-sand">المسألة الأولى: تعارض فروع السياحين ومكانة الزمايمة (ذوي زميم)</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-brass/10 text-xs">
            {/* Viewpoint 1 */}
            <div className="p-space-5 space-y-space-3">
              <div className="flex items-center gap-space-2 justify-end text-rose-400 font-semibold font-serif">
                <span>رواية المستشرقين (ماكس فون أوبنهايم - البدو)</span>
                <BookOpen className="w-4 h-4" />
              </div>
              <p className="text-sand-dim leading-relaxed font-sans">
                صنّف أوبنهايم في جداوله (ج3 ص262) السياحين بأنهم فخذ يتكون بشكل أساسي ومباشر من فرعين رئيسيين هما: <strong>الفراحين</strong> و<strong>الخوخان</strong>، بينما أدرج شيوخ القبيلة (آل مسيلم) دون فصل فخذ <strong>الزمايمة</strong> ككيان مستقل تماماً، بل أدرجهم تحت اسم بيت الشيخ مباشرة.
              </p>
              <div className="text-[10px] text-brass-lt">المصدر: أوبنهايم، البدو، ج3، ص262. (مستوى 2)</div>
            </div>

            {/* Viewpoint 2 */}
            <div className="p-space-5 space-y-space-3">
              <div className="flex items-center gap-space-2 justify-end text-emerald-400 font-semibold font-serif">
                <span>رواية النسّابة العرب وموقع عتيبة الهيلا</span>
                <Users className="w-4 h-4" />
              </div>
              <p className="text-sand-dim leading-relaxed font-sans">
                تؤكد المراجع العربية المعاصرة والتحقيق الشفهي الداخلي للقبيلة على أن <strong>الزمايمة</strong> هم فخذ أصيل من السياحين قائم بذاته (يتفرع منه ذوي مسلم، ذوي مسيلم الشيوخ، وذوي عويشز)، وهو ما يشكل ركيزة لا غنى عنها في تقسيمات السياحين الحالية بجانب الفراحين والمزانكة والخوخان.
              </p>
              <div className="text-[10px] text-brass-lt">المصدر: معجم قبائل نجد / تحقيقات ديوان عتيبة الهيلا. (مستوى 1)</div>
            </div>
          </div>
        </div>

        {/* Conflict Case 2 */}
        <div className="border border-brass/15 rounded-xl overflow-hidden bg-[#0d0905]">
          <div className="bg-brass/5 px-space-5 py-space-3 border-b border-brass/15 flex items-center justify-between">
            <Badge variant="success">الترجيح: الرواية القبيلة المباشرة ترفع الموثوقية بالقصائد</Badge>
            <h5 className="font-serif text-sm font-bold text-sand">المسألة الثانية: اسم فخذ المزانكة وتسمية القرانكة التاريخية</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-brass/10 text-xs">
            {/* Viewpoint 1 */}
            <div className="p-space-5 space-y-space-3">
              <div className="flex items-center gap-space-2 justify-end text-rose-400 font-semibold font-serif">
                <span>مخطوطات المستشرقين وسجلات الرحلات</span>
                <BookOpen className="w-4 h-4" />
              </div>
              <p className="text-sand-dim leading-relaxed font-sans">
                ورد في some تراجم الرحلات ترجمة اسم الفخذ إلى "القرانكة" بتبديل الحروف نتيجة صعوبة نطق المخارج العربية على ألسن المترجمين الأوروبيين الأوائل، مما سبب التباساً نادراً في تحديد الفروع وتطابقها الجغرافي بآبار نجد.
              </p>
              <div className="text-[10px] text-brass-lt">المصدر: مخطوطات بادية نجد البريطانية. (مستوى 3)</div>
            </div>

            {/* Viewpoint 2 */}
            <div className="p-space-5 space-y-space-3">
              <div className="flex items-center gap-space-2 justify-end text-emerald-400 font-semibold font-serif">
                <span>التحقيق اللغوي والقصائد النبطية والواقع القبلي</span>
                <Users className="w-4 h-4" />
              </div>
              <p className="text-sand-dim leading-relaxed font-sans">
                الاسم الصحيح والمحقق لغوياً في ديوان عتيبة هو <strong>المزانكة</strong>، بدلالة قصائد فحول شعراء الفخذ ومنهم عائلة ابن مايقه السيحاني في بيوت الشعر المتوارثة، والخلط الغربي نتج بشكل جلي عن التباس السمع عند الرواية الشفهية.
              </p>
              <div className="text-[10px] text-brass-lt">المصدر: قصائد الفرسان / ديوان ابن مايقه السيحاني. (مستوى 1)</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
