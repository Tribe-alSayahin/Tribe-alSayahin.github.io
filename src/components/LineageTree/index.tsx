import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitMerge, Search, SlidersHorizontal, BookOpenCheck 
} from 'lucide-react';
import { TreeNode } from './LineageTree.types';
import { LINEAGE_DATA } from './LineageTree.data';
import { DetailPanel } from './subcomponents/DetailPanel';
import { ReliabilityRegister } from './subcomponents/ReliabilityRegister';
import { TreeHierarchy } from './subcomponents/TreeHierarchy';

export default function LineageTree() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tree' | 'sources'>('tree');
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(LINEAGE_DATA[0]);
  const [reliabilityFilter, setReliabilityFilter] = useState<number | null>(null);

  // Filter nodes based on search and reliability
  const filteredNodes = LINEAGE_DATA.filter(node => {
    const matchesSearch = node.name.includes(searchQuery) || node.note.includes(searchQuery);
    const matchesReliability = reliabilityFilter ? node.reliability === reliabilityFilter : true;
    return matchesSearch && matchesReliability;
  });

  return (
    <div className="bg-gradient-to-br from-[#120c06] to-[#1c130a] border border-brass/20 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden" id="nasab-tree-interactive">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brass/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brass/5 blur-[120px] pointer-events-none rounded-full" />
      
      {/* Header */}
      <div className="text-right space-y-3 mb-8 pb-6 border-b border-brass/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass/10 border border-brass/25 text-brass-lt text-xs font-kufi">
            <GitMerge className="w-3.5 h-3.5 animate-[spin_4s_linear_infinite]" />
            شجرة النسب والأفخاذ التفاعلية الموثقة
          </div>
          <h3 className="text-2xl md:text-4xl font-serif text-sand font-bold tracking-wide">
            شجرة أنساب فخذ السياحين عتيبة
          </h3>
          <p className="text-xs md:text-sm text-sand-dim leading-relaxed max-w-3xl font-sans">
            تحليل نسبي دقيق وعرض هيكلي لشجرة قبيلة <strong className="text-brass-lt">السياحين</strong> وفروعها وبطونها، مبني على ضوء موسوعة البدو والمصادر العربية المحكمة ومصنف بـ <strong className="text-brass-lt">درجة موثوقية تاريخية صارمة</strong>.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-ink/80 border border-brass/20 rounded-xl p-1 gap-1 self-stretch md:self-auto shrink-0 font-kufi">
          <button
            onClick={() => setActiveTab('tree')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'tree'
                ? 'bg-brass text-ink font-bold shadow-md'
                : 'text-sand-dim hover:text-sand'
            }`}
          >
            <GitMerge className="w-4 h-4" />
            الهيكل الشجري التفاعلي
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'sources'
                ? 'bg-brass text-ink font-bold shadow-md'
                : 'text-sand-dim hover:text-sand'
            }`}
          >
            <BookOpenCheck className="w-4 h-4" />
            سجل الموثوقية والمصادر
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <AnimatePresence mode="wait">
        {activeTab === 'tree' && (
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
              <div className="md:col-span-6 relative">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-sand-dim" />
                <input
                  type="text"
                  placeholder="ابحث عن فخذ، بطن، أو أسرة بالسياحين..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-[#0e0a05] border border-brass/15 text-sand text-xs text-right placeholder-sand-dim/50 focus:border-brass/50 focus:ring-1 focus:ring-brass/30 focus:outline-none"
                />
              </div>

              {/* Reliability filters */}
              <div className="md:col-span-6 flex flex-wrap gap-2 justify-end items-center text-xs font-kufi">
                <span className="text-sand-dim text-[11px] ml-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brass" />
                  تصنيف الموثوقية:
                </span>
                <button
                  onClick={() => setReliabilityFilter(null)}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    reliabilityFilter === null
                      ? 'bg-brass/25 border-brass text-brass-lt font-semibold'
                      : 'bg-ink/40 border-brass/10 text-sand-dim hover:text-sand'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setReliabilityFilter(1)}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                    reliabilityFilter === 1
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold'
                      : 'bg-ink/40 border-brass/10 text-sand-dim hover:text-sand'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  مستوى 1
                </button>
                <button
                  onClick={() => setReliabilityFilter(2)}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                    reliabilityFilter === 2
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                      : 'bg-ink/40 border-brass/10 text-sand-dim hover:text-sand'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  مستوى 2
                </button>
                <button
                  onClick={() => setReliabilityFilter(3)}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                    reliabilityFilter === 3
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-semibold'
                      : 'bg-ink/40 border-brass/10 text-sand-dim hover:text-sand'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  مستوى 3
                </button>
              </div>
            </div>

            {/* Tree Workspace and Sidebar Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Detail panel of selected branch */}
              <div className="lg:col-span-4 order-2 lg:order-1">
                <DetailPanel selectedNode={selectedNode} />
              </div>

              {/* Right Side: Visual Tree Hierarchy */}
              <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
                <TreeHierarchy
                  filteredNodes={filteredNodes}
                  selectedNode={selectedNode}
                  onSelectNode={setSelectedNode}
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sources' && (
          <ReliabilityRegister lineageData={LINEAGE_DATA} />
        )}
      </AnimatePresence>
    </div>
  );
}
