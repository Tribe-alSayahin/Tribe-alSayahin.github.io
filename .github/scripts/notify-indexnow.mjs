const siteUrl = 'https://alsaihani.com';
const indexNowKey = process.env.INDEXNOW_KEY;

if (!indexNowKey) {
  throw new Error('INDEXNOW_KEY is required');
}

const sitemapResponse = await fetch(`${siteUrl}/sitemap.xml?deployed=${Date.now()}`, {
  headers: { 'cache-control': 'no-cache' },
});

if (!sitemapResponse.ok) {
  throw new Error(`Unable to fetch sitemap: HTTP ${sitemapResponse.status}`);
}

const sitemapXml = await sitemapResponse.text();
const urls = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g), ([, url]) =>
  url.replaceAll('&amp;', '&'),
).filter((url) => url.startsWith(`${siteUrl}/`));

if (urls.length === 0) {
  throw new Error('The deployed sitemap contains no canonical URLs');
}

const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(siteUrl).host,
    key: indexNowKey,
    keyLocation: `${siteUrl}/${indexNowKey}.txt`,
    urlList: urls,
  }),
});

if (!indexNowResponse.ok) {
  throw new Error(`IndexNow rejected the request: HTTP ${indexNowResponse.status}`);
}

console.log(`Submitted ${urls.length} canonical URLs to IndexNow.`);
