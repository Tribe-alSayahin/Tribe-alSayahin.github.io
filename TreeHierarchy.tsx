import React from 'react';
import { Sparkles, Users, Award } from 'lucide-react';
import { TreeNode } from '../LineageTree.types';

interface TreeHierarchyProps {
  filteredNodes: TreeNode[];
  selectedNode: TreeNode | null;
  onSelectNode: (node: TreeNode) => void;
}

const getReliabilityColor = (rel: 1 | 2 | 3, isSelected: boolean) => {
  if (isSelected) return 'border-brass bg-brass/10 text-brass-lt';
  switch (rel) {
    case 1:
      return 'border-emerald-500/20 bg-emerald-950/20 text-emerald-200 hover:border-emerald-500/40 hover:bg-emerald-950/40';
    case 2:
      return 'border-amber-500/20 bg-amber-950/20 text-amber-200 hover:border-amber-500/40 hover:bg-amber-950/40';
    case 3:
      return 'border-rose-500/20 bg-rose-950/20 text-rose-200 hover:border-rose-500/40 hover:bg-rose-950/40';
  }
};

export const TreeHierarchy: React.FC<TreeHierarchyProps> = ({
  filteredNodes,
  selectedNode,
  onSelectNode,
}) => {
  return (
    <div className="bg-ink/30 border border-brass/15 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-brass/10 border border-brass/25 px-2 py-1 rounded text-[10px] text-brass-lt font-mono">
        <Sparkles className="w-3 h-3 animate-pulse" />
        Interactive Blueprint Engine v1.0
      </div>

      <p className="text-xs text-sand-dim/80 text-right font-sans mb-6">
        تسلسل الفخوذ المباشرة المتفرعة من قبيلة السياحين الكبرى:
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
                className={`px-5 py-3 rounded-2xl border text-right transition-all cursor-pointer font-serif text-lg font-bold flex items-center gap-3 relative shadow-md ${getReliabilityColor(node.reliability, isSelected)}`}
              >
                <Users className="w-5 h-5 text-brass" />
                {node.name}
              </button>
            );
          })}
        </div>

        {/* Level 1: Sub-tribes (الفخوذ) */}
        <div className="space-y-4">
          <span className="text-[10px] text-brass-lt/50 font-kufi block text-right pr-6">أفخاذ القبيلة الكبرى:</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-12 relative">
            {filteredNodes.filter(n => n.level === 1).map(node => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div key={node.id} className="relative flex items-center justify-end">
                  {/* Connection line */}
                  <div className="absolute -right-6 w-6 h-[1px] bg-brass/15" />
                  <button
                    onClick={() => onSelectNode(node)}
                    className={`w-full p-3.5 rounded-xl border text-right transition-all cursor-pointer font-serif text-sm font-bold flex items-center justify-between gap-2 shadow-sm ${getReliabilityColor(node.reliability, isSelected)}`}
                  >
                    <span className="text-[9px] opacity-40 font-mono">L1</span>
                    <span className="flex items-center gap-2">
                      {node.name}
                      <Award className="w-3.5 h-3.5 text-brass-lt/80" />
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level 2: Families (البطون والعائلات) */}
        {filteredNodes.some(n => n.level === 2) && (
          <div className="space-y-4">
            <span className="text-[10px] text-brass-lt/50 font-kufi block text-right pr-6">البطون والعوائل الفرعية (عيّنة تفصيلية موثّقة):</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pr-12 relative">
              {filteredNodes.filter(n => n.level === 2).map(node => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div key={node.id} className="relative flex items-center justify-end">
                    {/* Connection line */}
                    <div className="absolute -right-6 w-6 h-[1px] bg-brass/10" />
                    <button
                      onClick={() => onSelectNode(node)}
                      className={`w-full p-2.5 rounded-lg border text-right transition-all cursor-pointer font-serif text-xs font-semibold flex items-center justify-between gap-2 shadow-sm ${getReliabilityColor(node.reliability, isSelected)}`}
                    >
                      <span className="text-[8px] opacity-30 font-mono">L2</span>
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
            <span className="text-[10px] text-brass-lt/50 font-kufi block text-right pr-6">توثيق بيت المشيخة (شيوخ شمل السياحين):</span>
            <div className="flex flex-wrap gap-2.5 justify-end pr-12">
              {filteredNodes.filter(n => n.level >= 3).map(node => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    className={`px-3 py-2 rounded-lg border text-right text-xs transition-all cursor-pointer font-serif font-semibold flex items-center gap-2 ${getReliabilityColor(node.reliability, isSelected)}`}
                  >
                    <span className="text-[8px] opacity-40 font-mono">L{node.level}</span>
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
