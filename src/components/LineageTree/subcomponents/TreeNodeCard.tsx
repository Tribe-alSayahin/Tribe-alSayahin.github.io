'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, Info, X } from 'lucide-react';
import type { TreeNode } from '../LineageTree.types';
import { RELIABILITY_LABELS, RELIABILITY_COLORS } from '../LineageTree.types';
import { getChildren, countDescendants } from '../LineageTree.utils';
import { ChildNode } from './ChildNode';

interface TreeNodeCardProps {
  node: TreeNode;
  allNodes: TreeNode[];
  index: number;
}

/**
 * Top-level fakhd (level 1) card.
 * Shows descendants count, reliability badge, source/note popover,
 * and an expandable list of level-2+ children rendered by ChildNode.
 *
 * Patterns borrowed from:
 * - family-organogram: countDescendants, reliability-aware display
 * - stemmagraph: expand/collapse node children
 */
export const TreeNodeCard: React.FC<TreeNodeCardProps> = ({ node, allNodes, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const children = getChildren(node.id, allNodes);
  const hasChildren = children.length > 0;
  const totalDescendants = countDescendants(node.id, allNodes);

  return (
    <div className="group relative rounded-2xl border border-brass/20 bg-ink/35 px-5 pt-5 pb-4 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass/60 hover:bg-brass/8 hover:shadow-[0_4px_24px_rgba(212,175,55,0.12)] focus-within:border-brass/60">
      {/* Ornamental number */}
      <span
        className="absolute top-3 left-4 font-ruqaa text-4xl leading-none text-brass/20 transition-colors group-hover:text-brass/40 select-none"
        aria-hidden="true"
      >
        {(index + 1).toLocaleString('ar-SA')}
      </span>

      {/* Header row: name + badges */}
      <div className="flex items-start justify-between gap-3 pt-2">
        {/* Left badges */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {/* Reliability badge */}
          <span
            className={`font-kufi text-[0.6rem] border rounded-full px-2 py-px ${RELIABILITY_COLORS[node.reliability]}`}
            title={`مستوى الموثوقية: ${RELIABILITY_LABELS[node.reliability]}`}
          >
            {RELIABILITY_LABELS[node.reliability]}
          </span>

          {/* Descendants count (inspired by countDescendants from family-organogram) */}
          {totalDescendants > 0 && (
            <span className="font-kufi text-[0.6rem] border border-brass/15 bg-brass/5 text-sand-dim rounded-full px-2 py-px">
              {totalDescendants} فرع
            </span>
          )}
        </div>

        {/* Fakhd name */}
        <p className="font-serif text-xl md:text-2xl font-bold text-sand text-right leading-snug">
          {node.name}
        </p>
      </div>

      {/* Note preview (collapsed) */}
      {node.note && !showInfo && (
        <p className="text-right text-[0.7rem] text-sand-dim/60 font-sans leading-relaxed line-clamp-2">
          {node.note}
        </p>
      )}

      {/* Info panel: full source + note */}
      {showInfo && (
        <div className="rounded-xl border border-brass/15 bg-ink/60 p-3 text-right space-y-1.5 text-xs">
          {node.note && (
            <p className="text-sand/80 font-sans leading-relaxed">{node.note}</p>
          )}
          {node.source && (
            <p className="text-sand-dim/60 font-kufi text-[0.65rem]">
              المصدر: {node.source}
            </p>
          )}
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center justify-between gap-2 border-t border-brass/10 pt-2.5">
        {/* Info toggle */}
        <button
          onClick={() => setShowInfo((v) => !v)}
          aria-label={showInfo ? 'إخفاء المصدر والتفاصيل' : 'عرض المصدر والتفاصيل'}
          className="flex items-center gap-1 font-kufi text-[0.65rem] text-sand-dim/60 hover:text-brass transition-colors"
        >
          {showInfo ? (
            <>
              <X className="w-3 h-3" />
              إخفاء التفاصيل
            </>
          ) : (
            <>
              <Info className="w-3 h-3" />
              المصدر والتفاصيل
            </>
          )}
        </button>

        {/* Expand/collapse children button */}
        {hasChildren && (
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={`${expanded ? 'إخفاء' : 'عرض'} فروع ${node.name}`}
            className="flex items-center gap-1 font-kufi text-[0.65rem] text-sand-dim/60 hover:text-brass transition-colors"
          >
            {expanded ? 'إخفاء الفروع' : 'الفروع والبطون'}
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Children: expandable multi-level list */}
      {expanded && hasChildren && (
        <div className="border-r border-brass/20 pr-3 space-y-0.5 mt-1">
          {children.map((child) => (
            <ChildNode key={child.id} node={child} allNodes={allNodes} depth={1} />
          ))}
        </div>
      )}

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-brass/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
  );
};
