import type { IndexedSection } from '../../lib/section-indexing';

interface SectionIndexProps {
  sections: readonly IndexedSection[];
}

export function SectionIndex({ sections }: SectionIndexProps) {
  return (
    <nav
      aria-labelledby="section-index-title"
      className="relative z-10 border-y border-brass/15 bg-ink-2 px-6 py-8 sm:py-10"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-brass/35 to-transparent" aria-hidden="true" />
          <h2 id="section-index-title" className="font-kufi text-sm text-brass-lt">
            فهرس أقسام الصفحة
          </h2>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-brass/35 to-transparent" aria-hidden="true" />
        </div>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="group flex h-full items-start gap-3 rounded-2xl border border-brass/15 bg-ink/60 p-4 transition-colors hover:border-brass/45 hover:bg-brass/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
              >
                <span className="font-ruqaa text-lg text-brass" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-serif text-lg text-sand transition-colors group-hover:text-brass-lt">
                    {section.title}
                  </span>
                  {' '}
                  <span className="mt-1 line-clamp-2 block font-sans text-xs leading-6 text-sand-dim">
                    {section.description}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
