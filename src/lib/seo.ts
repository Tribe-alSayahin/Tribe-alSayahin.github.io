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

export const setSeoMeta = (title: string, robots: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.title = title;
  upsertMetaByName('robots', robots);
  upsertMetaByName('googlebot', robots);
};
