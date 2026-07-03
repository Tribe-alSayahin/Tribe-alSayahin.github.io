import React from 'react';
import { Award, Info, BookOpen, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { TreeNode } from '../LineageTree.types';
import { Badge } from '../../ui/Badge';
import { transitionBase } from '../../../lib/motion-presets';

interface DetailPanelProps {
  selectedNode: TreeNode | null;
}

export const getReliabilityBadge = (rel: 1 | 2 | 3) => {
  switch (rel) {
    case 1:
      return (
        <Badge variant="success" showDot={false}>
          <CheckCircle2 className="w-3 h-3" />
          مستوى 1: أصلي مطابق
        </Badge>
      );
    case 2:
      return (
        <Badge variant="warning" showDot={false}>
          <HelpCircle className="w-3 h-3" />
          مستوى 2: منسوب عبر وسيط
        </Badge>
      );
    case 3:
      return (
        <Badge variant="danger" showDot={false}>
          <AlertTriangle className="w-3 h-3" />
          مستوى 3: رواية شفهية/قبلية
        </Badge>
      );
  }
};

export const DetailPanel: React.FC<DetailPanelProps> = ({ selectedNode }) => {
  if (!selectedNode) {
    return (
      <div className="bg-[#0e0a05] border border-brass/10 rounded-2xl p-space-6 text-center text-sand-dim font-serif h-full flex items-center justify-center">
        اختر فخذاً أو عائلةً لتفاصيل التوثيق والمصادر الكاملة.
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
      className="bg-[#0e0a05] border border-brass/20 rounded-2xl p-space-6 text-right space-y-space-4 h-full flex flex-col justify-between shadow-glow-sm"
    >
      <div className="space-y-space-3.5">
        <div className="flex items-center justify-between border-b border-brass/10 pb-space-3">
          <span className="text-[10px] font-mono text-brass-lt/50">NODE REGISTER: {selectedNode.id.toUpperCase()}</span>
          {getReliabilityBadge(selectedNode.reliability)}
        </div>

        <div className="space-y-space-1">
          <span className="text-xs text-brass-lt font-kufi block">
            {selectedNode.level === 0 ? 'الرأس العشائري الجامع' : 
             selectedNode.level === 1 ? 'فخذ رئيسي مباشر' : 
             selectedNode.level === 2 ? 'بطن / عائلة فرعية' : 'فرع أو ابن عائلة'}
          </span>
          <h4 className="text-2xl font-serif text-sand font-bold flex items-center gap-space-2 justify-end">
            {selectedNode.name}
            <Award className="w-5 h-5 text-brass" />
          </h4>
        </div>

        <div className="h-[1px] w-full bg-brass/10" />

        <div className="space-y-space-2">
          <span className="text-xs text-brass-lt/70 font-kufi flex items-center gap-space-1 justify-end">
            <Info className="w-3.5 h-3.5 text-brass" />
            شرح وتفصيل تاريخي:
          </span>
          <p className="text-sand-dim text-xs md:text-sm leading-relaxed font-sans bg-ink/30 border border-brass/5 p-space-3 rounded-lg">
            {selectedNode.note}
          </p>
        </div>

        <div className="space-y-space-2 pt-space-2">
          <span className="text-xs text-brass-lt/70 font-kufi flex items-center gap-space-1 justify-end">
            <BookOpen className="w-3.5 h-3.5 text-brass" />
            المصدر والمستند التوثيقي:
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
