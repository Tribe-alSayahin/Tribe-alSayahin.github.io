export interface TreeNode {
  id: string;
  name: string;
  parent_id: string | null;
  level: number;
  source: string;
  reliability: 1 | 2 | 3;
  note: string;
}

/** Human-readable labels for each reliability level. */
export const RELIABILITY_LABELS: Record<1 | 2 | 3, string> = {
  1: 'موثق',
  2: 'محتمل',
  3: 'غير مؤكد',
};

/** Tailwind colour tokens for each reliability level. */
export const RELIABILITY_COLORS: Record<1 | 2 | 3, string> = {
  1: 'border-brass/40 bg-brass/10 text-brass-lt',
  2: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  3: 'border-sand-dim/30 bg-sand-dim/5 text-sand-dim',
};
