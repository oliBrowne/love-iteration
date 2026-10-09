// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
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

  it('links to the check-in form to edit today', async () => {
    await setup([checkIn(localDate(), 'glowing')]);
    const link = await screen.findByRole('link', { name: /Edit today/ });
    expect(link.getAttribute('href')).toBe('#/check-in');
  });

  it('shows nothing when only other days are saved', async () => {
    await setup([checkIn('2000-01-01', 'rough')]);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(screen.queryByTestId('today-summary')).toBeNull();
  });

  it('asks before deleting and keeps the check-in on cancel', async () => {
    await setup([checkIn(localDate(), 'glowing')]);
    fireEvent.click(
      await screen.findByRole('button', { name: /Delete today/ }),
    );
    expect(screen.getByText(/This cannot be undone/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Keep it' }));
    expect(screen.getByTestId('today-summary')).toBeTruthy();
  });

  it('deletes today only after confirmation', async () => {
    await setup([checkIn(localDate(), 'glowing')]);
    fireEvent.click(
      await screen.findByRole('button', { name: /Delete today/ }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Yes, delete' }));
    await waitFor(() =>
      expect(screen.queryByTestId('today-summary')).toBeNull(),
    );
  });

  it('opens an earlier check-in with its full note', async () => {
    const earlier = {
      ...checkIn('2000-01-01', 'rough'),
      note: 'Full demo note',
    };
    await setup([earlier]);
    fireEvent.click(await screen.findByRole('button', { name: /View/ }));
    expect(screen.getByTestId('detail-note').textContent).toBe(
      'Full demo note',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Back to Home' }));
    expect(screen.getByRole('heading', { name: 'Home' })).toBeTruthy();
  });
});
