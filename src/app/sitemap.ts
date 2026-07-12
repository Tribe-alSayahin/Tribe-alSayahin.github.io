import { MetadataRoute } from 'next';
import { getAllPostSlugs } from '../lib/posts';

export const dynamic = 'force-static';

const siteUrl = 'https://alsaihani.com';

const staticPaths = [
  '',
  '/nasab/',
  '/diyar/',
  '/hawiya/',
  '/tarikh/',
  '/news/',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === '' || path === '/news/' ? 'daily' : 'weekly',
    priority: path === '' ? 1.0 : path === '/news/' ? 0.9 : 0.8,
  }));

  const slugs = await getAllPostSlugs();
  const newsEntries: MetadataRoute.Sitemap = slugs.map((post) => ({
    url: `${siteUrl}/news/${post.slug}/`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticEntries, ...newsEntries];
}
