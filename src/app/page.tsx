import type { Metadata } from 'next';
import HomePage from './HomePage';
import { buildPublicPageMetadata } from '../lib/site-metadata';
import { getPublishedSiteSections } from '../lib/site-sections-server';

const description =
  'الموقع الرسمي لقبيلة السياحين (السيحاني) — الديوان الرقمي لتوثيق نسب القبيلة وديارها التاريخية وشعرها النبطي والأرشيف الاستشراقي والأخبار.';

export const metadata: Metadata = buildPublicPageMetadata({
  title: 'قبيلة السياحين (السيحاني) | الموقع الرسمي لقبيلة السياحين',
  description,
  path: '/',
  absoluteTitle: true,
  keywords: ['قبيلة السياحين', 'السيحاني', 'نسب السياحين', 'ديار السياحين', 'شعر السياحين', 'الروقة من عتيبة'],
});

export default async function Page() {
  const sections = await getPublishedSiteSections(['home']);
  return <HomePage hero={sections.home} />;
}
