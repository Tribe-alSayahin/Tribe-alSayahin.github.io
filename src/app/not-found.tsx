import type { Metadata } from 'next';
import { NotFound } from '../components/NotFound';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة',
  description: 'الصفحة المطلوبة غير موجودة في الموقع الرسمي لقبيلة السياحين.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return <NotFound />;
}
