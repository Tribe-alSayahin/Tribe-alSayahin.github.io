import { MetadataRoute } from 'next';
import { getAllPostsForSitemap } from '../lib/posts';
import { getAllEventsForSitemap } from '../lib/events-server';

export const dynamic = 'force-static';

const siteUrl = 'https://alsaihani.com';

const staticPaths = [
  '',
  '/nasab/',
  '/diyar/',
  '/hawiya/',
  '/tarikh/',
  '/news/',
  '/events/',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === '' || path === '/news/' || path === '/events/' ? 'daily' : 'weekly',
    priority: path === '' ? 1.0 : path === '/news/' || path === '/events/' ? 0.9 : 0.8,
  }));

  const posts = await getAllPostsForSitemap();
  const newsEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/news/${post.slug}/`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const events = await getAllEventsForSitemap();
  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${siteUrl}/events/${event.slug}/`,
    lastModified: new Date(event.updated_at),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticEntries, ...newsEntries, ...eventEntries];
}
