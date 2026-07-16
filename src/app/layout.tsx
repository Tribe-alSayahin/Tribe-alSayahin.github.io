import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { NavbarWrapper } from '../components/layout/NavbarWrapper';
import { FooterWrapper } from '../components/layout/FooterWrapper';
import { VisitorAuthGuard } from '../components/layout/VisitorAuthGuard';
import { AnalyticsTracker } from '../components/analytics/AnalyticsTracker';
import { OFFICIAL_LOGO_IMAGE_URL } from '../lib/branding';
import '../index.css';

const siteUrl = 'https://alsaihani.com';
const bingVerification = process.env.NEXT_PUBLIC_BING_VERIFICATION_CODE ?? '';
const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION_CODE ?? '';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'قبيلة السياحين (السيحاني) | الموقع الرسمي لقبيلة السياحين',
    template: '%s | الموقع الرسمي لقبيلة السياحين',
  },
  description:
    'الموقع الرسمي لقبيلة السياحين (السيحاني) من الروقة من عتيبة — توثيق النسب والديار والشعر النبطي والأرشيف الاستشراقي والأخبار والمناسبات.',
  keywords: [
    'السيحاني',
    'السياحين',
    'قبيلة السياحين',
    'الموقع الرسمي',
    'عتيبة',
    'الروقة',
    'المزاحمة',
    'هجرة الجثوم',
    'ديوان الشعر النبطي',
    'الأرشيف الاستشراقي',
    'وثائق نجد',
    'الأخبار',
    'المناسبات',
    'حسين بن علي بن بعاج ابن مسيلم',
    'حسين بن علي السياحين',
    'بعاج ابن مسيلم',
    'مشرف موقع السياحين',
    'آل مسيلم السياحين',
  ],
  authors: [
    { name: 'حسين بن علي بن بعاج ابن مسيلم' },
    { name: 'الموقع الرسمي لقبيلة السياحين' },
  ],
  applicationName: 'الموقع الرسمي لقبيلة السياحين',
  generator: 'Next.js',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  alternates: {
    canonical: '/',
    languages: {
      'ar-SA': '/',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: 'الموقع الرسمي لقبيلة السياحين',
    title: 'قبيلة السياحين (السيحاني) | الموقع الرسمي',
    description:
      'الموقع الرسمي لقبيلة السياحين (السيحاني) من الروقة من عتيبة — توثيق النسب والديار والشعر النبطي والأرشيف الاستشراقي والأخبار والمناسبات.',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 640,
        alt: 'شعار الموقع الرسمي لقبيلة السياحين على خلفية نحاسية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'قبيلة السياحين (السيحاني) | الموقع الرسمي',
    description:
      'الموقع الرسمي لقبيلة السياحين (السيحاني) من الروقة من عتيبة — توثيق النسب والديار والشعر النبطي والأرشيف الاستشراقي.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'TLLA8u0sNYnmx4nC4ClcIVoktOtyRVxyycDORVZlhSk',
    ...(yandexVerification ? { yandex: yandexVerification } : {}),
    other: {
      ...(bingVerification ? { 'msvalidate.01': [bingVerification] } : {}),
    },
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16' },
      {
        url: "/favicon.svg",
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-TileImage': '/mstile-150x150.png',
    'msapplication-TileColor': '#070503',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#070503' },
    { media: '(prefers-color-scheme: light)', color: '#fcfbf7' },
  ],
};

const organizationLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: 'قبيلة السياحين (السيحاني) | الموقع الرسمي',
      description:
        'الموقع الرسمي لقبيلة السياحين (السيحاني) من المزاحمة من الروقة من عتيبة — يوثّق نسب القبيلة وديارها وشعرها والأرشيف الاستشراقي.',
      inLanguage: 'ar-SA',
      isAccessibleForFree: true,
      isFamilyFriendly: true,
      image: `${siteUrl}/og-image.png`,
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'قبيلة السياحين (السيحاني)',
      alternateName: ['Al-Siyahin Tribe', 'Al-Siyahin', 'السيحاني'],
      url: `${siteUrl}/`,
      email: 'admin@alsaihani.com',
      logo: OFFICIAL_LOGO_IMAGE_URL,
      image: `${siteUrl}/og-image.png`,
      description:
        'فخذ السياحين (السيحاني) من المزاحمة من الروقة من عتيبة الهيلا — قبيلة عربية أصيلة في نجد وما حولها.',
      slogan: 'إرث تالد وديار أصيلة',
      areaServed: {
        '@type': 'Place',
        name: 'نجد، المملكة العربية السعودية',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 24.7333,
          longitude: 44.25,
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'SA',
          addressRegion: 'نجد',
          addressLocality: 'عالية نجد',
        },
      },
      location: {
        '@type': 'Place',
        name: 'عالية نجد',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 24.7333,
          longitude: 44.25,
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'SA',
          addressRegion: 'نجد',
          addressLocality: 'عالية نجد',
        },
      },
      knowsAbout: [
        'تاريخ القبائل العربية',
        'نسب عتيبة',
        'الشعر النبطي',
        'الأرشيف الاستشراقي',
        'ديار نجد',
        'هجرة الجثوم',
      ],
      member: [
        {
          '@type': 'OrganizationRole',
          member: {
            '@type': 'Person',
            '@id': `${siteUrl}/#hussain`,
            name: 'حسين بن علي بن بعاج ابن مسيلم',
            alternateName: ['حسين السياحين', 'حسين بن علي السياحين'],
            jobTitle: 'المشرف العام',
            description:
              'مدير الموقع الرسمي لقبيلة السياحين والمشرف العام، والمسؤول المباشر عن تدقيق وجمع الوثائق والمقتبسات والمراجع التاريخية لنسب وقبيلة السياحين من الروقة من عتيبة.',
            memberOf: { '@id': `${siteUrl}/#organization` },
          },
          roleName: 'المشرف العام',
          startDate: '2024',
        },
      ],
    },
  ],
};

const hussainPersonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#hussain`,
  name: 'حسين بن علي بن بعاج ابن مسيلم',
  alternateName: [
    'حسين السياحين',
    'حسين بن علي السياحين',
    'حسين بن علي بن بعاج',
    'حسين ابن مسيلم',
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
  ],
  nationality: {
    '@type': 'Country',
    name: 'المملكة العربية السعودية',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <Script id="theme-init" strategy="beforeInteractive">
        {`
          (function () {
            try {
              if (localStorage.getItem('siyahin-theme') === 'light') {
                document.documentElement.classList.add('light');
              }
            } catch (e) {}
          })();
        `}
      </Script>
      <body className="antialiased">
        <AnalyticsTracker />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[9999] focus:bg-brass focus:text-ink focus:px-4 focus:py-2 focus:rounded focus:font-sans focus:font-bold"
        >
          انتقل إلى المحتوى الرئيسي
        </a>
        <VisitorAuthGuard>
          <NavbarWrapper />
          <main id="main-content" className="relative">
            {children}
          </main>
          <FooterWrapper />
        </VisitorAuthGuard>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hussainPersonLd) }}
        />
      </body>
    </html>
  );
}
