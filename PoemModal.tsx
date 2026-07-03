import React from 'react';
import { Type, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Poem, GlossaryTerm } from '../PoetryCouncil.types';
import { Button } from '../../ui/Button';

interface PoemModalProps {
  modalPoemId: string | null;
  poems: Poem[];
  modalFontSize: 'normal' | 'large' | 'huge';
  setModalFontSize: (size: 'normal' | 'large' | 'huge') => void;
  onClose: () => void;
  renderHighlightedHalf: (half: string) => React.ReactNode;
  selectedWord: string | null;
  setSelectedWord: (word: string | null) => void;
  glossaryTerms: Record<string, GlossaryTerm>;
}

export const PoemModal: React.FC<PoemModalProps> = ({
  modalPoemId,
  poems,
  modalFontSize,
  setModalFontSize,
  onClose,
  renderHighlightedHalf,
  selectedWord,
  setSelectedWord,
  glossaryTerms,
}) => {
  if (!modalPoemId) return null;
  const mPoem = poems.find(p => p.id === modalPoemId);
  if (!mPoem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-space-4 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-gradient-to-b from-[#f9f5ec] via-[#f3eace] to-[#e7daaf] border-4 border-[#bca982] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-amber-950 p-space-6 md:p-space-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative Sadu watermark */}
          <div className="absolute inset-0 bg-repeat opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '60px 40px' }} />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 bg-amber-950/10 hover:bg-amber-950/20 text-amber-950 rounded-full flex items-center justify-center transition-all duration-base ease-brand border border-amber-950/20 cursor-pointer z-10"
            aria-label="إغلاق النافذة"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header info */}
          <div className="text-right border-b border-amber-950/20 pb-space-5 mb-space-6 space-y-space-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] text-amber-800 bg-amber-950/5 border border-amber-950/10 px-2.5 py-0.5 rounded">
                {mPoem.publishDate}
              </span>
              <span className="font-kufi text-[10px] text-amber-900 bg-amber-950/5 border border-amber-950/10 px-3 py-1 rounded font-bold">
                {mPoem.categoryLabel}
              </span>
            </div>
            <h3 className="text-xl md:text-3xl font-serif font-extrabold text-amber-900 leading-tight">
              {mPoem.title.replace(' (نموذج عرض توضيحي)', '')}
            </h3>
            <div className="flex justify-between items-center text-xs text-amber-800/80 font-serif font-semibold">
              <span>الراوي: {mPoem.author.replace(' (نموذج عرض توضيحي)', '').replace('نموذج عرض توضيحي - ', '')}</span>
              <span>ديوان الشعر النبطي</span>
            </div>
          </div>

          {/* Font Size Selector Control Bar */}
          <div className="flex flex-col sm:flex-row gap-space-3 items-center justify-between bg-amber-950/5 border border-amber-950/10 rounded-2xl px-space-4 py-space-3 mb-space-6">
            <span className="font-kufi text-xs text-amber-900 font-bold flex items-center gap-space-1.5">
              <Type className="w-4 h-4 text-amber-800" />
              أداة تعديل حجم الخط (لكبار السن والقرّاء):
            </span>
            <div className="flex items-center gap-space-1 bg-amber-950/10 p-1 rounded-xl">
              <button
                onClick={() => setModalFontSize('normal')}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all duration-base cursor-pointer ${
                  modalFontSize === 'normal'
                    ? 'bg-amber-900 text-amber-50 shadow-md scale-105'
                    : 'text-amber-900/85 hover:bg-amber-950/10'
                }`}
              >
                افتراضي
              </button>
              <button
                onClick={() => setModalFontSize('large')}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all duration-base cursor-pointer ${
                  modalFontSize === 'large'
                    ? 'bg-amber-900 text-amber-50 shadow-md scale-105'
                    : 'text-amber-900/85 hover:bg-amber-950/10'
                }`}
              >
                كبير (أ+)
              </button>
              <button
                onClick={() => setModalFontSize('huge')}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all duration-base cursor-pointer ${
                  modalFontSize === 'huge'
                    ? 'bg-amber-900 text-amber-50 shadow-md scale-105'
                    : 'text-amber-900/85 hover:bg-amber-950/10'
                }`}
              >
                كبير جداً (أ++)
              </button>
            </div>
          </div>

          {/* Poem Verses Visual Layout */}
          <div className="space-y-space-6 text-center font-serif py-space-4 border-b border-amber-950/10">
            {mPoem.verses.map((verse, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center justify-center leading-relaxed">
                {/* First half (الصدر) */}
                <div className={`md:col-span-5 text-right font-serif font-bold text-amber-950 tracking-wide ${
                  modalFontSize === 'normal' ? 'text-sm md:text-base' :
                  modalFontSize === 'large' ? 'text-base md:text-lg' : 'text-lg md:text-xl'
                }`}>
                  {renderHighlightedHalf(verse.firstHalf)}
                </div>
                
                {/* Decorative separator */}
                <div className="md:col-span-2 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-red-800 rotate-45 border border-[#ab9971]" />
                  <span className="w-6 h-[1px] bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />
                  <span className="w-2 h-2 rounded-full bg-red-800 rotate-45 border border-[#ab9971]" />
                </div>

                {/* Second half (العجز) */}
                <div className={`md:col-span-5 text-left md:text-right font-serif font-bold text-amber-950 tracking-wide pr-0 md:pr-4 ${
                  modalFontSize === 'normal' ? 'text-sm md:text-base' :
                  modalFontSize === 'large' ? 'text-base md:text-lg' : 'text-lg md:text-xl'
                }`}>
                  {renderHighlightedHalf(verse.secondHalf)}
                </div>
              </div>
            ))}
          </div>

          {/* Footnote Context */}
          <div className="pt-space-5 text-right space-y-space-2">
            <span className="font-kufi text-[11px] text-amber-900 font-bold block">سياق القصيدة وأصل الموروث:</span>
            <p className={`font-serif leading-relaxed text-amber-950/80 font-semibold italic ${
              modalFontSize === 'normal' ? 'text-xs md:text-sm' :
              modalFontSize === 'large' ? 'text-sm md:text-base' : 'text-base md:text-lg'
            }`}>
              {mPoem.context}
            </p>
          </div>

          {/* Bedouin Dictionary integration directly inside modal */}
          {selectedWord && glossaryTerms[selectedWord] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-space-6 bg-amber-950/5 border border-amber-950/15 p-space-4 rounded-2xl text-right space-y-space-2"
            >
              <div className="flex items-center justify-between border-b border-amber-950/10 pb-space-2">
                <span className="font-kufi text-[10px] text-amber-900/60 font-bold">تفسير الكلمة المحددة:</span>
                <button 
                  onClick={() => setSelectedWord(null)}
                  className="text-[10px] text-red-800 font-bold underline cursor-pointer"
                >
                  إغلاق التفسير
                </button>
              </div>
              <div className="space-y-space-1">
                <h4 className="font-serif text-sm font-extrabold text-[#7c2d12]">{glossaryTerms[selectedWord].word}</h4>
                <p className="font-sans text-xs text-amber-950/90 leading-relaxed font-medium">
                  <strong>المعنى:</strong> {glossaryTerms[selectedWord].meaning}
                </p>
                <p className="font-sans text-[11px] text-amber-900/85 italic leading-relaxed">
                  <strong>السياق البدوي:</strong> {glossaryTerms[selectedWord].context}
                </p>
              </div>
            </motion.div>
          )}

          <div className="mt-space-8 pt-space-4 border-t border-amber-950/10 flex justify-between items-center text-[10px] text-amber-900/60 font-kufi">
            <span>انقر على الكلمات المذهّبة لتفسير معانيها</span>
            <span>الديوان التفاعلي المعتمد</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
