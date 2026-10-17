import { describe, expect, expectTypeOf, it } from 'vitest';
import { DomainError } from './errors.ts';
import { parsePlannedStart, plannedDateStatuses } from './plannedDate.ts';
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

describe('parsePlannedStart', () => {
  it('returns an ISO timestamp for the local day and time', () => {
    const iso = parsePlannedStart('2026-02-14T19:00');
    expect(new Date(iso).getTime()).toBe(
      new Date(2026, 1, 14, 19, 0).getTime(),
    );
    expect(iso).toBe(new Date(iso).toISOString());
  });

  it.each([
    '',
    'banana',
    '2026-02-30T10:00',
    '2026-13-01T10:00',
    '2026-02-14T25:00',
    '2026-02-14',
    null,
    undefined,
    42,
  ])('rejects %j', (value) => {
    expect(() => parsePlannedStart(value)).toThrow(DomainError);
    try {
      parsePlannedStart(value);
    } catch (error) {
      expect((error as DomainError).code).toBe('invalid-planned-start');
    }
  });
});
