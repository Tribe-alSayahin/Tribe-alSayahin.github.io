import type { Metadata } from 'next';
import { ShieldCheck, BadgeCheck, BookOpen, Users, Award, FileText } from 'lucide-react';

const siteUrl = 'https://alsaihani.com';

export const metadata: Metadata = {
  title: 'حسين بن علي بن بعاج ابن مسيلم | المشرف العام',
  description:
    'حسين بن علي بن بعاج ابن مسيلم — مدير الموقع الرسمي لقبيلة السياحين والمشرف العام على توثيق نسب القبيلة وديارها وشعرها وأرشيفها الاستشراقي. من آل مسيلم في قبيلة السياحين من الروقة من عتيبة.',
  keywords: [
    'حسين بن علي بن بعاج ابن مسيلم',
    'حسين السياحين',
    'حسين بن علي السياحين',
    'بعاج ابن مسيلم',
    'آل مسيلم السياحين',
    'مشرف موقع السياحين',
    'السياحين',
    'السيحاني',
    'عتيبة',
    'الروقة',
  ],
  authors: [{ name: 'حسين بن علي بن بعاج ابن مسيلم' }],
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteUrl}/hussain/` },
  openGraph: {
    type: 'profile',
    locale: 'ar_SA',
    siteName: 'الموقع الرسمي لقبيلة السياحين',
    title: 'حسين بن علي بن بعاج ابن مسيلم | مشرف الموقع الرسمي لقبيلة السياحين',
    description:
      'حسين بن علي بن بعاج ابن مسيلم — مدير الموقع الرسمي لقبيلة السياحين والمشرف العام على توثيق نسب القبيلة وديارها وشعرها وأرشيفها الاستشراقي. من آل مسيلم في قبيلة السياحين من الروقة من عتيبة.',
    url: `${siteUrl}/hussain/`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 640,
        alt: 'حسين بن علي بن بعاج ابن مسيلم — مشرف الموقع الرسمي لقبيلة السياحين',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'حسين بن علي بن بعاج ابن مسيلم | المشرف العام',
    description:
      'حسين بن علي بن بعاج ابن مسيلم، مدير الموقع الرسمي لقبيلة السياحين، من آل مسيلم من الروقة من عتيبة.',
    images: ['/og-image.png'],
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${siteUrl}/` },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'حسين بن علي بن بعاج ابن مسيلم',
      item: `${siteUrl}/hussain/`,
    },
  ],
};

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#hussain`,
  name: 'حسين بن علي بن بعاج ابن مسيلم',
  alternateName: [
    'حسين السياحين',
    'حسين بن علي السياحين',
    'حسين بن علي بن بعاج',
    'حسين ابن مسيلم',
    'حسين البعاجي',
  ],
  jobTitle: 'المشرف العام — الموقع الرسمي لقبيلة السياحين',
  description:
    'حسين بن علي بن بعاج ابن مسيلم، من آل مسيلم في قبيلة السياحين (السيحاني) من الروقة من عتيبة. مدير الموقع الرسمي لقبيلة السياحين والمشرف العام على توثيق نسب القبيلة وديارها وشعرها وأرشيفها الاستشراقي.',
  url: `${siteUrl}/hussain/`,
  sameAs: [`${siteUrl}/hussain/`, `${siteUrl}/#hussain`],
  memberOf: {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'قبيلة السياحين (السيحاني)',
    url: `${siteUrl}/`,
  },
  knowsAbout: [
    'نسب قبيلة السياحين',
    'تاريخ عتيبة',
    'آل مسيلم',
    'الأرشيف الاستشراقي لنجد',
    'الشعر النبطي',
    'وثائق نجد التاريخية',
    'هجرة الجثوم',
  ],
  nationality: {
    '@type': 'Country',
    name: 'المملكة العربية السعودية',
  },
  worksFor: {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'الموقع الرسمي لقبيلة السياحين',
    url: `${siteUrl}/`,
  },
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${siteUrl}/hussain/#webpage`,
  url: `${siteUrl}/hussain/`,
  name: 'حسين بن علي بن بعاج ابن مسيلم | الموقع الرسمي لقبيلة السياحين',
  description:
    'صفحة حسين بن علي بن بعاج ابن مسيلم، المشرف العام على الموقع الرسمي لقبيلة السياحين من الروقة من عتيبة.',
  inLanguage: 'ar-SA',
  isPartOf: { '@id': `${siteUrl}/#website` },
  mainEntity: { '@id': `${siteUrl}/#hussain` },
};

