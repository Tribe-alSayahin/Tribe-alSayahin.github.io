import { describe, expect, it } from 'vitest';
import {
  MAX_EVENT_IMAGE_SIZE_BYTES,
  sanitizeFileName,
  validateEventImageFile,
} from './events';

describe('event media upload validation', () => {
  it('accepts supported image formats within the size limit', () => {
    const file = new File(['image'], 'صورة المناسبة.webp', { type: 'image/webp' });

    expect(validateEventImageFile(file)).toBeNull();
  });

  it('rejects executable and unsupported file types even when the extension looks safe', () => {
    const file = new File(['script'], 'photo.jpg', { type: 'text/html' });

    expect(validateEventImageFile(file)).toContain('صيغة غير مدعومة');
  });

  it('rejects images larger than the configured upload limit', () => {
    const file = new File([new Uint8Array(MAX_EVENT_IMAGE_SIZE_BYTES + 1)], 'large.png', {
      type: 'image/png',
    });

    expect(validateEventImageFile(file)).toContain('أكبر من 5MB');
  });

  it('normalizes path-sensitive file names before storage upload', () => {
    expect(sanitizeFileName('../../صورة مناسبة<script>.JpG')).toBe('صورة-مناسبة-script.jpg');
  });
});
