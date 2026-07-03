import React from 'react';
import { BookOpen, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Poem } from '../PoetryCouncil.types';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

interface PoemCardProps {
  poem: Poem;
  isSelected: boolean;
  onSelect: () => void;
  onOpenModal: () => void;
}

export const PoemCard: React.FC<PoemCardProps> = ({ poem, isSelected, onSelect, onOpenModal }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="flex flex-col h-full"
    >
      <Card
        hoverGlow={isSelected}
        className={`bg-ink-2/40 border rounded-2xl overflow-hidden flex flex-col h-full justify-between transition-all duration-base ease-brand relative group ${
          isSelected 
            ? 'border-brass/60 shadow-lg shadow-brass/5 bg-brass/5' 
            : 'border-brass/15 hover:border-brass/30'
        }`}
      >
        {/* Card Decorative Cover (Image-free, using elegant Sadu and calligraphic gradient vectors) */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#1c120a] to-[#0c0804] border-b border-brass/10">
          {/* Micro Sadu Pattern */}
          <div className="absolute inset-0 opacity-[0.06] bg-repeat" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '36px 22px' }} />
          
          {/* Glowing radial gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-brass/5 rounded-full blur-2xl" />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Decorative book/feather pen vector glow */}
            <div className="w-12 h-12 rounded-full bg-brass/10 border border-brass/20 flex items-center justify-center text-brass-lt shadow-inner">
              <BookOpen className="w-6 h-6 text-brass-lt" />
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="brass" showDot={true}>
              {poem.categoryLabel}
            </Badge>
          </div>

          {/* Date Badge */}
          <div className="absolute bottom-3 right-3 z-10">
            <Badge variant="muted" showDot={false}>
              <Calendar className="w-3 h-3 text-brass mr-space-1 inline" />
              <span>{poem.publishDate}</span>
            </Badge>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-space-5 flex-1 flex flex-col justify-between text-right space-y-space-4">
          <div className="space-y-space-2">
            <h4 className="font-serif text-base font-bold text-sand group-hover:text-brass-lt transition-colors duration-base line-clamp-2">
              {poem.title.replace(' (نموذج عرض توضيحي)', '')}
            </h4>
            <p className="text-xs text-sand-dim leading-relaxed font-sans line-clamp-3">
              {poem.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-space-3 border-t border-brass/10">
            <span className="text-[10px] text-sand-dim/60 font-serif">الراوي: {poem.author.replace(' (نموذج عرض توضيحي)', '').replace('نموذج عرض توضيحي - ', '')}</span>
            <div className="flex gap-space-2">
              <Button
                variant={isSelected ? "primary" : "secondary"}
                onClick={onSelect}
                className="px-space-3 py-space-1.5 text-[10px] h-auto font-kufi font-bold"
                title="عرض في لوحة المعاني أدناه"
              >
                عرض باللوحة
              </Button>
              <Button
                variant="brass"
                onClick={onOpenModal}
                className="px-space-3 py-space-1.5 text-[10px] h-auto font-kufi font-bold flex items-center gap-space-1"
              >
                <BookOpen className="w-3 h-3" />
                اقرأ بالنافذة
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
