import type { PoetryEntry } from './poetry-types';
import { buildSeoExcerpt } from './seo';

export function buildPoetryDescription(entry: PoetryEntry): string {
  const context = entry.story?.trim() || entry.poem_text.trim();
  return buildSeoExcerpt(
    `${entry.title} للشاعر ${entry.poet_name}. ${context} قصيدة نبطية موثقة في ديوان الموقع الرسمي لقبيلة السياحين.`,
    159,
  );
}

export function splitPoetryLines(poemText: string): string[] {
  return poemText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
