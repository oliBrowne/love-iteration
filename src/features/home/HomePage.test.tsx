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
import {
  createCheckInRepository,
  createGratitudeRepository,
  createIdeaRepository,
  createPlanRepository,
  createRitualCompletionRepository,
  createRitualRepository,
  openDatabase,
} from '../../data/index.ts';
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

  it('moves from an entry to the older one', async () => {
    await setup([
      { ...checkIn('2000-01-02', 'good'), note: 'Newer demo note' },
      { ...checkIn('2000-01-01', 'rough'), note: 'Older demo note' },
    ]);
    fireEvent.click(
      (await screen.findAllByRole('button', { name: /View/ }))[0]!,
    );
    expect(screen.getByTestId('detail-note').textContent).toBe(
      'Newer demo note',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Previous entry' }));
    expect(screen.getByTestId('detail-note').textContent).toBe(
      'Older demo note',
    );
    expect(
      screen
        .getByRole('button', { name: 'Previous entry' })
        .hasAttribute('disabled'),
    ).toBe(true);
  });
});

describe('HomePage gratitude preview', () => {
  it('shows the most recent appreciation', async () => {
    const db = await openDatabase(new IDBFactory());
    const gratitude = createGratitudeRepository(db);
    const base = { schemaVersion: 1, updatedAt: '2026-03-02T09:00:00.000Z' };
    await gratitude.put({
      ...base,
      id: 'g1',
      createdAt: '2026-03-01T09:00:00.000Z',
      date: '2026-03-01',
      text: 'Demo: older thanks',
    });
    await gratitude.put({
      ...base,
      id: 'g2',
      createdAt: '2026-03-02T09:00:00.000Z',
      date: '2026-03-02',
      text: 'Demo: newest thanks',
    });
    const checkIns = createCheckInRepository(db);
    render(
      <HomePage
        getRepository={async () => checkIns}
        getGratitudeRepo={async () => gratitude}
      />,
    );
    expect((await screen.findByTestId('gratitude-preview')).textContent).toBe(
      'Demo: newest thanks',
    );
  });

  it('shows no preview when there are no appreciations', async () => {
    const db = await openDatabase(new IDBFactory());
    const gratitude = createGratitudeRepository(db);
    const checkIns = createCheckInRepository(db);
    render(
      <HomePage
        getRepository={async () => checkIns}
        getGratitudeRepo={async () => gratitude}
      />,
    );
    await screen.findByRole('heading', { name: 'Home' });
    expect(screen.queryByTestId('gratitude-preview')).toBeNull();
  });
});

describe('HomePage idea preview', () => {
  const base = {
    schemaVersion: 1,
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-03-01T09:00:00.000Z',
    note: '',
  };

  it('links to one active idea', async () => {
    const db = await openDatabase(new IDBFactory());
    const ideas = createIdeaRepository(db);
    await ideas.put({
      ...base,
      id: 'i1',
      title: 'Demo: done',
      state: 'completed',
    });
    await ideas.put({
      ...base,
      id: 'i2',
      title: 'Demo: picnic',
      state: 'active',
    });
    render(
      <HomePage
        getRepository={async () => createCheckInRepository(db)}
        getIdeaRepo={async () => ideas}
      />,
    );
    expect((await screen.findByTestId('idea-preview')).textContent).toBe(
      'Demo: picnic',
    );
    expect(
      screen.getByRole('link', { name: 'Open Ideas' }).getAttribute('href'),
    ).toBe('#/ideas');
  });

  it('shows no preview when every idea is done or none exist', async () => {
    const db = await openDatabase(new IDBFactory());
    const ideas = createIdeaRepository(db);
    await ideas.put({
      ...base,
      id: 'i1',
      title: 'Demo: done',
      state: 'completed',
    });
    render(
      <HomePage
        getRepository={async () => createCheckInRepository(db)}
        getIdeaRepo={async () => ideas}
      />,
    );
    await screen.findByRole('heading', { name: 'Home' });
    await waitFor(() =>
      expect(screen.queryByTestId('idea-preview')).toBeNull(),
    );
  });
});

describe('HomePage plan preview', () => {
  const base = {
    schemaVersion: 1,
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-03-01T09:00:00.000Z',
  };

  async function setupPlans(
    plans: { id: string; startsAt: string; status: 'planned' | 'cancelled' }[],
  ) {
    const db = await openDatabase(new IDBFactory());
    const ideas = createIdeaRepository(db);
    const planRepo = createPlanRepository(db);
    await ideas.put({
      ...base,
      id: 'i1',
      title: 'Demo: picnic',
      note: '',
      state: 'active',
    });
    for (const plan of plans)
      await planRepo.put({ ...base, ideaId: 'i1', ...plan });
    render(
      <HomePage
        getRepository={async () => createCheckInRepository(db)}
        getIdeaRepo={async () => ideas}
        getPlanRepo={async () => planRepo}
      />,
    );
  }

  it('shows the soonest upcoming plan', async () => {
    await setupPlans([
      { id: 'p1', startsAt: '2099-06-01T10:00:00.000Z', status: 'planned' },
      { id: 'p2', startsAt: '2098-06-01T10:00:00.000Z', status: 'planned' },
      { id: 'p3', startsAt: '2097-06-01T10:00:00.000Z', status: 'cancelled' },
    ]);
    const preview = await screen.findByTestId('plan-preview');
    expect(preview.textContent).toContain('Demo: picnic');
    expect(preview.textContent).toContain('2098');
  });

  it('shows nothing when no plan is upcoming', async () => {
    await setupPlans([
      { id: 'p1', startsAt: '2099-06-01T10:00:00.000Z', status: 'cancelled' },
    ]);
    await screen.findByRole('heading', { name: 'Home' });
    await waitFor(() =>
      expect(screen.queryByTestId('plan-preview')).toBeNull(),
    );
  });
});

describe('HomePage rituals preview', () => {
  const stamp = '2026-01-01T00:00:00.000Z';
  const base = { schemaVersion: 1, createdAt: stamp, updatedAt: stamp };

  async function setupRituals() {
    const db = await openDatabase(new IDBFactory());
    const rituals = createRitualRepository(db);
    const completions = createRitualCompletionRepository(db);
    await rituals.put({
      ...base,
      id: 'r1',
      name: 'Demo: Morning hello',
      cadence: 'daily',
    });
    await rituals.put({
      ...base,
      id: 'r3',
      name: 'Demo: Sunday call',
      cadence: 'weekly',
    });
    await rituals.put({
      ...base,
      id: 'r2',
      name: 'Demo: Evening call',
      cadence: 'daily',
    });
    await completions.put({
      ...base,
      id: 'c1',
      ritualId: 'r2',
      date: localDate(),
    });
    render(
      <HomePage
        getRepository={async () => createCheckInRepository(db)}
        getRitualRepo={async () => rituals}
        getRitualCompletionRepo={async () => completions}
      />,
    );
  }

  it('lists daily rituals that are not done today', async () => {
    await setupRituals();
    const list = await screen.findByTestId('ritual-preview');
    expect(list.textContent).toContain('Demo: Morning hello');
    expect(list.textContent).not.toContain('Demo: Evening call');
  });

  it('lists a weekly ritual as due this week', async () => {
    await setupRituals();
    const list = await screen.findByTestId('ritual-preview');
    expect(list.textContent).toContain('Demo: Sunday call · this week');
  });
});
