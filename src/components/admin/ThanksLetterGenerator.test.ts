import { describe, expect, it } from 'vitest';
import { HERITAGE_REQUEST_PARAGRAPHS } from './ThanksLetterGenerator';

describe('heritage contribution request letter', () => {
  const letterText = HERITAGE_REQUEST_PARAGRAPHS.join(' ');

  it('requests the core heritage materials from notables and historians', () => {
    expect(letterText).toContain('قصص موثقة');
    expect(letterText).toContain('قصائد نبطية');
    expect(letterText).toContain('أعيان القبيلة');
    expect(letterText).toContain('الباحثين والمؤرخين');
  });

  it('directs the recipient to the official contact section and protects attribution', () => {
    expect(letterText).toContain('alsaihani.com/news/#contact');
    expect(letterText).toContain('حفظ نسبة المادة إلى صاحبها ومصدرها');
  });
});
