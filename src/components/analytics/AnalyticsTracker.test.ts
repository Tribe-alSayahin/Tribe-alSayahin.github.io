import { describe, expect, it } from 'vitest';
import { shouldTrackAnalyticsPath } from './AnalyticsTracker';

describe('analytics path filtering', () => {
  it('tracks public website pages', () => {
    expect(shouldTrackAnalyticsPath('/')).toBe(true);
    expect(shouldTrackAnalyticsPath('/news/example')).toBe(true);
    expect(shouldTrackAnalyticsPath('/hawiya')).toBe(true);
  });

  it('does not track administration or preview pages', () => {
    expect(shouldTrackAnalyticsPath('/admin')).toBe(false);
    expect(shouldTrackAnalyticsPath('/admin/settings')).toBe(false);
    expect(shouldTrackAnalyticsPath('/preview/archive')).toBe(false);
  });
});
