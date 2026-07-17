import { MetadataRoute } from 'next';
import { getAllPostsForSitemap } from '../lib/posts';
import { getAllEventsForSitemap } from '../lib/events-server';
import { getAllPoetryForSitemap } from '../lib/poetry-server';
import { STATIC_ROUTE_PATHS } from '../lib/navigation';

export const dynamic = 'force-static';

const siteUrl = 'https://alsaihani.com';

/** hreflang alternates لصفحة واحدة (عربية فقط) */
function buildAlternates(path: string) {
  const url = `${siteUrl}${path}`;
  return {
    languages: {
      'ar-SA': url,
      'x-default': url,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTE_PATHS.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === '/' || path === '/news/' || path === '/events/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1.0 : path === '/news/' || path === '/events/' ? 0.9 : path === '/hussain/' ? 0.85 : 0.8,
    alternates: buildAlternates(path),
  }));

  const posts = await getAllPostsForSitemap();
  const newsEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/news/${post.slug}/`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
    alternates: buildAlternates(`/news/${post.slug}/`),
  }));

  const events = await getAllEventsForSitemap();
  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${siteUrl}/events/${event.slug}/`,
    lastModified: new Date(event.updated_at),
    changeFrequency: 'weekly',
    priority: 0.75,
    alternates: buildAlternates(`/events/${event.slug}/`),
  }));

  const poetry = await getAllPoetryForSitemap();
  const poetryEntries: MetadataRoute.Sitemap = poetry.map((entry) => ({
    url: `${siteUrl}/poetry/${entry.id}/`,
    lastModified: new Date(entry.updated_at),
    changeFrequency: 'weekly',
    priority: 0.75,
    alternates: buildAlternates(`/poetry/${entry.id}/`),
  }));

  return [...staticEntries, ...newsEntries, ...eventEntries, ...poetryEntries];
}
