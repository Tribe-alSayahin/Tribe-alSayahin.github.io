import React from 'react';
import { Info, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { TreeNode } from '../LineageTree.types';
import { transitionBase } from '../../../lib/motion-presets';

interface DetailPanelProps {
  selectedNode: TreeNode | null;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ selectedNode }) => {
  if (!selectedNode) {
    return (
      <div className="editorial-card p-space-6 text-center text-sand-dim font-serif h-full flex items-center justify-center">
        اختر اسمًا لعرض التفاصيل.
      </div>
    );
  }

  return (
    <motion.div
      key={selectedNode.id}
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 15 }}
      transition={transitionBase}
      className="editorial-card p-space-6 text-right space-y-space-4 h-full flex flex-col justify-between"
    >
      <div className="space-y-space-3.5">
        <div className="flex items-center justify-end border-b border-brass/10 pb-space-3">
          <span className="text-[10px] font-kufi text-brass-lt/70">تفاصيل مختصرة</span>
        </div>

        <div className="space-y-space-1">
          <span className="text-xs text-brass-lt font-kufi block">
            {selectedNode.level === 0 ? 'الرأس العشائري الجامع' : 
             selectedNode.level === 1 ? 'فخذ رئيسي مباشر' : 
             selectedNode.level === 2 ? 'بطن / عائلة فرعية' : 'فرع أو ابن عائلة'}
          </span>
          <h4 className="text-2xl font-serif text-sand font-bold flex items-center gap-space-2 justify-end">
            {selectedNode.name}
          </h4>
        </div>

        <div className="h-[1px] w-full bg-brass/10" />

        <div className="space-y-space-2">
          <span className="text-xs text-brass-lt/70 font-kufi flex items-center gap-space-1 justify-end">
            <Info className="w-3.5 h-3.5 text-brass" />
            نبذة:
          </span>
          <p className="text-sand-dim text-xs md:text-sm leading-relaxed font-sans bg-ink/30 border border-brass/5 p-space-3 rounded-lg">
            {selectedNode.note}
          </p>
        </div>

        <div className="space-y-space-2 pt-space-2">
          <span className="text-xs text-brass-lt/70 font-kufi flex items-center gap-space-1 justify-end">
            <BookOpen className="w-3.5 h-3.5 text-brass" />
            المصدر:
          </span>
          <div className="text-[11px] text-sand/80 font-mono bg-ink/60 border border-brass/10 px-space-3 py-space-2 rounded-lg leading-relaxed">
            {selectedNode.source}
          </div>
        </div>
      </div>

      <div className="pt-space-4 border-t border-brass/10 text-center text-[10px] text-sand-dim font-sans">
        انقر على أي عقدة شجرية في الجهة المقابلة لعرض تفاصيلها ومصادرها المباشرة.
      </div>
    </motion.div>
  );
};
