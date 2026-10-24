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
});
