import type { Metadata } from 'next';
import HomePage from './HomePage';

export const metadata: Metadata = {
  title: 'الرئيسية',
  description:
    'الموقع الرسمي لقبيلة السياحين (السيحاني) — الديوان الرقمي لتوثيق نسب القبيلة وديارها التاريخية وشعرها النبطي والأرشيف الاستشراقي والأخبار.',
  alternates: { canonical: 'https://alsaihani.com/' },
  openGraph: {
    title: 'قبيلة السياحين (السيحاني) | الموقع الرسمي',
    description:
      'الموقع الرسمي لقبيلة السياحين (السيحاني) — الديوان الرقمي لتوثيق نسب القبيلة وديارها التاريخية وشعرها النبطي والأرشيف الاستشراقي والأخبار.',
  },
};

export default function Page() {
  return <HomePage />;
}
