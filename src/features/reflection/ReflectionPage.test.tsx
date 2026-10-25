// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../../App.tsx';
import { createReflectionRepository, openDatabase } from '../../data/index.ts';
import { weekStart } from '../../domain/index.ts';
import { ReflectionPage } from './ReflectionPage.tsx';

afterEach(cleanup);

describe('Reflection route', () => {
  it('opens the Reflection page from #/reflection', () => {
    window.location.hash = '#/reflection';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Reflection' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has a Reflection link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Reflection' });
    expect(link.getAttribute('href')).toBe('#/reflection');
  });
});

describe('Reflection week range', () => {
  it('shows the current week, Monday to Sunday', () => {
    window.location.hash = '#/reflection';
    render(<App />);
    expect(screen.getByText(/This week:/)).toBeTruthy();
    window.location.hash = '';
  });
});

describe('Reflection what-worked prompt', () => {
  async function renderPage() {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    render(<ReflectionPage getRepository={async () => repo} />);
    return repo;
  }

  it('saves the response on submit for the current week', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('What worked this week?'), {
      target: { value: '  Demo: our Sunday call  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const stored = await repo.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.whatWorked).toBe('Demo: our Sunday call');
    expect(stored[0]?.weekStart).toBe(weekStart());
  });

  it('does not save a blank response', async () => {
    const repo = await renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Write a few words before saving.',
    );
    expect(await repo.list()).toEqual([]);
  });
});

describe('Reflection what-was-hard prompt', () => {
  it('saves the response on submit', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    render(<ReflectionPage getRepository={async () => repo} />);
    fireEvent.change(screen.getByLabelText('What was hard this week?'), {
      target: { value: ' Demo: the time difference ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const stored = await repo.list();
    expect(stored[0]?.whatWasHard).toBe('Demo: the time difference');
    expect(stored[0]?.whatWorked).toBeUndefined();
  });
});

describe('Reflection what-to-try prompt', () => {
  it('saves the response on submit', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    render(<ReflectionPage getRepository={async () => repo} />);
    fireEvent.change(
      screen.getByLabelText('What would you like to try next week?'),
      { target: { value: ' Demo: a shared playlist ' } },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const stored = await repo.list();
    expect(stored[0]?.whatToTry).toBe('Demo: a shared playlist');
  });
});

describe('Reflection appreciation prompt', () => {
  it('saves the response on submit', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    render(<ReflectionPage getRepository={async () => repo} />);
    fireEvent.change(
      screen.getByLabelText('What do you appreciate about the week?'),
      { target: { value: ' Demo: the surprise postcard ' } },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const stored = await repo.list();
    expect(stored[0]?.appreciation).toBe('Demo: the surprise postcard');
  });
});

describe('Partial reflection', () => {
  it('saves with one prompt answered and leaves the others unset', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    render(<ReflectionPage getRepository={async () => repo} />);
    fireEvent.change(screen.getByLabelText('What worked this week?'), {
      target: { value: 'Demo: an early night' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const [saved] = await repo.list();
    expect(saved?.whatWorked).toBe('Demo: an early night');
    expect('whatWasHard' in (saved ?? {})).toBe(false);
    expect('whatToTry' in (saved ?? {})).toBe(false);
    expect('appreciation' in (saved ?? {})).toBe(false);
  });
});

describe('Reflection edit', () => {
  it('refills the form with the saved responses for this week', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put({
      id: 'r1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      weekStart: weekStart(),
      whatWorked: 'Demo: a long walk',
      appreciation: 'Demo: a kind note',
    });
    render(<ReflectionPage getRepository={async () => repo} />);
    await waitFor(() =>
      expect(
        (screen.getByLabelText('What worked this week?') as HTMLTextAreaElement)
          .value,
      ).toBe('Demo: a long walk'),
    );
    expect(
      (
        screen.getByLabelText(
          'What do you appreciate about the week?',
        ) as HTMLTextAreaElement
      ).value,
    ).toBe('Demo: a kind note');
    expect(
      (screen.getByLabelText('What was hard this week?') as HTMLTextAreaElement)
        .value,
    ).toBe('');
  });

  it('updates the existing week record instead of adding another', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put({
      id: 'r1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      weekStart: weekStart(),
      whatWorked: 'Demo: a long walk',
    });
    render(<ReflectionPage getRepository={async () => repo} />);
    const box = screen.getByLabelText('What worked this week?');
    await waitFor(() =>
      expect((box as HTMLTextAreaElement).value).toBe('Demo: a long walk'),
    );
    fireEvent.change(box, { target: { value: 'Demo: a slow morning' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save reflection' }));
    await screen.findByRole('status');
    const stored = await repo.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.id).toBe('r1');
    expect(stored[0]?.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(stored[0]?.whatWorked).toBe('Demo: a slow morning');
  });
});

describe('Reflection history list', () => {
  const base = {
    schemaVersion: 1 as const,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  it('lists prior weeks, newest first, without this week', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put({
      ...base,
      id: 'a',
      weekStart: '2025-12-29',
      whatWorked: 'x',
    });
    await repo.put({
      ...base,
      id: 'b',
      weekStart: '2026-01-05',
      whatWorked: 'y',
    });
    await repo.put({
      ...base,
      id: 'c',
      weekStart: weekStart(),
      whatWorked: 'z',
    });
    render(<ReflectionPage getRepository={async () => repo} />);
    const items = await screen.findAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]?.textContent).toContain('Jan 5');
    expect(items[1]?.textContent).toContain('Dec 29');
  });

  it('shows no history section when there are no prior weeks', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    render(<ReflectionPage getRepository={async () => repo} />);
    await Promise.resolve();
    expect(screen.queryByText('Earlier weeks')).toBeNull();
  });
});

describe('Reflection detail', () => {
  it('shows all responses for the selected week and can go back', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put({
      id: 'a',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      weekStart: '2026-01-05',
      whatWorked: 'Demo: a slow morning',
      appreciation: 'Demo: a kind note',
    });
    render(<ReflectionPage getRepository={async () => repo} />);
    fireEvent.click(await screen.findByRole('button', { name: /Jan 5/ }));
    expect(screen.getByText('Demo: a slow morning')).toBeTruthy();
    expect(screen.getByText('Demo: a kind note')).toBeTruthy();
    expect(screen.getAllByText('Not answered.')).toHaveLength(2);
    fireEvent.click(
      screen.getByRole('button', { name: 'Back to earlier weeks' }),
    );
    expect(screen.getByText('Earlier weeks')).toBeTruthy();
  });
});

describe('Reflection delete confirmation', () => {
  async function setup() {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put({
      id: 'a',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      weekStart: '2026-01-05',
      whatWorked: 'Demo: a slow morning',
    });
    render(<ReflectionPage getRepository={async () => repo} />);
    fireEvent.click(await screen.findByRole('button', { name: /Jan 5/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    return repo;
  }

  it('keeps the entry when the person cancels', async () => {
    const repo = await setup();
    expect(screen.getByText(/This cannot be undone/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByText('Demo: a slow morning')).toBeTruthy();
    expect(await repo.list()).toHaveLength(1);
  });

  it('removes the entry once confirmed', async () => {
    const repo = await setup();
    fireEvent.click(screen.getByRole('button', { name: 'Yes, delete' }));
    await waitFor(() => expect(screen.queryByText('Earlier weeks')).toBeNull());
    expect(await repo.list()).toEqual([]);
  });
});
