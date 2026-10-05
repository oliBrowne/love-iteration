import { afterEach, describe, expect, it, vi } from 'vitest';
import { localDate, nowIso } from './time.ts';

describe('nowIso', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the frozen time as an ISO string', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-04T05:06:07.089Z'));
    expect(nowIso()).toBe('2026-03-04T05:06:07.089Z');
  });
});

describe('localDate', () => {
  it('formats the local calendar day with zero padding', () => {
    expect(localDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
    expect(localDate(new Date(2026, 11, 31, 0, 0))).toBe('2026-12-31');
  });
});
