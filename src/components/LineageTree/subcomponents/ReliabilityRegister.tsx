import React from 'react';
import { BookOpenCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { TreeNode } from '../LineageTree.types';
import { Badge } from '../../ui/Badge';
import { slideUp } from '../../../lib/motion-presets';

interface ReliabilityRegisterProps {
  lineageData: TreeNode[];
}

export const ReliabilityRegister: React.FC<ReliabilityRegisterProps> = ({ lineageData }) => {
  return (
    <motion.div
      key="sources-tab"
      {...slideUp}
      className="space-y-space-6 text-right relative z-10"
    >
      <div className="bg-ink/30 border border-brass/15 rounded-2xl p-space-6 space-y-space-4 shadow-glow-sm">
        <h4 className="text-xl font-serif text-sand font-bold mb-space-2 flex items-center gap-space-2 justify-end border-b border-brass/10 pb-space-3">
          <span>سجل مصادر شجرة أنساب السياحين ووثوقيتها</span>
          <BookOpenCheck className="w-5 h-5 text-brass" />
        </h4>

        <p className="text-xs text-sand-dim leading-relaxed max-w-4xl font-sans mb-space-4">
          تعتمد شجرة الأنساب المنشورة أعلاه على مراجعة دقيقة ومقارنة علمية لأمهات المراجع والوثائق التاريخية. يوضح الجدول التالي مراجع كل عقدة ودرجة قوتها التاريخية مصنفة لتفادي الهلوسة والخلط:
        </p>

        <div className="overflow-x-auto font-sans">
          <table className="w-full text-xs text-sand-dim text-right border-collapse">
            <thead>
              <tr className="border-b border-brass/20 text-brass-lt font-kufi text-[11px]">
                <th className="pb-space-3 pl-space-4">الفخذ / العشيرة</th>
                <th className="pb-space-3 px-space-4">المستوى النسبي</th>
                <th className="pb-space-3 px-space-4">المستند العلمي والمصدر</th>
                <th className="pb-space-3 px-space-4">درجة الموثوقية</th>
                <th className="pb-space-3 pr-space-4 text-left font-mono">Node ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brass/10">
              {lineageData.map((node) => (
                <tr key={node.id} className="hover:bg-brass/5 transition-colors">
                  <td className="py-space-3 pl-space-4 font-serif font-bold text-sand text-sm">{node.name}</td>
                  <td className="py-space-3 px-space-4 font-serif text-brass-lt font-semibold">
                    {node.level === 0 ? 'الجد الجامع' : `مستوى ${node.level}`}
                  </td>
                  <td className="py-space-3 px-space-4 max-w-sm text-sand-dim/90 truncate" title={node.source}>
                    {node.source}
                  </td>
                  <td className="py-space-3 px-space-4">
                    {node.reliability === 1 ? (
                      <Badge variant="success">أصلي مطابق (1)</Badge>
                    ) : node.reliability === 2 ? (
                      <Badge variant="warning">منسوب بوسطاء (2)</Badge>
                    ) : (
                      <Badge variant="danger">رواية قبلية (3)</Badge>
                    )}
                  </td>
                  <td className="py-space-3 pr-space-4 text-left font-mono text-[10px] text-brass/50">{node.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
