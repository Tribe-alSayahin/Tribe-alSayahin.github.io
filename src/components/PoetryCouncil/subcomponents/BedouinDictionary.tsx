import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlossaryTerm } from '../PoetryCouncil.types';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

interface BedouinDictionaryProps {
  selectedWord: string | null;
  glossaryTerms: Record<string, GlossaryTerm>;
  onClearSelection: () => void;
}

export const BedouinDictionary: React.FC<BedouinDictionaryProps> = ({
  selectedWord,
  glossaryTerms,
  onClearSelection,
}) => {
  return (
    <div className="lg:col-span-5 space-y-space-6">
      <AnimatePresence mode="wait">
        {selectedWord && glossaryTerms[selectedWord] ? (
          <motion.div
            key={selectedWord}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.35 }}
          >
            <Card
              hoverGlow={true}
              className="bg-[#191107] border border-brass/35 rounded-3xl p-space-6 text-right space-y-space-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-brass/10 pb-space-3">
                <div className="flex items-center gap-space-2">
                  <Sparkles className="w-4 h-4 text-brass" />
                  <h4 className="font-serif text-lg font-bold text-brass-lt">قاموس البادية والمعاني</h4>
                </div>
                <Button
                  onClick={onClearSelection}
                  variant="secondary"
                  className="text-xs px-space-2 py-space-1 h-auto font-kufi"
                >
                  إلغاء التحديد
                </Button>
              </div>

              <div className="space-y-space-1">
                <span className="text-[10px] text-sand-dim/60 font-kufi">اللفظة البدوية:</span>
                <h3 className="text-2xl font-serif text-sand font-bold">{glossaryTerms[selectedWord].word}</h3>
              </div>

              <div className="bg-ink-2/80 p-space-4 rounded-xl border border-brass/10 text-xs md:text-sm leading-relaxed text-sand-dim space-y-space-1">
                <span className="font-bold text-brass-lt block font-kufi text-[11px]">المعنى اللغوي والتفسير:</span>
                <p className="font-serif leading-relaxed">{glossaryTerms[selectedWord].meaning}</p>
              </div>

              <div className="bg-brass/5 p-space-4 rounded-xl border border-brass/20 text-xs leading-relaxed text-sand/90 space-y-space-1">
                <span className="font-bold text-brass-lt block font-kufi text-[11px]">الاستخدام والسياق القبلي:</span>
                <p className="font-serif leading-relaxed italic">
                  {glossaryTerms[selectedWord].context}
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="empty-dictionary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card
              hoverGlow={false}
              className="bg-ink/30 border border-brass/15 rounded-3xl p-space-8 text-center space-y-space-4 shadow-inner min-h-[300px] flex flex-col justify-center items-center"
            >
              <div className="w-14 h-14 bg-brass/10 border border-brass/20 rounded-full flex items-center justify-center text-brass-lt">
                <HelpCircle className="w-8 h-8 stroke-[1.4]" />
              </div>
              <div className="space-y-space-1 max-w-xs mx-auto">
                <h4 className="font-serif text-base text-sand font-bold">قاموس المفردات البدوية</h4>
                <p className="text-xs text-sand-dim leading-relaxed">
                  انقر على أي كلمة مظلّلة بالذهب في القصيدة لعرض تفسيرها، جذورها البدوية وسياق استخدامها التراثي في ديار نجد والحجاز.
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sadu patterns visual preview box */}
      <Card
        hoverGlow={false}
        className="bg-gradient-to-br from-[#1d150b] to-[#0d0905] border border-brass/15 rounded-3xl p-space-6 space-y-space-3 text-right"
      >
        <h4 className="font-serif text-sm font-bold text-sand flex items-center gap-space-2 justify-end">
          <span>أصالة المجلس والموروث الشفهي</span>
          <Sparkles className="w-3.5 h-3.5 text-brass" />
        </h4>
        <p className="text-[11px] text-sand-dim leading-relaxed font-sans">
          يعدّ الشعر النبطي في البادية لسان حال القبيلة، وسجل تدوين تاريخها وأمجادها، وإكرام الضيف ومكارم الأخلاق. وتواصلاً مع هذا الموروث الأدبي، نسعى جاهدين لحفظ مآثر الآباء وإبقاء مجالسنا عامرة بقصص الشهامة الرفيعة.
        </p>
        <div className="sadu-band h-1.5 w-full rounded opacity-30 mt-space-2" />
      </Card>
    </div>
  );
};