export default function HussainPage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-ink to-ink-2 relative overflow-hidden pt-24 pb-16">
        <div
          className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'var(--sadu)', backgroundSize: '40px 30px' }}
        />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brass/30 bg-brass/10 mb-8">
            <ShieldCheck className="w-4 h-4 text-brass-lt" />
            <span className="font-kufi text-xs text-brass-lt tracking-wider">
              إدارة وبناء المنصة الموثقة
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-sand leading-tight mb-4 flex items-center justify-center gap-3 flex-wrap">
            حسين بن علي بن بعاج ابن مسيلم
            <BadgeCheck className="w-10 h-10 text-brass-lt shrink-0" aria-label="موثّق" />
          </h1>

          <p className="font-kufi text-sm text-brass-lt mb-2 tracking-wider">المشرف العام</p>
          <p className="text-sand-dim/80 font-sans text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            من آل مسيلم في قبيلة السياحين (السيحاني) — من الروقة من عتيبة الهيلا
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="editorial-card p-8 md:p-12 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-brass/10 border border-brass/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-brass-lt" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-sand">نبذة</h2>
          </div>

          <p className="font-sans text-sand-dim leading-relaxed text-base md:text-lg mb-6">
            <strong className="text-sand font-bold">حسين بن علي بن بعاج ابن مسيلم</strong> من
            أبناء آل مسيلم الكرام في قبيلة السياحين (السيحاني)، من المزاحمة من الروقة من عتيبة
            الهيلا. يتولى الإشراف العام على{' '}
            <a href={`${siteUrl}/`} className="text-brass-lt hover:underline">
              الموقع الرسمي لقبيلة السياحين
            </a>{' '}
            ومسؤول مباشر عن تدقيق وجمع الوثائق والمقتبسات والمراجع التاريخية لنسب القبيلة
            وديارها وشعرها النبطي وأرشيفها الاستشراقي.
          </p>

          <p className="font-sans text-sand-dim leading-relaxed text-base md:text-lg">
            يعمل على توثيق إرث القبيلة توثيقاً دقيقاً يجمع بين المصادر التاريخية الأولية من
            كتابات المستشرقين والوثائق العثمانية والمراجع الأنسابية العربية الموثوقة، وذلك حفاظاً
            على الهوية والتراث الأصيل لأبناء السياحين في نجد وما حولها.
          </p>
        </div>
      </section>

      {/* Roles Section */}
      <section className="pb-16 px-6 max-w-4xl mx-auto">
        <h2 className="font-serif text-2xl font-bold text-sand mb-8 text-center">
          المهام والمسؤوليات
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <ShieldCheck className="w-6 h-6 text-brass-lt" />,
              title: 'المشرف العام',
              desc: 'الإشراف الكامل على محتوى الموقع الرسمي لقبيلة السياحين وإدارته.',
            },
            {
              icon: <FileText className="w-6 h-6 text-brass-lt" />,
              title: 'توثيق النسب',
              desc: 'تدقيق وجمع الوثائق التاريخية لنسب قبيلة السياحين من الروقة من عتيبة.',
            },
            {
              icon: <Users className="w-6 h-6 text-brass-lt" />,
              title: 'الأرشيف الاستشراقي',
              desc: 'جمع وتحليل المقتبسات من كتابات المستشرقين والوثائق الغربية عن نجد وعتيبة.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="editorial-card p-6 text-center flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-brass/10 border border-brass/30 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-serif font-bold text-sand text-lg">{item.title}</h3>
              <p className="font-sans text-sand-dim text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliation */}
      <section className="pb-20 px-6 max-w-4xl mx-auto">
        <div className="editorial-card p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Award className="w-6 h-6 text-brass-lt" />
            <h2 className="font-serif text-xl font-bold text-sand">الانتساب القبلي</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 font-kufi text-sm">
            {[
              'آل مسيلم',
              'قبيلة السياحين (السيحاني)',
              'المزاحمة',
              'الروقة',
              'عتيبة الهيلا',
              'نجد',
            ].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full border border-brass/25 bg-brass/8 text-brass-lt"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-brass/10">
            <a
              href="/nasab/"
              className="inline-flex items-center gap-2 font-kufi text-sm text-brass-lt hover:text-brass transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              استعرض ديوان نسب القبيلة
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
    </>
  );
}
