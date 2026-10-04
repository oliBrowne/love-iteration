import { afterEach, describe, expect, it, vi } from 'vitest';
import { nowIso } from './time.ts';

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
