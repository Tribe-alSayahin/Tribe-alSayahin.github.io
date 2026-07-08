export interface PoemVerse {
  firstHalf: string;
  secondHalf: string;
}

export interface Poem {
  id: string;
  title: string;
  category: 'ancients' | 'middle' | 'new' | 'jathum';
  categoryLabel: string;
  author: string;
  context: string;
  verses: PoemVerse[];
  thumbnail: string;
  excerpt: string;
  publishDate: string;
}

export interface SiyahinBranch {
  id: string;
  name: string;
  description: string;
  poets: {
    name: string;
    era: string;
    bio: string;
    verses: PoemVerse[];
  }[];
}

export interface GlossaryTerm {
  word: string;
  meaning: string;
  context: string;
}
