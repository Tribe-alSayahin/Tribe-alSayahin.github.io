import React from 'react';
import { GitBranch } from 'lucide-react';
import type { TreeNode } from '../LineageTree.types';

interface TreeHierarchyProps {
  filteredNodes: TreeNode[];
}

export const TreeHierarchy: React.FC<TreeHierarchyProps> = ({ filteredNodes }) => {
  return (
    <div className="editorial-card p-5 md:p-7 relative overflow-hidden">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-brass to-transparent opacity-60" aria-hidden="true" />

      <div className="flex items-center justify-between gap-4 mb-5">
        <span className="font-kufi text-xs text-sand-dim">الفخوذ الواردة في الشجرة</span>
        <GitBranch className="w-5 h-5 text-brass" aria-hidden="true" />
      </div>

      {filteredNodes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredNodes.map((node, index) => (
            <div
              key={node.id}
              className="group relative min-h-20 rounded-2xl border border-brass/20 bg-ink/35 px-5 py-4 flex items-center justify-between gap-3 transition-all duration-base hover:-translate-y-1 hover:border-brass/60 hover:bg-brass/8 hover:shadow-glow-sm"
            >
              <span className="font-ruqaa text-2xl text-brass/55 transition-colors group-hover:text-brass" aria-hidden="true">
                {(index + 1).toLocaleString('ar-SA', { minimumIntegerDigits: 2 })}
              </span>
              <span className="font-serif text-lg md:text-xl font-bold text-sand text-right leading-relaxed">
                {node.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-brass/15 bg-ink/30 px-5 py-8 text-center font-kufi text-sm text-sand-dim">
          لا يوجد فخذ يطابق البحث.
        </p>
      )}
    </div>
  );
};
