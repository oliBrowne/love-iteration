import { describe, expect, expectTypeOf, it } from 'vitest';
import { plannedDateStatuses } from './plannedDate.ts';
import type { PlannedDate, PlannedDateStatus } from './plannedDate.ts';
import type { RecordMetadata } from './record.ts';

describe('PlannedDate', () => {
  it('has ideaId, startsAt, status and record metadata', () => {
    expectTypeOf<PlannedDate>().toMatchTypeOf<RecordMetadata>();
    expectTypeOf<PlannedDate['ideaId']>().toEqualTypeOf<string>();
    expectTypeOf<PlannedDate['startsAt']>().toEqualTypeOf<string>();
    expectTypeOf<PlannedDate['status']>().toEqualTypeOf<PlannedDateStatus>();
    const demo: PlannedDate = {
      id: 'demo-plan-1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      ideaId: 'demo-idea-1',
      startsAt: '2026-02-14T19:00:00.000Z',
      status: 'planned',
    };
    expect(plannedDateStatuses).toContain(demo.status);
  });
});
