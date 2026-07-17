import sanitizeHtml from 'sanitize-html';

export const NEWS_HTML_ALLOWED_TAGS = [
  'p',
  'br',
  'h2',
  'h3',
  'blockquote',
  'ul',
  'ol',
  'li',
  'strong',
  'em',
  'b',
  'i',
  'u',
  'a',
  'img',
  'figure',
  'figcaption',
  'hr',
] as const;

export const NEWS_HTML_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
};

/**
 * يعقّم HTML الأخبار عند حد العرض الموثوق أثناء البناء الثابت.
 * إبقاء التعقيم هنا يحمي المحتوى القديم وأي كتابة تتجاوز واجهة الإدارة.
 */
export function sanitizeNewsHtml(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [...NEWS_HTML_ALLOWED_TAGS],
    allowedAttributes: NEWS_HTML_ALLOWED_ATTRIBUTES,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
    },
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    enforceHtmlBoundary: true,
    transformTags: {
      a: (_tagName, attributes) => {
        if (attributes.target !== '_blank') {
          return { tagName: 'a', attribs: attributes };
        }

        return {
          tagName: 'a',
          attribs: { ...attributes, rel: 'noopener noreferrer' },
        };
      },
    },
  });
}
