import type { Metadata } from 'next';

export const SITE_URL = 'https://alsaihani.com';
export const SITE_NAME = 'الموقع الرسمي لقبيلة السياحين';

interface PublicPageMetadataOptions {
  title: string;
  description: string;
  path: `/${string}`;
  keywords?: string[];
  absoluteTitle?: boolean;
  openGraphType?: 'website' | 'profile';
}

export function buildPublicPageMetadata({
  title,
  description,
  path,
  keywords,
  absoluteTitle = false,
  openGraphType = 'website',
}: PublicPageMetadataOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ar-SA': canonicalUrl,
        'x-default': canonicalUrl,
      },
    },
    openGraph: {
      type: openGraphType,
      locale: 'ar_SA',
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 640,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}
