import React from 'react';
import { TreeNode } from '../LineageTree.types';

interface TreeHierarchyProps {
  filteredNodes: TreeNode[];
  selectedNode: TreeNode | null;
  onSelectNode: (node: TreeNode) => void;
}

const getNodeClass = (isSelected: boolean, level: number) => {
  if (isSelected) return 'border-brass bg-brass/12 text-brass-lt shadow-glow-sm';
  if (level === 0) return 'border-brass/35 bg-brass/8 text-sand hover:border-brass/70 hover:bg-brass/12';
  if (level === 1) return 'border-brass/20 bg-ink-2/70 text-sand hover:border-brass/55 hover:bg-brass/8';
  return 'border-sand/10 bg-ink/35 text-sand-dim hover:border-brass/40 hover:text-sand hover:bg-brass/5';
};

export const TreeHierarchy: React.FC<TreeHierarchyProps> = ({
  filteredNodes,
  selectedNode,
  onSelectNode,
}) => {
  return (
    <div className="editorial-card p-5 md:p-6 relative overflow-hidden">
      <p className="text-xs text-sand-dim/80 text-right font-sans mb-6">
        تسلسل الفروع والأسماء كما تظهر في الشجرة:
      </p>

      <div className="flex flex-col gap-8 relative">
        {/* Vertical guideline */}
        <div className="absolute right-6 top-6 bottom-6 w-0.5 bg-brass/10 pointer-events-none" />

        {/* Level 0: Root */}
        <div className="flex justify-end items-center pr-12 relative">
          {/* Connection line */}
          <div className="absolute right-6 w-6 h-[1px] bg-brass/25" />
          {filteredNodes.filter(n => n.level === 0).map(node => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => onSelectNode(node)}
                className={`px-5 py-3 rounded-2xl border text-right transition-all cursor-pointer font-serif text-lg font-bold flex items-center gap-3 relative focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${getNodeClass(isSelected, node.level)}`}
              >
                {node.name}
              </button>
            );
          })}
        </div>

        {/* Level 1: Sub-tribes (الفخوذ) */}
        <div className="space-y-4">
          <span className="text-[10px] text-brass-lt/70 font-kufi block text-right pr-6">الفروع الرئيسية</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-12 relative">
            {filteredNodes.filter(n => n.level === 1).map(node => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div key={node.id} className="relative flex items-center justify-end">
                  {/* Connection line */}
                  <div className="absolute -right-6 w-6 h-[1px] bg-brass/15" />
                  <button
                    onClick={() => onSelectNode(node)}
                    className={`w-full p-3.5 rounded-xl border text-right transition-all cursor-pointer font-serif text-sm font-bold flex items-center justify-between gap-2 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${getNodeClass(isSelected, node.level)}`}
                  >
                    <span className="text-[9px] opacity-50 font-kufi">فرع</span>
                    <span>{node.name}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level 2: Families (البطون والعائلات) */}
        {filteredNodes.some(n => n.level === 2) && (
          <div className="space-y-4">
            <span className="text-[10px] text-brass-lt/70 font-kufi block text-right pr-6">الفروع المتفرعة</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pr-12 relative">
              {filteredNodes.filter(n => n.level === 2).map(node => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div key={node.id} className="relative flex items-center justify-end">
                    {/* Connection line */}
                    <div className="absolute -right-6 w-6 h-[1px] bg-brass/10" />
                    <button
                      onClick={() => onSelectNode(node)}
                      className={`w-full p-2.5 rounded-lg border text-right transition-all cursor-pointer font-serif text-xs font-semibold flex items-center justify-between gap-2 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${getNodeClass(isSelected, node.level)}`}
                    >
                      <span className="text-[8px] opacity-40 font-kufi">فرع</span>
                      <span className="truncate">{node.name}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Level 3 & 4: Historic Leaders/Descendants */}
        {filteredNodes.some(n => n.level >= 3) && (
          <div className="space-y-4 border-t border-brass/10 pt-4">
            <span className="text-[10px] text-brass-lt/70 font-kufi block text-right pr-6">أسماء متفرعة</span>
            <div className="flex flex-wrap gap-2.5 justify-end pr-12">
              {filteredNodes.filter(n => n.level >= 3).map(node => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    className={`px-3 py-2 rounded-lg border text-right text-xs transition-all cursor-pointer font-serif font-semibold flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${getNodeClass(isSelected, node.level)}`}
                  >
                    <span>{node.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
