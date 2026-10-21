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
import {
  createRitualCompletionRepository,
  createRitualRepository,
  openDatabase,
} from '../../data/index.ts';
import { localDate } from '../../domain/index.ts';
import { RitualsPage } from './RitualsPage.tsx';

afterEach(cleanup);

describe('Rituals route', () => {
  it('opens the Rituals page from #/rituals', () => {
    window.location.hash = '#/rituals';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Rituals' })).toBeTruthy();
    window.location.hash = '';
  });

  it('has a Rituals link in the main navigation', () => {
    window.location.hash = '';
    render(<App />);
    const link = screen.getByRole('link', { name: 'Rituals' });
    expect(link.getAttribute('href')).toBe('#/rituals');
  });
});

describe('Ritual form', () => {
  let completions: ReturnType<typeof createRitualCompletionRepository>;

  async function renderPage() {
    const db = await openDatabase(new IDBFactory());
    const repo = createRitualRepository(db);
    completions = createRitualCompletionRepository(db);
    render(
      <RitualsPage
        getRepository={async () => repo}
        getCompletionRepository={async () => completions}
      />,
    );
    return repo;
  }

  it('creates a ritual from a name and cadence', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Ritual name'), {
      target: { value: '  Demo: Sunday call  ' },
    });
    fireEvent.change(screen.getByLabelText('Cadence'), {
      target: { value: 'weekly' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save ritual' }));
    expect((await screen.findByRole('status')).textContent).toBe('Saved.');
    const stored = await repo.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      name: 'Demo: Sunday call',
      cadence: 'weekly',
    });
    expect(screen.getByText('Demo: Sunday call')).toBeTruthy();
  });

  it('refuses a blank name', async () => {
    const repo = await renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Save ritual' }));
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Give this ritual a name.',
    );
    expect(await repo.list()).toEqual([]);
  });

  it('shows first-use copy until a ritual is saved', async () => {
    await renderPage();
    expect(await screen.findByText(/No rituals yet/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Ritual name'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save ritual' }));
    await screen.findByRole('status');
    expect(screen.queryByText(/No rituals yet/)).toBeNull();
  });

  async function saveDemo() {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Ritual name'), {
      target: { value: 'Demo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save ritual' }));
    await screen.findByRole('status');
    fireEvent.click(screen.getByRole('button', { name: 'Edit Demo' }));
    return repo;
  }

  it('persists edits to name and cadence', async () => {
    const repo = await saveDemo();
    fireEvent.change(screen.getByLabelText('Edit name'), {
      target: { value: '  Demo: renamed  ' },
    });
    fireEvent.change(screen.getByLabelText('Edit cadence'), {
      target: { value: 'weekly' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await screen.findByText('Demo: renamed');
    const [saved] = await repo.list();
    expect(saved).toMatchObject({ name: 'Demo: renamed', cadence: 'weekly' });
    cleanup();
    render(<RitualsPage getRepository={async () => repo} />);
    expect(await screen.findByText('Demo: renamed')).toBeTruthy();
  });

  it('refuses a blank edited name and keeps the original', async () => {
    const repo = await saveDemo();
    fireEvent.change(screen.getByLabelText('Edit name'), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await screen.findByRole('alert');
    expect((await repo.list())[0]?.name).toBe('Demo');
  });

  it('archives a ritual out of the active list but keeps it stored', async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Ritual name'), {
      target: { value: 'Demo: Morning hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save ritual' }));
    await screen.findByText('Demo: Morning hello');
    fireEvent.click(
      screen.getByRole('button', { name: 'Archive Demo: Morning hello' }),
    );
    await screen.findByText(/No rituals yet/);
    expect(
      screen.queryByRole('button', { name: 'Archive Demo: Morning hello' }),
    ).toBeNull();
    const stored = await repo.list();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.archivedAt).toBeTruthy();
    // The archived view keeps the record readable.
    expect(screen.getByText(/Archived rituals \(1\)/)).toBeTruthy();
    expect(screen.getByText('Demo: Morning hello')).toBeTruthy();
  });

  it("records today's completion for a daily ritual", async () => {
    const repo = await renderPage();
    fireEvent.change(screen.getByLabelText('Ritual name'), {
      target: { value: 'Demo: Morning hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save ritual' }));
    await screen.findByText('Demo: Morning hello');
    const ritual = (await repo.list())[0];
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Mark Demo: Morning hello done today',
      }),
    );
    await waitFor(async () => expect(await completions.list()).toHaveLength(1));
    expect((await completions.list())[0]).toMatchObject({
      ritualId: ritual?.id,
      date: localDate(),
    });
    expect(await screen.findByText('Done today')).toBeTruthy();
  });

  it('does not record a second completion for the same day', async () => {
    await renderPage();
    fireEvent.change(screen.getByLabelText('Ritual name'), {
      target: { value: 'Demo: Morning hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save ritual' }));
    await screen.findByText('Demo: Morning hello');
    const mark = screen.getByRole('button', {
      name: 'Mark Demo: Morning hello done today',
    });
    fireEvent.click(mark);
    fireEvent.click(mark);
    await screen.findByText('Done today');
    fireEvent.click(mark);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(await completions.list()).toHaveLength(1);
  });

  it("removes today's completion with undo", async () => {
    await renderPage();
    fireEvent.change(screen.getByLabelText('Ritual name'), {
      target: { value: 'Demo: Morning hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save ritual' }));
    await screen.findByText('Demo: Morning hello');
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Mark Demo: Morning hello done today',
      }),
    );
    await screen.findByText('Done today');
    fireEvent.click(
      screen.getByRole('button', { name: 'Undo Demo: Morning hello today' }),
    );
    await waitFor(() => expect(screen.queryByText('Done today')).toBeNull());
    expect(await completions.list()).toHaveLength(0);
  });
});
