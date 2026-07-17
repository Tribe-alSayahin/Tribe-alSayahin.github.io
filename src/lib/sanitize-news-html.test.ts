import { describe, expect, it } from 'vitest';
import { sanitizeNewsHtml } from './sanitize-news-html';

describe('sanitizeNewsHtml', () => {
  it('preserves the allowlisted rich-text structure used by news articles', () => {
    const html = '<h2>عنوان فرعي</h2><p>نص <strong>موثق</strong> و<em>مؤكد</em>.</p><ul><li>بند</li></ul><a href="https://alsaihani.com/news/">المصدر</a>';

    expect(sanitizeNewsHtml(html)).toBe(html);
  });

  it('removes executable elements, event handlers, and dangerous URL schemes', () => {
    const html = [
      '<script>alert(1)</script>',
      '<iframe src="https://evil.example"></iframe>',
      '<img src="x" onerror="alert(1)">',
      '<p onclick="alert(1)">خبر</p>',
      '<a href="javascript:alert(1)">رابط خطر</a>',
    ].join('');

    const clean = sanitizeNewsHtml(html);

    expect(clean).not.toMatch(/script|iframe|onerror|onclick|javascript:/i);
    expect(clean).toContain('<p>خبر</p>');
    expect(clean).toContain('<a>رابط خطر</a>');
  });

  it('allows safe images but strips unapproved attributes and data URLs', () => {
    const html = '<img src="https://alsaihani.com/image.jpg" alt="صورة الخبر" width="800" style="color:red"><img src="data:text/html;base64,PHNjcmlwdD4=" alt="خطر">';

    expect(sanitizeNewsHtml(html)).toBe(
      '<img src="https://alsaihani.com/image.jpg" alt="صورة الخبر" width="800" /><img alt="خطر" />',
    );
  });
});
