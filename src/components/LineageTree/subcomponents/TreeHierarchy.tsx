import React from 'react';
import { GitBranch } from 'lucide-react';
import type { TreeNode } from '../LineageTree.types';

interface TreeHierarchyProps {
  filteredNodes: TreeNode[];
  allNodes: TreeNode[];
}

export const TreeHierarchy: React.FC<TreeHierarchyProps> = ({ filteredNodes, allNodes }) => {
  return (
    <div className="editorial-card p-5 md:p-7 relative overflow-hidden">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-brass to-transparent opacity-60" aria-hidden="true" />

      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="font-kufi text-xs text-sand-dim">الأفخاذ الرئيسية وفروعها</span>
        <GitBranch className="w-5 h-5 text-brass" aria-hidden="true" />
      </div>

      {filteredNodes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node, index) => {
            const children = allNodes.filter(
              (n) => n.parent_id === node.id && n.level === 2,
            );
            return (
              <div
                key={node.id}
                className="group relative rounded-2xl border border-brass/20 bg-ink/35 px-5 pt-5 pb-4 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:border-brass/60 hover:bg-brass/8 hover:shadow-[0_4px_24px_rgba(212,175,55,0.12)] focus-within:border-brass/60"
              >
                {/* Ornamental number */}
                <span
                  className="absolute top-3 left-4 font-ruqaa text-4xl leading-none text-brass/20 transition-colors group-hover:text-brass/40 select-none"
                  aria-hidden="true"
                >
                  {(index + 1).toLocaleString('ar-SA')}
                </span>

                {/* Branch name */}
                <p className="font-serif text-xl md:text-2xl font-bold text-sand text-right leading-snug pt-2">
                  {node.name}
                </p>

                {/* Sub-branches */}
                {children.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-end" role="list" aria-label={`فروع ${node.name}`}>
                    {children.map((child) => (
                      <span
                        key={child.id}
                        role="listitem"
                        className="inline-block rounded-full border border-brass/15 bg-brass/5 px-2.5 py-0.5 font-kufi text-[0.65rem] text-sand-dim transition-colors group-hover:border-brass/30 group-hover:text-sand"
                      >
                        {child.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom accent */}
                <div className="absolute bottom-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-brass/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-2xl border border-brass/15 bg-ink/30 px-5 py-8 text-center font-kufi text-sm text-sand-dim">
          لا يوجد فخذ يطابق البحث.
        </p>
      )}
    </div>
  );
};
