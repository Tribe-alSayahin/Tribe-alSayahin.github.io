import type { Metadata } from 'next';
import HomePage from './HomePage';

export const metadata: Metadata = {
  title: 'الرئيسية',
  description:
    'الموقع الرسمي لقبيلة السياحين (السيحاني) — مدخل الديوان الرقمي لنسب القبيلة وديارها وشعرها والأرشيف والأخبار.',
  openGraph: {
    title: 'قبيلة السياحين (السيحاني) | الموقع الرسمي',
    description:
      'الموقع الرسمي لقبيلة السياحين (السيحاني) — مدخل الديوان الرقمي لنسب القبيلة وديارها وشعرها والأرشيف والأخبار.',
  },
};

export default function Page() {
  return <HomePage />;
}
