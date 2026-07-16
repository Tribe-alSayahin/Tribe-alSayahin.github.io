export type PoetryStatus = 'draft' | 'published';

export interface PoetryEntry {
  id: string;
  title: string;
  poet_name: string;
  story: string | null;
  poem_text: string;
  source: string | null;
  status: PoetryStatus;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface PoetryEntryWrite {
  title: string;
  poet_name: string;
  story?: string | null;
  poem_text: string;
  source?: string | null;
  status?: PoetryStatus;
  created_by?: string | null;
  updated_at?: string;
}
