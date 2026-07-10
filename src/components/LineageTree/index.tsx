import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitMerge, Search } from 'lucide-react';
import { LINEAGE_DATA } from './LineageTree.data';
import { TreeHierarchy } from './subcomponents/TreeHierarchy';

export default function LineageTree() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBranches = LINEAGE_DATA.filter(
    (node) => node.level === 1 && node.name.includes(searchQuery),
  );

  const allNodes = LINEAGE_DATA;

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
              {/* Search */}
              <div className="md:col-span-7 relative">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-sand-dim" />
                <input
                  type="text"
                  placeholder="ابحث في أسماء الشجرة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-ink/60 border border-brass/15 text-sand text-xs text-right placeholder-sand-dim/50 focus:border-brass/50 focus:ring-2 focus:ring-brass/20 focus:outline-none"
                />
              </div>

              <p className="md:col-span-5 text-right md:text-left text-xs text-sand-dim/80 font-kufi">
                اختر فخذًا من القائمة
              </p>
            </div>

            <TreeHierarchy filteredNodes={filteredBranches} allNodes={allNodes} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
