import { describe, expect, it } from 'vitest';
import { planMerge } from './mergeRecords.ts';

const rec = (id: string, updatedAt: string) => ({
  id,
  schemaVersion: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt,
});

describe('planMerge', () => {
  it('adds new IDs, updates newer records, and skips older or equal ones', () => {
    const existing = [
      rec('a', '2026-02-01T00:00:00.000Z'),
      rec('b', '2026-02-01T00:00:00.000Z'),
      rec('c', '2026-02-01T00:00:00.000Z'),
    ];
    const incoming = [
      rec('a', '2026-03-01T00:00:00.000Z'),
      rec('b', '2026-01-01T00:00:00.000Z'),
      rec('c', '2026-02-01T00:00:00.000Z'),
      rec('d', '2026-01-01T00:00:00.000Z'),
    ];
    const plan = planMerge(existing, incoming);
    expect(plan.toWrite.map((r) => r.id)).toEqual(['a', 'd']);
    expect([plan.added, plan.updated, plan.skipped]).toEqual([1, 1, 2]);
  });
});
