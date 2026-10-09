import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDateLabel, formatLocalTime, localDate, nowIso } from './time.ts';

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

describe('formatLocalTime', () => {
  it('renders the stored instant in local time', () => {
    const local = new Date(2026, 5, 7, 15, 7);
    expect(formatLocalTime(local.toISOString(), 'en-US')).toBe('3:07 PM');
  });
});

describe('formatDateLabel', () => {
  const now = new Date(2026, 0, 10, 12);

  it('labels today and yesterday in words', () => {
    expect(formatDateLabel('2026-01-10', now)).toBe('Today');
    expect(formatDateLabel('2026-01-09', now)).toBe('Yesterday');
  });

  it('shows a readable date for older days', () => {
    expect(formatDateLabel('2026-01-03', now, 'en-US')).toBe('Jan 3, 2026');
  });
});
