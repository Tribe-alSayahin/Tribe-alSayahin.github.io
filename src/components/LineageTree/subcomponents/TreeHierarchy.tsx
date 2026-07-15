'use client';

import React from 'react';
import { GitBranch } from 'lucide-react';
import type { TreeNode } from '../LineageTree.types';
import { TreeNodeCard } from './TreeNodeCard';

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
          {filteredNodes.map((node, index) => (
            <TreeNodeCard
              key={node.id}
              node={node}
              allNodes={allNodes}
              index={index}
            />
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
