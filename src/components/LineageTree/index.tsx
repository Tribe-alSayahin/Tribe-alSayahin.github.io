'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitMerge, Search, Download } from 'lucide-react';
import { LINEAGE_DATA } from './LineageTree.data';
import { TreeHierarchy } from './subcomponents/TreeHierarchy';
import { searchNodes, exportAsJson, exportAsGedcom, getAncestorIds } from './LineageTree.utils';

export default function LineageTree() {
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Improved search: searches across all levels (not just level 1).
   * When a match is found at any level, the top-level ancestor (level 1)
   * is included in the results so the card is always shown.
   * Inspired by the multi-level search in family-organogram/src/utils/search.ts.
   */
  const filteredBranches = useMemo(() => {
    const topLevel = LINEAGE_DATA.filter((n) => n.level === 1);
    if (!searchQuery.trim()) return topLevel;

    const matchedNodes = searchNodes(searchQuery, LINEAGE_DATA);
    const includedTopIds = new Set<string>();

    for (const node of matchedNodes) {
      if (node.level === 1) {
        includedTopIds.add(node.id);
      } else {
        // Climb ancestors to find the level-1 root
        const ancestorIds = getAncestorIds(node.id, LINEAGE_DATA);
        const level1Ancestor = ancestorIds.find(
          (id) => LINEAGE_DATA.find((n) => n.id === id)?.level === 1,
        );
        if (level1Ancestor) includedTopIds.add(level1Ancestor);
      }
    }

    return topLevel.filter((n) => includedTopIds.has(n.id));
  }, [searchQuery]);

  return (
    <div className="editorial-card p-5 md:p-8 shadow-2xl" id="nasab-tree-interactive">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brass/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brass/5 blur-[120px] pointer-events-none rounded-full" />
      
      {/* Header */}
      <div className="text-right space-y-3 mb-7 pb-6 border-b border-brass/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div className="space-y-2">
          <div className="section-kicker">
            <GitMerge className="w-3.5 h-3.5" aria-hidden="true" />
            النسب والفروع
          </div>
          <h3 className="font-ruqaa text-3xl md:text-5xl text-sand leading-tight">
            فخوذ السياحين من عتيبة
          </h3>
          <p className="text-xs md:text-sm text-sand-dim leading-relaxed max-w-2xl font-sans">
            الأفخاذ الرئيسية لقبيلة السياحين من عتيبة، مع فروعها وبطونها المتوارثة.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-brass/20 bg-brass/5 px-4 py-2 font-kufi text-xs text-brass-lt">
          الفخوذ الرئيسية
        </span>
      </div>

      {/* Main Content Areas */}
      <AnimatePresence mode="wait">
        <motion.div
          key="tree-tab"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-6 relative z-10"
        >
            {/* Search and Filters bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search — now covers all levels */}
              <div className="md:col-span-7 relative">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-sand-dim" />
                <input
                  type="text"
                  placeholder="ابحث في كل مستويات الشجرة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-ink/60 border border-brass/15 text-sand text-xs text-right placeholder-sand-dim/50 focus:border-brass/50 focus:ring-2 focus:ring-brass/20 focus:outline-none"
                />
              </div>

              {/* Export buttons — inspired by FamilyBackup from family-organogram */}
              <div className="md:col-span-5 flex items-center justify-end gap-2">
                <button
                  onClick={() => exportAsJson(LINEAGE_DATA)}
                  title="تصدير بيانات الشجرة بصيغة JSON"
                  className="flex items-center gap-1.5 rounded-xl border border-brass/20 bg-brass/5 px-3 py-2.5 font-kufi text-[0.65rem] text-sand-dim hover:border-brass/50 hover:text-brass transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  JSON
                </button>
                <button
                  onClick={() => exportAsGedcom(LINEAGE_DATA)}
                  title="تصدير بيانات الشجرة بصيغة GEDCOM المعيارية"
                  className="flex items-center gap-1.5 rounded-xl border border-brass/20 bg-brass/5 px-3 py-2.5 font-kufi text-[0.65rem] text-sand-dim hover:border-brass/50 hover:text-brass transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  GEDCOM
                </button>
              </div>
            </div>

            <TreeHierarchy filteredNodes={filteredBranches} allNodes={LINEAGE_DATA} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
