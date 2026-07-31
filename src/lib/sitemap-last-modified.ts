import type { SiteSectionKey } from './site-sections-shared';

interface UpdatedItem {
  updated_at: string;
}

interface SectionUpdate extends UpdatedItem {
  section_key: SiteSectionKey;
}

interface SitemapUpdateSources {
  sections: readonly SectionUpdate[];
  posts: readonly UpdatedItem[];
  events: readonly UpdatedItem[];
  poetry: readonly UpdatedItem[];
}

const SECTION_PATHS: Partial<Record<SiteSectionKey, string>> = {
  home: '/',
  jathum: '/nasab/',
  lineage: '/nasab/',
  constellation: '/nasab/',
  gallery: '/diyar/',
  wasm: '/hawiya/',
  poetry: '/hawiya/',
  timeline: '/tarikh/',
  archive: '/tarikh/',
};

function assignLatest(target: Map<string, Date>, path: string, value: string) {
  const candidate = new Date(value);
  if (Number.isNaN(candidate.getTime())) return;

  const current = target.get(path);
  if (!current || candidate > current) {
    target.set(path, candidate);
  }
}

export function buildStaticLastModifiedMap({
  sections,
  posts,
  events,
  poetry,
}: SitemapUpdateSources): ReadonlyMap<string, Date> {
  const updates = new Map<string, Date>();

  for (const section of sections) {
    const path = SECTION_PATHS[section.section_key];
    if (path) assignLatest(updates, path, section.updated_at);
  }

  for (const post of posts) assignLatest(updates, '/news/', post.updated_at);
  for (const event of events) assignLatest(updates, '/events/', event.updated_at);
  for (const entry of poetry) assignLatest(updates, '/poetry/', entry.updated_at);

  return updates;
}
