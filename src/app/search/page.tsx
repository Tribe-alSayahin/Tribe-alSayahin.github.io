import { Search } from 'lucide-react';
import { SiteSearch } from '../../components/search/SiteSearch';
import { buildPublicPageMetadata } from '../../lib/site-metadata';

export const metadata = {
  ...buildPublicPageMetadata({
    title: 'البحث في الموقع الرسمي لقبيلة السياحين',
    description: 'ابحث في أخبار قبيلة السياحين وتاريخها ونسبها وديارها ومحتواها التراثي الموثق.',
    path: '/search/',
    keywords: ['البحث في موقع السياحين', 'أخبار السياحين', 'تاريخ السياحين', 'ديوان السياحين'],
  }),
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <section
      className="min-h-screen px-5 pb-20 pt-32 md:px-8 md:pt-36"
      data-pagefind-ignore="all"
    >
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8 border-b border-brass/20 pb-7">
          <div className="mb-3 flex items-center gap-3 text-brass-lt">
            <Search className="h-6 w-6" aria-hidden="true" />
            <span className="font-kufi text-xs">فهرس المحتوى العام</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-sand md:text-4xl">البحث في الموقع</h1>
        </header>

        <SiteSearch />
      </div>
    </section>
  );
}
