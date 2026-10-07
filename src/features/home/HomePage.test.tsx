// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it } from 'vitest';
import { createCheckInRepository, openDatabase } from '../../data/index.ts';
import { formatLocalTime, localDate } from '../../domain/index.ts';
import type { CheckIn } from '../../domain/index.ts';
import { HomePage } from './HomePage.tsx';

afterEach(cleanup);

function checkIn(date: string, mood: CheckIn['mood']): CheckIn {
  return {
    id: `id-${date}`,
    schemaVersion: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    date,
    mood,
    note: '',
  };
}

async function setup(records: CheckIn[]) {
  const repo = createCheckInRepository(await openDatabase(new IDBFactory()));
  for (const record of records) await repo.put(record);
  render(<HomePage getRepository={async () => repo} />);
}

describe('HomePage summary', () => {
  it('shows the mood saved today', async () => {
    await setup([checkIn(localDate(), 'glowing')]);
    expect((await screen.findByTestId('today-summary')).textContent).toContain(
      'Glowing',
    );
  });

  it('shows when today was last edited in local time', async () => {
    await setup([checkIn(localDate(), 'glowing')]);
    const time = formatLocalTime('2026-01-01T00:00:00.000Z');
    expect((await screen.findByTestId('today-summary')).textContent).toContain(
      `Last edited at ${time}`,
    );
  });

  it('shows nothing when only other days are saved', async () => {
    await setup([checkIn('2000-01-01', 'rough')]);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(screen.queryByTestId('today-summary')).toBeNull();
  });
});
