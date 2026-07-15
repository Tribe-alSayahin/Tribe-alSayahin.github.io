'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, Info, X } from 'lucide-react';
import type { TreeNode } from '../LineageTree.types';
import { RELIABILITY_LABELS, RELIABILITY_COLORS } from '../LineageTree.types';
import { getChildren } from '../LineageTree.utils';

interface ChildNodeProps {
  node: TreeNode;
  allNodes: TreeNode[];
  depth?: number;
}

/**
 * Recursive component that renders a single tree node at any depth >= 1.
 * Supports expand/collapse of children and an info popover for source and note.
 * Inspired by the hierarchical tree patterns in stemmagraph and family-organogram.
 */
export const ChildNode: React.FC<ChildNodeProps> = ({ node, allNodes, depth = 1 }) => {
  const [expanded, setExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const children = getChildren(node.id, allNodes);
  const hasChildren = children.length > 0;

  // Indent multiplier per depth level (max visual indent at depth 4+)
  const indentClass = depth <= 2 ? '' : depth === 3 ? 'mr-3' : 'mr-6';

  return (
    <div className={`relative ${indentClass}`}>
      {/* Node row */}
      <div className="flex items-center justify-between gap-2 py-1.5 group/child">
        {/* Left actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Info toggle */}
          <button
            onClick={() => setShowInfo((v) => !v)}
            aria-label={`معلومات ${node.name}`}
            className="p-0.5 rounded text-sand-dim/50 hover:text-brass transition-colors"
          >
            {showInfo ? (
              <X className="w-3 h-3" />
            ) : (
              <Info className="w-3 h-3" />
            )}
          </button>

          {/* Expand toggle */}
          {hasChildren && (
            <button
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label={`${expanded ? 'إخفاء' : 'عرض'} فروع ${node.name}`}
              className="p-0.5 rounded text-sand-dim/50 hover:text-brass transition-colors"
            >
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Node name + reliability badge */}
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`shrink-0 font-kufi text-[0.6rem] border rounded-full px-1.5 py-px ${RELIABILITY_COLORS[node.reliability]}`}
            title={RELIABILITY_LABELS[node.reliability]}
          >
            {RELIABILITY_LABELS[node.reliability]}
          </span>
          <span
            className={`font-serif text-right truncate transition-colors ${
              depth === 1
                ? 'text-sm text-sand'
                : depth === 2
                ? 'text-xs text-sand/80'
                : 'text-[0.7rem] text-sand-dim'
            }`}
          >
            {node.name}
          </span>
        </div>
      </div>

      {/* Info popover */}
      {showInfo && (
        <div className="mb-2 mr-2 rounded-xl border border-brass/20 bg-ink/70 p-3 text-right space-y-1 text-xs backdrop-blur-sm">
          {node.note && (
            <p className="text-sand/80 font-sans leading-relaxed">{node.note}</p>
          )}
          {node.source && (
            <p className="text-sand-dim/70 font-kufi text-[0.65rem]">
              المصدر: {node.source}
            </p>
          )}
        </div>
      )}

      {/* Children */}
      {expanded && hasChildren && (
        <div className="mt-1 border-r border-brass/20 pr-3 space-y-0.5">
          {children.map((child) => (
            <ChildNode key={child.id} node={child} allNodes={allNodes} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
