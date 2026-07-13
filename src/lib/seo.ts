const upsertMetaByName = (name: string, content: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const HTML_ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

export const buildSeoExcerpt = (content: string, maxLength = 160) => {
  const plainText = content
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(nbsp|amp|lt|gt|quot|#39);/g, (entity) => HTML_ENTITY_MAP[entity] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return plainText.length <= maxLength ? plainText : `${plainText.slice(0, maxLength).trim()}…`;
};

export const setSeoMeta = (title: string, robots: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.title = title;
  upsertMetaByName('robots', robots);
  upsertMetaByName('googlebot', robots);
};
