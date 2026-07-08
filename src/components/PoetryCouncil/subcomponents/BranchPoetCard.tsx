import React from 'react';
import { Award, BookOpen, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

interface BranchPoetCardProps {
  poet: {
    name: string;
    era: string;
    bio: string;
    verses: { firstHalf: string; secondHalf: string; }[];
  };
  index: number;
  activeBranchName: string;
}

export const BranchPoetCard: React.FC<BranchPoetCardProps> = ({ poet, index, activeBranchName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="flex flex-col h-full"
    >
      <Card
        hoverGlow={true}
        className="bg-[#150f09] border border-brass/15 rounded-3xl p-space-6 md:p-space-8 flex flex-col h-full justify-between space-y-space-6 shadow-xl relative overflow-hidden group hover:border-brass/40 transition-colors duration-base ease-brand text-right"
      >
        {/* Background decorative watermark */}
        <div className="absolute -bottom-8 -left-8 text-brass/[0.02] transform -rotate-12 select-none pointer-events-none">
          <Quote className="w-40 h-40" />
        </div>

        <div className="space-y-space-4 relative z-10 text-right">
          {/* Poet Header Info */}
          <div className="flex justify-between items-start flex-row-reverse border-b border-brass/10 pb-space-4">
            <div className="space-y-space-1">
              <h4 className="font-serif text-base md:text-lg font-extrabold text-brass-lt">
                {poet.name}
              </h4>
              <p className="text-[10px] text-sand-dim/80 font-kufi">
                الفترة الزمنية: {poet.era}
              </p>
            </div>
            <div className="bg-brass/10 p-2.5 rounded-2xl border border-brass/20 text-brass-lt shrink-0">
              <BookOpen className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-space-1">
            <span className="text-[10px] text-sand-dim/50 font-kufi block">لمحة تاريخية:</span>
            <p className="text-xs text-sand-dim leading-relaxed font-sans font-medium">
              {poet.bio}
            </p>
          </div>

          {/* Representative Poem Snippet */}
          <div className="space-y-space-2 pt-space-2">
            <span className="text-[10px] text-brass-lt/70 font-kufi block">من روائع الأبيات:</span>
            <div className="bg-[#fcf8ef] border-2 border-[#cfbe9c] rounded-2xl p-space-4 text-amber-950 font-serif space-y-space-3 relative shadow-inner">
              <div className="absolute top-2 left-2 opacity-5 pointer-events-none">
                <Quote className="w-8 h-8 text-amber-900" />
              </div>
              {poet.verses.map((verse, vIdx) => (
                <div key={vIdx} className="space-y-space-1 text-center text-[11px] md:text-xs">
                  <div className="font-bold text-amber-950/90 leading-normal">
                    {verse.firstHalf}
                  </div>
                  <div className="flex items-center justify-center gap-space-1.5 opacity-60">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-900 rotate-45" />
                    <span className="w-4 h-[1px] bg-amber-900/40" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-900 rotate-45" />
                  </div>
                  <div className="font-bold text-amber-900 leading-normal italic">
                    {verse.secondHalf}
                  </div>
                  {vIdx < poet.verses.length - 1 && (
                    <div className="border-b border-amber-900/10 my-space-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-space-2 relative z-10 border-t border-brass/10">
          <Badge variant="brass" showDot={true}>
            <Award className="w-3 h-3 inline mr-space-1" />
            شعر موروث {activeBranchName}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
};
