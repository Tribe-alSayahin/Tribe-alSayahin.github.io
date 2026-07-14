'use client';

import { BookOpen } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { baajPoemLines, baajStory } from './PoetryCouncil.data';

export default function PoetryCouncil() {
  return (
    <div className="bg-ink-2/50 border border-brass/20 rounded-3xl p-space-6 md:p-space-10 shadow-xl" id="diwan-poet">
      <div className="max-w-3xl mx-auto space-y-space-6">
        <div className="text-center space-y-space-4">
          <Badge variant="brass" showDot={true} className="font-kufi text-xs px-space-3 py-space-1 bg-brass/10">
            رواية شفوية موثقة
          </Badge>
          <div className="mx-auto w-16 h-16 rounded-2xl border border-brass/25 bg-brass/10 flex items-center justify-center text-brass-lt">
            <BookOpen className="w-8 h-8" aria-hidden="true" />
          </div>
          <h3 className="text-2xl md:text-3xl font-serif text-sand font-bold">قصيدة الشيخ بعاج بن علوش بن فرج بن مسيلم</h3>
          <p className="text-sm text-sand-dim leading-loose">
            من محفوظات الديار عن رحلة الكسب من الأجناب، وما تبعها من وصية الشيخ بعاج لابنه عيد على شيخة الذود.
          </p>
        </div>

        <section className="rounded-2xl border border-brass/20 bg-ink/70 p-space-5 md:p-space-7" aria-labelledby="baaj-story-title">
          <h4 id="baaj-story-title" className="font-serif text-xl text-brass-lt font-bold mb-space-4">السالفة</h4>
          <div className="space-y-space-3 text-sand-dim leading-loose font-serif">
            {baajStory.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <article className="rounded-2xl border border-brass/20 bg-ink/70 p-space-5 md:p-space-7">
          <p className="font-kufi text-xs text-brass-lt mb-space-4">مقام القصيدة: سهوات عفيف والجثوم</p>
          <div className="space-y-space-2 text-sand leading-loose text-base md:text-lg font-serif">
            {baajPoemLines.map((line) => (
              <p key={line} className="text-center">
                {line}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
