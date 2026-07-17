import { describe, expect, it } from 'vitest';
import { formatVisitorDate } from './visitor-directory';

describe('visitor directory formatting', () => {
  it('returns a safe label for an invalid date', () => {
    expect(formatVisitorDate('not-a-date')).toBe('غير متاح');
  });

  it('formats a valid date for Arabic readers', () => {
    expect(formatVisitorDate('2026-07-17T10:00:00.000Z')).not.toBe('غير متاح');
  });
});
