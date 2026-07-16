'use client';

import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { fetchPublishedPoetryEntries, type PoetryEntry } from '../../lib/poetry';

export default function PoetryCouncil() {
  const [entries, setEntries] = useState<PoetryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadEntries = async () => {
      const result = await fetchPublishedPoetryEntries();
      if (!mounted) return;
      if (result.error) {
        setLoadFailed(true);
      } else {
        setEntries(result.data ?? []);
      }
      setLoading(false);
    };

    void loadEntries();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-ink-2/50 border border-brass/20 rounded-3xl p-space-6 md:p-space-10 shadow-xl" id="diwan-poet">
      <div className="max-w-3xl mx-auto space-y-space-8">
        <div className="text-center space-y-space-4">
          <div className="mx-auto w-16 h-16 rounded-2xl border border-brass/25 bg-brass/10 flex items-center justify-center text-brass-lt">
            <BookOpen className="w-8 h-8" aria-hidden="true" />
          </div>
          <h3 className="text-2xl md:text-3xl font-serif text-sand font-bold">ديوان الشعر النبطي الموثق</h3>
        </div>

        {loading && <p className="text-center text-sm font-kufi text-sand-dim">جارٍ تحميل الديوان...</p>}
        {!loading && loadFailed && (
          <p className="text-center text-sm font-kufi text-sand-dim">تعذر تحميل الديوان الآن. حاول مرة أخرى لاحقًا.</p>
        )}
        {!loading && !loadFailed && entries.length === 0 && (
          <p className="text-center text-sm font-kufi text-sand-dim">لا توجد قصائد منشورة حاليًا.</p>
        )}
        {entries.map((entry) => {
          const storyParagraphs = (entry.story ?? '')
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean);
          const poemLines = entry.poem_text
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

          return (
            <article key={entry.id} className="space-y-space-5">
              <header className="text-center space-y-space-2">
                <h4 className="font-serif text-2xl text-brass-lt font-bold">{entry.title}</h4>
                <p className="text-sm font-kufi text-sand-dim">الشاعر: {entry.poet_name}</p>
              </header>

              {storyParagraphs.length > 0 && (
                <section className="rounded-2xl border border-brass/20 bg-ink/70 p-space-5 md:p-space-7">
                  <h5 className="font-serif text-xl text-brass-lt font-bold mb-space-4">القصة</h5>
                  <div className="space-y-space-3 text-sand-dim leading-loose font-serif">
                    {storyParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-2xl border border-brass/20 bg-ink/70 p-space-5 md:p-space-7">
                <h5 className="font-serif text-xl text-brass-lt font-bold mb-space-4">القصيدة</h5>
                <div className="space-y-space-2 text-sand leading-loose text-base md:text-lg font-serif">
                  {poemLines.map((line) => (
                    <p key={line} className="text-center">
                      {line}
                    </p>
                  ))}
                </div>
                {entry.source && (
                  <p className="mt-space-5 border-t border-brass/10 pt-space-3 text-xs font-kufi text-sand-dim">
                    المصدر: {entry.source}
                  </p>
                )}
              </section>
            </article>
          );
        })}
      </div>
    </div>
  );
}
