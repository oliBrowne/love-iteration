import { describe, expect, expectTypeOf, it } from 'vitest';
import { DomainError } from './errors.ts';
import {
  parsePlannedStart,
  plannedDateStatuses,
  upcomingPlans,
} from './plannedDate.ts';
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

describe('upcomingPlans', () => {
  const make = (
    id: string,
    startsAt: string,
    status: PlannedDate['status'] = 'planned',
  ): PlannedDate => ({
    id,
    schemaVersion: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ideaId: 'demo-idea',
    startsAt,
    status,
  });
  const now = new Date('2026-03-01T12:00:00.000Z');

  it('sorts future plans soonest first', () => {
    const plans = [
      make('late', '2026-06-01T10:00:00.000Z'),
      make('soon', '2026-03-02T10:00:00.000Z'),
      make('mid', '2026-04-01T10:00:00.000Z'),
    ];
    expect(upcomingPlans(plans, now).map((p) => p.id)).toEqual([
      'soon',
      'mid',
      'late',
    ]);
  });

  it('drops past, done, and cancelled plans', () => {
    const plans = [
      make('past', '2026-02-01T10:00:00.000Z'),
      make('done', '2026-04-01T10:00:00.000Z', 'done'),
      make('cancelled', '2026-04-01T10:00:00.000Z', 'cancelled'),
      make('ok', '2026-04-02T10:00:00.000Z'),
    ];
    expect(upcomingPlans(plans, now).map((p) => p.id)).toEqual(['ok']);
  });
});
