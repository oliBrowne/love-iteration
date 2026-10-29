import { describe, expect, it } from 'vitest';
import { exportCounts } from './exportCounts.ts';
import type { ExportData } from './exportData.ts';

describe('exportCounts', () => {
  it('lists a label and count for every record kind', () => {
    const data = {
      checkIns: [{}, {}],
      gratitude: [],
      memories: [{}],
      plans: [],
      ideas: [],
      rituals: [],
      ritualCompletions: [],
      reflections: [],
    } as unknown as ExportData;
    const counts = exportCounts(data);
    expect(counts).toHaveLength(8);
    expect(counts[0]).toEqual({
      key: 'checkIns',
      label: 'Check-ins',
      count: 2,
    });
    expect(counts.find((c) => c.key === 'memories')?.count).toBe(1);
    expect(counts.find((c) => c.key === 'plans')?.count).toBe(0);
  });
});
