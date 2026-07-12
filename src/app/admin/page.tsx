import type { Metadata } from 'next';
import AdminPage from '../../components/admin/AdminPage';

export const metadata: Metadata = {
  title: 'لوحة الإدارة',
  description: 'بوابة المشرفين لإدارة محتوى الموقع الرسمي لقبيلة السياحين.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'لوحة الإدارة | قبيلة السياحين',
    description: 'بوابة المشرفين لإدارة محتوى الموقع الرسمي لقبيلة السياحين.',
  },
};

export default function AdminRoute() {
  return <AdminPage />;
}
